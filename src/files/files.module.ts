import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';

@Module({
  controllers: [FilesController], // регистрируем контроллер
})
export class FilesModule {}
