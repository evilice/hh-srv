import { User } from '../user/user.entity';
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
}
