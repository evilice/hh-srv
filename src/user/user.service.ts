import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RegistrationResponseDto, RegisterDto } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegistrationResponseDto> {
    const {
      email,
      password,
      firstName,
      middleName,
      lastName,
      company,
      gender,
      role,
    } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // --->  register seeker

    // role
    // email
    // passw
    // firstName
    // middleName
    // lastName
    // gender

    // ---> register employer

    // role
    // email
    // passw
    // firstName
    // company

    // Create new user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      middleName,
      lastName,
      company,
      gender: gender || null,
      role,
    });

    await this.userRepository.save(user);

    return {
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      gender: user.gender,
      company: user.company,
      role: user.role,
    };
  }
}
