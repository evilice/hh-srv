import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionEntity } from '../entities';

@Entity('test_answers')
export class AnswerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => QuestionEntity, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: QuestionEntity;

  @Column({
    name: 'answer_text',
    type: 'text',
  })
  answerText: string;

  @Column({
    name: 'is_correct',
    nullable: true,
  })
  isCorrect: boolean;
}
