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
    default: false,
  })
  isCorrect: boolean;
}

// http
// POST /questions
// Content-Type: application/json
// Authorization: Bearer <admin_token>

// {
//   "text": "What is 2+2?",
//   "type": "single_choice",
//   "score": 5,
//   "testId": 1
// }
// Добавление ответа (SINGLE_CHOICE):

// http
// POST /questions/1/answers
// Content-Type: application/json
// Authorization: Bearer <admin_token>

// {
//   "text": "4",
//   "isCorrect": true,
//   "questionId": 1
// }
// Добавление ответа (MULTIPLE_CHOICE):

// http
// POST /questions/2/answers
// Content-Type: application/json
// Authorization: Bearer <admin_token>

// {
//   "text": "Node.js",
//   "isCorrect": true,
//   "questionId": 2
// }
// Добавление ответа (TEXT):

// http
// POST /questions/3/answers
// Content-Type: application/json
// Authorization: Bearer <admin_token>

// {
//   "text": "Describe your experience",
//   "questionId": 3
// }
// Удаление вопроса:

// http
// DELETE /questions/1
// Authorization: Bearer <admin_token>
// Удаление ответа:

// http
// DELETE /questions/answers/1
// Authorization: Bearer <admin_token>
