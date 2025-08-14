import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import {
  QuestionEntity,
  AnswerEntity,
  TestEntity,
  QuestionType,
} from '../entities';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
} from '../question/dto/question.dto';
import { CreateAnswerDto, UpdateAnswerDto } from '../answer/dto/answer.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionEntity)
    private questionsRepository: Repository<QuestionEntity>,
    @InjectRepository(AnswerEntity)
    private answersRepository: Repository<AnswerEntity>,
    @InjectRepository(TestEntity)
    private testsRepository: Repository<TestEntity>,
  ) {}

  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const test = await this.testsRepository.findOneBy({
      id: createQuestionDto.testId,
    });
    if (!test) {
      throw new BadRequestException('Test not found');
    }

    const question = this.questionsRepository.create({
      questionText: createQuestionDto.text,
      questionType: createQuestionDto.type,
      score: createQuestionDto.score || 1,
      test,
    });

    return this.questionsRepository.save(question);
  }

  async deleteQuestion(id: number) {
    await this.questionsRepository.delete(id);
  }

  async addAnswer(questionId: number, createAnswerDto: CreateAnswerDto) {
    const question = await this.questionsRepository.findOne({
      where: { id: questionId },
      relations: ['answers'],
    });

    if (!question) {
      throw new BadRequestException('Question not found');
    }

    // Для SINGLE_CHOICE проверяем, что нет других правильных ответов
    if (
      question.questionType === QuestionType.SINGLE_CHOICE &&
      createAnswerDto.isCorrect
    ) {
      const hasCorrectAnswer = question.answers.some((a) => a.isCorrect);
      if (hasCorrectAnswer) {
        throw new BadRequestException(
          'Single choice question can have only one correct answer',
        );
      }
    }

    const answer = this.answersRepository.create({
      answerText: createAnswerDto.text,
      isCorrect: createAnswerDto.isCorrect,
      question,
    });

    return this.answersRepository.save(answer);
  }

  async deleteAnswer(id: number) {
    await this.answersRepository.delete(id);
  }

  async updateQuestion(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionsRepository.findOneBy({ id });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Для SINGLE_CHOICE проверяем, что не меняем на MULTIPLE_CHOICE с несколькими правильными ответами
    if (updateQuestionDto.questionType === QuestionType.SINGLE_CHOICE) {
      const correctAnswers = await this.answersRepository.count({
        where: { question: { id }, isCorrect: true },
      });
      if (correctAnswers > 1) {
        throw new BadRequestException(
          'Cannot change to SINGLE_CHOICE with multiple correct answers',
        );
      }
    }
    Object.assign(question, updateQuestionDto);
    return this.questionsRepository.save(question);
  }

  async updateAnswer(id: number, updateAnswerDto: UpdateAnswerDto) {
    const answer = await this.answersRepository.findOne({
      where: { id },
      relations: ['question'],
    });
    if (!answer) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }

    // Для SINGLE_CHOICE проверяем, что не добавляем второй правильный ответ
    if (
      updateAnswerDto.isCorrect &&
      answer.question.questionType === QuestionType.SINGLE_CHOICE
    ) {
      const hasOtherCorrect = await this.answersRepository.findOne({
        where: {
          question: { id: answer.question.id },
          isCorrect: true,
          id: Not(id),
        },
      });
      if (hasOtherCorrect) {
        throw new BadRequestException(
          'Single choice question can have only one correct answer',
        );
      }
    }
    console.log('answer', answer);
    Object.assign(answer, updateAnswerDto);
    return this.answersRepository.save(answer);
  }
}
