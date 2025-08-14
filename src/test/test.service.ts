import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from '../test/test.entity';
import { CreateTestDto } from './dto/test.dto';
import { User, UserRole } from '../user/user.entity';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(TestEntity)
    private testsRepository: Repository<TestEntity>,
  ) {}

  async createTest(createTestDto: CreateTestDto, user: User) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create tests');
    }

    const test = this.testsRepository.create({
      ...createTestDto,
      createdBy: user,
    });

    return this.testsRepository.save(test);
  }

  async deleteTest(user: User, testId: number) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete tests');
    }

    const test = await this.testsRepository.findOne({
      where: { id: testId },
      relations: ['vacancies'],
    });

    if (!test) {
      throw new NotFoundException(`Test with ID ${testId} not found`);
    }

    if (test.vacancies && test.vacancies.length > 0) {
      throw new BadRequestException('Cannot delete test assigned to vacancies');
    }

    await this.testsRepository.delete(testId);
    return { message: 'Test deleted successfully' };
  }

  async findAllTests(user: User, page: number = 1, limit: number = 10) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can view all tests');
    }

    const skip = (page - 1) * limit;

    return this.testsRepository.find({
      relations: [
        'createdBy',
        'questions',
        'questions.answers', // Добавляем загрузку вопросов и ответов
      ],
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          id: true,
          email: true,
        },
        questions: {
          id: true,
          questionText: true,
          questionType: true,
          score: true,
          answers: {
            id: true,
            answerText: true,
            isCorrect: true,
          },
        },
      },
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
        questions: {
          id: 'ASC', // Сортировка вопросов по ID
          answers: {
            id: 'ASC', // Сортировка ответов по ID
          },
        },
      },
    });
  }
}
