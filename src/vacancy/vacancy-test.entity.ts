import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VacancyEntity } from './vacancy.entity';
import { TestEntity } from '../test/test.entity';

@Entity()
export class VacancyTest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => VacancyEntity, (vacancy) => vacancy.tests)
  vacancy: VacancyEntity;

  @ManyToOne(() => TestEntity, (test) => test.vacancies)
  test: TestEntity;

  @Column({ default: true })
  isRequired: boolean;

  @Column({ default: 0 })
  order: number; // Порядок прохождения тестов
}
