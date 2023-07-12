import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { IPaginationMeta, IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';
import paginationConfig from 'src/config/pagination.config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save({ name: createUserDto.name });
  }

  async findAll(paginationOptions: IPaginationOptions): Promise<Pagination<User>> {
    const options = this.validatePaginationOptions(paginationOptions);

    return paginate<User>(this.userRepository, options, {
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id: id }, { name: updateUserDto.name });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  private validatePaginationOptions({ page, limit }: IPaginationOptions) {
    let maxLimit = paginationConfig.maxLimit;

    if (limit && +limit <= 100) {
      maxLimit = limit;
    }

    return {
      page,
      limit: maxLimit,
      route: this.config.get('DOMAIN'),
    } satisfies IPaginationOptions<IPaginationMeta>;
  }
}
