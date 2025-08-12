import { Module } from '@nestjs/common';
import { TestsService } from '../test/test.service';
import { TestEntity } from '../test/test.entity';
import { TestsController } from '../test/test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestEntity, User])],
  providers: [TestsService],
  controllers: [TestsController],
})
export class TestModule {}
