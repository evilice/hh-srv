import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User, VacancyEntity } from '../entities';

export enum ResponseStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('responses')
export class ResponseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => VacancyEntity, (vacancy) => vacancy.responses)
  @JoinColumn({ name: 'vacancy_id' })
  vacancy: VacancyEntity;

  @Column({ name: 'vacancy_id' })
  vacancyId: number;

  @ManyToOne(() => User, (user) => user.responses)
  @JoinColumn({ name: 'seeker_id' })
  seeker: User;

  @Column({ name: 'seeker_id' })
  seekerId: number;

  @Column({
    type: 'enum',
    enum: ResponseStatus,
    default: ResponseStatus.PENDING,
  })
  status: ResponseStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
