import { TestEntity, User } from '../entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class VacancyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  salary_min: string;

  @Column({ nullable: true })
  salary_max: string;

  @Column({ default: true })
  is_active: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.vacancies)
  @JoinColumn({ name: 'employer_id' }) // Указываем имя колонки в БД
  employer: User;

  @Column({ name: 'employer_id' })
  employerId: number;

  // NEW
  @ManyToOne(() => TestEntity, (test) => test.vacancies, { nullable: true })
  @JoinColumn({ name: 'test_id' }) // Прямая связь с тестом
  test: TestEntity | null;

  @Column({ name: 'test_id', nullable: true })
  testId: number | null;

  // @OneToMany(() => VacancyTest, (vacancyTest) => vacancyTest.vacancy)
  // tests: VacancyTest[];
}

// Deleted entity
// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { VacancyEntity } from './vacancy.entity';
// import { TestEntity } from '../test/test.entity';

// @Entity()
// export class VacancyTest {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => VacancyEntity, (vacancy) => vacancy.tests)
//   vacancy: VacancyEntity;

//   @ManyToOne(() => TestEntity, (test) => test.vacancies)
//   test: TestEntity;

//   @Column({ default: true })
//   isRequired: boolean;

//   @Column({ default: 0 })
//   order: number; // Порядок прохождения тестов
// }
