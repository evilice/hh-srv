import { User, VacancyTest, QuestionEntity } from '../entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TestType {
  IQ = 'iq',
  PSY = 'psy', // психотип
  SPECIAL = 'special', // компетенции
}

@Entity()
export class TestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TestType,
    default: TestType.IQ,
  })
  type: TestType;

  @Column({ default: true })
  isPublic: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.tests)
  createdBy: User;

  @OneToMany(() => VacancyTest, (vacancyTest) => vacancyTest.test)
  vacancies: VacancyTest[];

  @OneToMany(() => QuestionEntity, (question) => question.test)
  questions: QuestionEntity[];
}
