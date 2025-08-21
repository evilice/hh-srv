import { Controller } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';

@Controller('user-answer')
export class UserAnswerController {
  constructor(private readonly userAnswerService: UserAnswerService) {}
}
