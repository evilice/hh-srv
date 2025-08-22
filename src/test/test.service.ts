import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from '../test/test.entity';
import { TestType } from '../test/test.entity';
import { QuestionType } from '../question/question.entity';
import {
  CreateTestDto,
  SubmitTestAnswersDto,
  UpdateTestDto,
} from './dto/test.dto';
import { User, UserRole } from '../user/user.entity';
import { TestResultEntity, UserAnswerEntity, VacancyEntity } from '../entities';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(TestEntity)
    private testsRepository: Repository<TestEntity>,
    @InjectRepository(VacancyEntity)
    private vacancyRepository: Repository<VacancyEntity>,
    @InjectRepository(TestResultEntity)
    private testResultRepository: Repository<TestResultEntity>,
    @InjectRepository(UserAnswerEntity)
    private userAnswerRepository: Repository<UserAnswerEntity>,
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
    if (user.role === UserRole.SEEKER) {
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

  async getTestForVacancy(vacancyId: number): Promise<any> {
    const vacancy = await this.vacancyRepository.findOne({
      where: { id: vacancyId },
      relations: ['test', 'test.questions', 'test.questions.answers'],
    });

    if (!vacancy || !vacancy.test) {
      throw new NotFoundException('Тест для вакансии не найден');
    }

    return {
      testId: vacancy.test.id,
      title: vacancy.test.title,
      description: vacancy.test.description,
      questions: vacancy.test.questions.map((question) => ({
        id: question.id,
        questionText: question.questionText,
        questionType: question.questionType,
        score: question.score,
        imageUrl: question.imagePath
          ? `${process.env.API_URL}/files/questions/${question.imagePath}`
          : null,
        answers: question.answers.map((answer) => ({
          id: answer.id,
          answerText: answer.answerText,
          // isCorrect не отправляем для пользователя
        })),
      })),
    };
  }

  // Создание ответов на вопросы для seeker
  async submitTestAnswers(
    userId: number,
    testId: number,
    submitDto: SubmitTestAnswersDto,
  ) {
    console.log('userId', userId);
    console.log('testId', testId);
    console.log('submitDto', submitDto);

    const test = await this.testsRepository.findOne({
      where: { id: testId },
      relations: ['questions', 'questions.answers'],
    });

    if (!test) {
      throw new NotFoundException('Тест не найден');
    }

    const userAnswers: UserAnswerEntity[] = [];

    // Обрабатываем ответы для каждого вопроса
    for (const userAnswer of submitDto.answers) {
      const question = test.questions.find(
        (q) => q.id === userAnswer.questionId,
      );
      if (!question) continue;

      if (
        question.questionType === QuestionType.MULTIPLE_CHOICE &&
        userAnswer.answerIds
      ) {
        // Для multiple choice создаем отдельную запись для каждого выбранного ответа
        for (const answerId of userAnswer.answerIds) {
          const answerEntity = this.userAnswerRepository.create({
            question: { id: question.id },
            answer: { id: answerId },
            answerText: null, // Для multiple choice используем связь с answer
          });
          userAnswers.push(answerEntity);
        }
      } else if (userAnswer.answerId) {
        // Для single choice
        const answerEntity = this.userAnswerRepository.create({
          question: { id: question.id },
          answer: { id: userAnswer.answerId },
          answerText: null,
        });
        userAnswers.push(answerEntity);
      } else if (userAnswer.answerText) {
        // Для текстовых ответов
        const answerEntity = this.userAnswerRepository.create({
          question: { id: question.id },
          answer: null,
          answerText: userAnswer.answerText,
        });
        userAnswers.push(answerEntity);
      }
    }

    // Сохраняем результат
    const testResult = this.testResultRepository.create({
      test: { id: testId },
      seeker: { id: userId },
      userAnswers,
    });

    return this.testResultRepository.save(testResult);
  }

  async getIqTestForSeeker() {
    const iqTest = await this.testsRepository.findOne({
      where: { type: TestType.IQ, isPublic: true },
      relations: ['questions', 'questions.answers'],
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        isPublic: true,
        questions: {
          id: true,
          questionText: true,
          questionType: true,
          score: true,
          imagePath: true,
          answers: {
            id: true,
            answerText: true,
          },
        },
      },
      order: {
        id: 'ASC',
      },
    });

    if (!iqTest) {
      throw new NotFoundException('Публичный IQ тест не найден');
    }

    return {
      id: iqTest.id,
      title: iqTest.title,
      description: iqTest.description,
      questions: iqTest.questions.map((question) => ({
        id: question.id,
        questionText: question.questionText,
        questionType: question.questionType,
        score: question.score,
        imageUrl: question.imagePath
          ? `${process.env.API_URL || 'http://localhost:3000'}/files/questions/${question.imagePath}`
          : null,
        answers: question.answers.map((answer) => ({
          id: answer.id,
          answerText: answer.answerText,
        })),
      })),
    };
  }

  async getPsyTestForSeeker() {
    const psyTest = await this.testsRepository.findOne({
      where: { type: TestType.PSY, isPublic: true },
      relations: ['questions', 'questions.answers'],
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        isPublic: true,
        questions: {
          id: true,
          questionText: true,
          questionType: true,
          score: true,
          imagePath: true,
          answers: {
            id: true,
            answerText: true,
          },
        },
      },
      order: {
        id: 'ASC',
      },
    });

    if (!psyTest) {
      throw new NotFoundException('Публичный PSY тест не найден');
    }

    return {
      id: psyTest.id,
      title: psyTest.title,
      description: psyTest.description,
      questions: psyTest.questions.map((question) => ({
        id: question.id,
        questionText: question.questionText,
        questionType: question.questionType,
        score: question.score,
        imageUrl: question.imagePath
          ? `${process.env.API_URL || 'http://localhost:3000'}/files/questions/${question.imagePath}`
          : null,
        answers: question.answers.map((answer) => ({
          id: answer.id,
          answerText: answer.answerText,
        })),
      })),
    };
  }
}
