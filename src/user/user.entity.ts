import {
  TestEntity,
  VacancyEntity,
  ResponseEntity,
  TestResultEntity,
} from '../entities';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  SEEKER = 'seeker',
  EMPLOYER = 'employer',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  company: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: UserGender,
    default: UserGender.MALE,
  })
  gender: UserGender;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SEEKER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastVisit: Date;

  @OneToMany(() => VacancyEntity, (vacancy) => vacancy.employer)
  vacancies: VacancyEntity[];

  @OneToMany(() => TestEntity, (test) => test.createdBy)
  tests: TestEntity[];

  @OneToMany(() => ResponseEntity, (response) => response.seeker)
  responses: ResponseEntity[];

  @OneToMany(() => TestResultEntity, (testResult) => testResult.seeker)
  testResults: TestResultEntity[];
}
