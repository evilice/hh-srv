import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  QuestionEntity,
  AnswerEntity,
  TestEntity,
  QuestionType,
} from '../entities';
import { CreateQuestionDto } from '../question/dto/question.dto';
import { CreateAnswerDto } from '../answer/dto/answer.dto';

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
      isCorrect: createAnswerDto.isCorrect || false,
      question,
    });

    return this.answersRepository.save(answer);
  }

  async deleteAnswer(id: number) {
    await this.answersRepository.delete(id);
  }
}
