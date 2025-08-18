import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path'; // для работы с путями файловой системы
import { existsSync } from 'fs'; // проверка существования файла

@Controller('files') // базовый путь `/files`
export class FilesController {
  @Get('questions/:filename') // GET /files/questions/{filename}
  serveQuestionImage(
    @Param('filename') filename: string, // получаем имя файла из URL
    @Res() res: Response, // объект ответа Express
  ) {
    // Путь к файлу в папке uploads/questions
    const filePath = join(process.cwd(), 'uploads', 'questions', filename);

    // Проверяем, существует ли файл
    if (!existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Отправляем файл клиенту
    return res.sendFile(filePath);
  }
}
