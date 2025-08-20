import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { TestModule } from './test/test.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { FilesModule } from './files/files.module';
import { ResponseModule } from './response/response.module';

const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, NODE_ENV } = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST || 'localhost',
      port: DB_PORT ? parseInt(DB_PORT) : 5432,
      database: DB_DATABASE || 'hr',
      username: DB_USERNAME || 'postgres',
      password: DB_PASSWORD || 'qwepoi123',
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // migrations: ['"src/migrations/*.ts"'],
      // migrationsRun: true, // Раскомментировать для продакшена,
    }),
    UserModule,
    AuthModule,
    VacancyModule,
    TestModule,
    QuestionModule,
    AnswerModule,
    FilesModule,
    ResponseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
