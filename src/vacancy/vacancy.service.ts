import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VacancyEntity } from './vacancy.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import {
  CreateVacancyDto,
  VacancyResponseDto,
  VacancyResponseType,
} from './dto/vacancy.dto';
import {
  TestEntity,
  ResponseEntity,
  TestResultEntity,
  TestType,
} from '../entities';
import { UserRole } from '../user/user.entity';
import { ResponseStatus } from '../response/response.entity';

@Injectable()
export class VacancyService {
  constructor(
    @InjectRepository(VacancyEntity)
    private vacancyRepository: Repository<VacancyEntity>,
    @InjectRepository(TestEntity)
    private testRepository: Repository<TestEntity>,
    @InjectRepository(ResponseEntity) // Добавляем репозиторий откликов
    private responseRepository: Repository<ResponseEntity>,
    @InjectRepository(TestResultEntity)
    private testResultRepository: Repository<TestResultEntity>,
  ) {}

  async createVacancy(
    data: CreateVacancyDto,
    user: User,
  ): Promise<VacancyEntity> {
    const { testId, ...vacancyData } = data;

    const vacancy = this.vacancyRepository.create({
      ...vacancyData,
      employer: user,
      employerId: user.id,
      test: testId ? { id: testId } : null, // Привязываем тест, если указан
    });

    return this.vacancyRepository.save(vacancy);
  }

  async deleteVacancy(id: number, employerId: number): Promise<void> {
    const result = await this.vacancyRepository.delete({ id, employerId });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Vacancy with ID ${id} not found or you don't have permission`,
      );
    }
  }

  async updateVacancy(
    id: number,
    employerId: number,
    updateData: Partial<VacancyEntity>,
  ): Promise<VacancyEntity> {
    const vacancy = await this.vacancyRepository.findOne({
      where: { id, employerId },
    });

    if (!vacancy) {
      throw new NotFoundException(
        `Vacancy with ID ${id} not found or you don't have permission`,
      );
    }

    Object.assign(vacancy, updateData);
    return this.vacancyRepository.save(vacancy);
  }

  async getEmployerVacancies(employerId: number): Promise<VacancyEntity[]> {
    return this.vacancyRepository.find({
      where: { employerId },
      order: { createdAt: 'DESC' },
    });
  }

  async getVacancyWithRoleBasedInfo(
    vacancyId: number,
    user: User,
  ): Promise<VacancyResponseType> {
    const vacancy = await this.vacancyRepository.findOne({
      where: { id: vacancyId },
      relations: [
        'employer',
        'responses',
        'responses.seeker',
        'responses.testResults',
        'test',
      ],
      order: {
        responses: {
          createdAt: 'DESC',
        },
      },
    });

    if (!vacancy) {
      throw new NotFoundException(`Vacancy with ID ${vacancyId} not found`);
    }

    // Базовая информация о вакансии
    const baseVacancyInfo = {
      id: vacancy.id,
      title: vacancy.title,
      description: vacancy.description,
      salary_min: vacancy.salary_min,
      salary_max: vacancy.salary_max,
      is_active: vacancy.is_active,
      createdAt: vacancy.createdAt,
      updatedAt: vacancy.updatedAt,
      employer: {
        id: vacancy.employer.id,
        firstName: vacancy.employer.firstName,
        lastName: vacancy.employer.lastName,
        company: vacancy.employer.company,
      },
      test: vacancy.test
        ? {
            id: vacancy.test.id,
            title: vacancy.test.title,
            type: vacancy.test.type,
            description: vacancy.test.description,
          }
        : null,
    };

    // Если это employer и это его вакансия - возвращаем полную информацию с откликами
    if (user.role === UserRole.EMPLOYER && vacancy.employerId === user.id) {
      const responsesWithSeekerInfo = vacancy.responses.map((response) => ({
        id: response.id,
        status: response.status,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        seeker: {
          id: response.seeker.id,
          firstName: response.seeker.firstName,
          lastName: response.seeker.lastName,
          email: response.seeker.email,
          company: response.seeker.company,
        },
        testResults:
          response.testResults?.map((testResult) => ({
            id: testResult.id,
            completedAt: testResult.completedAt,
            test: {
              id: testResult.test.id,
              title: testResult.test.title,
              type: testResult.test.type,
            },
            userAnswers: testResult.userAnswers?.length || 0,
          })) || [],
      }));

      return {
        ...baseVacancyInfo,
        responses: responsesWithSeekerInfo,
        totalResponses: vacancy.responses.length,
        pendingResponses: vacancy.responses.filter(
          (r) => r.status === ResponseStatus.PENDING,
        ).length,
        acceptedResponses: vacancy.responses.filter(
          (r) => r.status === ResponseStatus.ACCEPTED,
        ).length,
        rejectedResponses: vacancy.responses.filter(
          (r) => r.status === ResponseStatus.REJECTED,
        ).length,
      };
    }

    // Если это seeker - возвращаем базовую информацию + статус отклика
    if (user.role === UserRole.SEEKER) {
      const myResponse = vacancy.responses.find(
        (response) => response.seeker.id === user.id,
      );

      // Проверяем, прошел ли пользователь специальный тест
      let hasPassedSpecialTest: boolean | undefined = undefined;
      if (vacancy.test && vacancy.test.type === TestType.SPECIAL) {
        hasPassedSpecialTest = await this.hasSeekerCompletedTest(
          user.id,
          vacancy.test.id,
        );
      }

      return {
        ...baseVacancyInfo,
        hasPassedSpecialTest,
        response: myResponse
          ? {
              id: myResponse.id,
              status: myResponse.status,
              createdAt: myResponse.createdAt,
            }
          : undefined,
        hasMyResponse: !!myResponse,
      };
    }

    // Для других ролей возвращаем только базовую информацию
    return baseVacancyInfo;
  }

  async getAllActiveVacancies(
    page: number = 1,
    limit: number = 10,
    userId?: number,
  ): Promise<{ data: VacancyResponseDto[]; count: number }> {
    const [vacancies, count] = await this.vacancyRepository.findAndCount({
      where: { is_active: true },
      relations: ['employer', 'responses', 'responses.seeker', 'test'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: await Promise.all(
        vacancies.map(async (vacancy) => {
          // Находим отклик текущего пользователя на эту вакансию
          const myResponse = vacancy.responses.find(
            (response) => response.seeker.id === userId,
          );

          // Проверяем, прошел ли пользователь специальный тест
          let hasPassedSpecialTest: boolean | undefined = undefined;
          if (
            vacancy.test &&
            vacancy.test.type === TestType.SPECIAL &&
            userId
          ) {
            hasPassedSpecialTest = await this.hasSeekerCompletedTest(
              userId,
              vacancy.test.id,
            );
          }

          return {
            id: vacancy.id,
            title: vacancy.title,
            description: vacancy.description,
            salary_min: vacancy.salary_min,
            salary_max: vacancy.salary_max,
            is_active: vacancy.is_active,
            createdAt: vacancy.createdAt,
            employer: {
              id: vacancy.employer.id,
              firstName: vacancy.employer.firstName,
              lastName: vacancy.employer.lastName,
              company: vacancy.employer.company,
            },
            hasPassedSpecialTest,
            response: myResponse
              ? {
                  id: myResponse.id,
                  status: myResponse.status,
                  createdAt: myResponse.createdAt,
                }
              : undefined,
            hasMyResponse: !!myResponse,
          };
        }),
      ),
      count,
    };
  }

  private async hasSeekerCompletedTest(
    seekerId: number,
    testId: number,
  ): Promise<boolean> {
    const testResult = await this.testResultRepository.findOne({
      where: {
        seeker: { id: seekerId },
        test: { id: testId },
      },
    });
    return !!testResult;
  }
}
