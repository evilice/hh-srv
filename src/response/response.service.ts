import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ResponseEntity,
  ResponseStatus,
  VacancyEntity,
  User,
  UserRole,
} from '../entities';
import { CreateResponseDto, UpdateResponseDto } from './dto/response.dto';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(ResponseEntity)
    private responseRepository: Repository<ResponseEntity>,
    @InjectRepository(VacancyEntity)
    private vacancyRepository: Repository<VacancyEntity>,
  ) {}

  // Создание отклика (для seeker)
  async createResponse(createResponseDto: CreateResponseDto, seeker: User) {
    if (seeker.role !== UserRole.SEEKER) {
      throw new ForbiddenException('Only seekers can create responses');
    }

    // Проверяем существование вакансии
    const vacancy = await this.vacancyRepository.findOne({
      where: { id: createResponseDto.vacancyId, is_active: true },
    });

    if (!vacancy) {
      throw new NotFoundException('Vacancy not found or not active');
    }

    // Проверяем, не откликался ли уже пользователь
    const existingResponse = await this.responseRepository.findOne({
      where: {
        vacancyId: createResponseDto.vacancyId,
        seekerId: seeker.id,
      },
    });

    if (existingResponse) {
      throw new ConflictException('You have already responded to this vacancy');
    }

    // Создаем отклик
    const response = this.responseRepository.create({
      vacancyId: createResponseDto.vacancyId,
      seekerId: seeker.id,
      status: ResponseStatus.PENDING,
    });

    return this.responseRepository.save(response);
  }

  // Удаление отклика (для seeker)
  async deleteResponse(responseId: number, seekerId: number) {
    const response = await this.responseRepository.findOne({
      where: { id: responseId, seekerId },
    });

    if (!response) {
      throw new NotFoundException('Response not found');
    }

    await this.responseRepository.delete(responseId);
  }

  // Изменение статуса отклика (для employer)
  async updateResponseStatus(
    responseId: number,
    updateResponseDto: UpdateResponseDto,
    employerId: number,
  ) {
    const response = await this.responseRepository.findOne({
      where: { id: responseId },
      relations: ['vacancy'],
    });

    if (!response) {
      throw new NotFoundException('Response not found');
    }

    // Проверяем, что employer является владельцем вакансии
    if (response.vacancy.employerId !== employerId) {
      throw new ForbiddenException(
        'You can only update responses for your vacancies',
      );
    }

    response.status = updateResponseDto.status;
    return this.responseRepository.save(response);
  }

  // Получение откликов для employer
  async getEmployerResponses(employerId: number) {
    return this.responseRepository.find({
      where: { vacancy: { employerId } },
      relations: ['seeker', 'vacancy'],
      order: { createdAt: 'DESC' },
    });
  }

  // Получение откликов для seeker
  async getSeekerResponses(seekerId: number) {
    return this.responseRepository.find({
      where: { seekerId },
      relations: ['vacancy', 'vacancy.employer'],
      order: { createdAt: 'DESC' },
    });
  }
}
