import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { AnswerEntity, TestEntity, UserAnswerEntity } from '../entities';

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TEXT = 'text',
  IMAGE = 'image',
}

@Entity('test_questions')
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TestEntity, (test) => test.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'test_id' })
  test: TestEntity;

  @Column({
    name: 'question_text',
    type: 'text',
  })
  questionText: string;

  @Column({
    name: 'question_type',
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.SINGLE_CHOICE,
  })
  questionType: QuestionType;

  @Column('int')
  score: number;

  @Column({
    name: 'image_path',
    nullable: true,
  })
  imagePath: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => AnswerEntity, (answer) => answer.question)
  answers: AnswerEntity[];

  @OneToMany(() => UserAnswerEntity, (userAnswer) => userAnswer.question)
  userAnswers: UserAnswerEntity[];
}
