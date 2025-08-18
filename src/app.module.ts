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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'hr',
      username: 'postgres',
      password: 'qwepoi123',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
