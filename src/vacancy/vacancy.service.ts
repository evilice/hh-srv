import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VacancyEntity } from './vacancy.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class VacancyService {
  constructor(
    @InjectRepository(VacancyEntity)
    private vacancyRepository: Repository<VacancyEntity>,
  ) {}

  async createVacancy(
    data: Partial<VacancyEntity>,
    user: User,
  ): Promise<VacancyEntity> {
    const vacancy = this.vacancyRepository.create({
      ...data,
      employer: user,
      employerId: user.id,
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
}
