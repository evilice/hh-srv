import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestResultEntity, TestType } from '../entities';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(TestResultEntity)
    private testResultRepository: Repository<TestResultEntity>,
  ) {}

  async checkTestCompletion(
    userId: number,
    testType: 'iq' | 'psy',
  ): Promise<boolean> {
    const result = await this.testResultRepository.findOne({
      where: {
        seeker: { id: userId },
        test: { type: testType } as Test,
      },
      relations: ['test'],
    });

    return !!result;
  }

  async checkSpecialTestForVacancy(
    seekerId: number,
    vacancyId: number,
  ): Promise<boolean> {
    const result = await this.testResultRepository
      .createQueryBuilder('tr')
      .innerJoin('tr.test', 'test') // Связываем с тестом
      .innerJoin('tr.response', 'response') // Связываем с откликом (предполагается, что связь добавлена)
      .where('test.type = :type', { type: TestType.SPECIAL }) // Тип теста - SPECIAL
      .andWhere('response.vacancyId = :vacancyId', { vacancyId }) // Тест привязан к нужной вакансии
      .andWhere('tr.seeker_id = :seekerId', { seekerId }) // Искомый соискатель
      .getOne();

    return !!result; // Возвращает true, если найден результат, иначе false
  }

  // Дополнительно: получить все результаты пользователя
  //   async getUserResults(userId: number) {
  //     return this.testResultRepository.find({
  //       where: { seeker: { id: userId } },
  //       relations: ['test'], // Загружаем информацию о тесте
  //       order: { completedAt: 'DESC' },
  //     });
  //   }
}
