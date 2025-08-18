import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from '../test/test.entity';
import { CreateTestDto, UpdateTestDto } from './dto/test.dto';
import { User, UserRole } from '../user/user.entity';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(TestEntity)
    private testsRepository: Repository<TestEntity>,
  ) {}

  async updateTest(user: User, id: number, updateTestDto: UpdateTestDto) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update tests');
    }

    const test = await this.testsRepository.findOneBy({ id });
    if (!test) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }

    Object.assign(test, updateTestDto);
    return this.testsRepository.save(test);
  }

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
    });
  }

  async findTestWithDetails(user: User, id: number) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can view test details');
    }

    const test = await this.testsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'questions', 'questions.answers'],
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
          imagePath: true,
          answers: {
            id: true,
            answerText: true,
            isCorrect: true,
          },
        },
      },
    });

    if (!test) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }

    // Добавляем полные URL к изображениям
    const testWithImageUrls = {
      ...test,
      questions: test.questions.map((question) => ({
        ...question,
        imageUrl: question.imagePath
          ? `${process.env.API_URL || 'http://localhost:3000'}/files/questions/${question.imagePath}`
          : null,
      })),
    };

    return testWithImageUrls;
  }
}
