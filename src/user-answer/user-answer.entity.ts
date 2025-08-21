import { AnswerEntity, QuestionEntity, TestResultEntity } from '../entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('user_answers')
export class UserAnswerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TestResultEntity, (testResult) => testResult.userAnswers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'result_id' })
  result: TestResultEntity;

  @ManyToOne(() => QuestionEntity, (question) => question.userAnswers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: QuestionEntity;

  @ManyToOne(() => AnswerEntity, (answer) => answer.userAnswers, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'answer_id' })
  answer: AnswerEntity | null;

  @Column({
    name: 'answer_text',
    type: 'text',
    nullable: true,
  })
  answerText: string | null;

  @Column({
    name: 'is_correct',
    default: false,
  })
  isCorrect: boolean;

  @Column('int', {
    default: 0,
  })
  score: number;
}
