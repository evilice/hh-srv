import { Module } from '@nestjs/common';
import { QuestionsController } from './question.controller';
import { QuestionsService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity, AnswerEntity, TestEntity } from '../entities';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestEntity, QuestionEntity, AnswerEntity]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/questions',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionModule {}
