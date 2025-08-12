import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from '../test/test.entity';
import { CreateTestDto } from './dto/test.dto';
import { User, UserRole } from '../user/user.entity';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(TestEntity)
    private testsRepository: Repository<TestEntity>,
  ) {}

  async createTest(createTestDto: CreateTestDto, user: User) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create tests');
    }

    const test = this.testsRepository.create({
      ...createTestDto,
      createdBy: user,
    });

    return this.testsRepository.save(test);
  }

  async findAllTests(user: User, page: number = 1, limit: number = 10) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can view all tests');
    }

    const skip = (page - 1) * limit;

    return this.testsRepository.find({
      relations: ['createdBy'],
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          id: true,
          email: true,
        },
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }
}
