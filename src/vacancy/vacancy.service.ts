import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VacancyEntity } from './vacancy.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateVacancyDto, VacancyResponseDto } from './dto/vacancy.dto';
import {
  TestEntity,
  ResponseEntity,
  TestResultEntity,
  TestType,
} from '../entities';

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
