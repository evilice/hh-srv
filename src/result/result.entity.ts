import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  ResponseEntity,
  TestEntity,
  User,
  UserAnswerEntity,
} from '../entities';
// import { UserAnswerEntity } from './user-answer.entity';
// import { ResponseEntity } from './response.entity';

@Entity('test_results')
export class TestResultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ResponseEntity, (response) => response.testResults, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'response_id' })
  response: ResponseEntity;

  @ManyToOne(() => TestEntity, (test) => test.testResults, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'test_id' })
  test: TestEntity;

  @ManyToOne(() => User, (user) => user.testResults, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'seeker_id' })
  seeker: User;

  // @Column({ name: 'total_score', type: 'int', default: 0 })
  // totalScore: number;

  // @Column({ name: 'max_score', type: 'int', default: 0 })
  // maxScore: number;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;

  @OneToMany(() => UserAnswerEntity, (userAnswer) => userAnswer.result, {
    cascade: true,
  })
  userAnswers: UserAnswerEntity[];

  // @OneToMany(() => UserAnswerEntity, (userAnswer) => userAnswer.result, {
  //   cascade: true,
  // })
  // userAnswers: UserAnswerEntity[];
}
