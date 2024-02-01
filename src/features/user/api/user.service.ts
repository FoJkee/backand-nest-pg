import { Injectable } from '@nestjs/common';
import { UserModelView } from '../dto/user.model';
import { UserQueryDto } from '../dto/user.dto';
import { UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { PaginationView } from '../../../setting/pagination.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(newUser: UserModelView): Promise<UserEntity> {
    return this.userRepository.save(newUser);
  }
  async deleteUserId(userId: string) {
    return this.userRepository.delete({ id: userId });
  }

  async getUsers(
    userQueryDto: UserQueryDto,
  ): Promise<PaginationView<UserEntity[]>> {
    const searchEmailTerm = userQueryDto.searchEmailTerm.toString();
    const searchLoginTerm = userQueryDto.searchLoginTerm.toString();
    const pageSkip = +userQueryDto.pageSize * (+userQueryDto.pageNumber - 1);

    const where: FindManyOptions['where'] = [
      {
        login: ILike(`%${searchLoginTerm}%`),
      },
      {
        email: ILike(`%${searchEmailTerm}%`),
      },
    ];

    const [user, totalCount] = await Promise.all([
      this.userRepository.find({
        where,
        order: {
          [userQueryDto.sortBy]:
            userQueryDto.sortDirection === 'asc' ? 'asc' : 'desc',
        },
        take: +userQueryDto.pageSize,
        skip: +pageSkip,
      }),
      this.userRepository.count({
        where,
      }),
    ]);

    return {
      pagesCount: Math.ceil(totalCount / userQueryDto.pageSize),
      page: userQueryDto.pageNumber,
      pageSize: userQueryDto.pageSize,
      totalCount: totalCount,
      items: user.map(
        (el) =>
          ({
            id: el.id,
            login: el.login,
            email: el.email,
            createdAt: el.createdAt,
          }) as UserEntity,
      ),
    };
  }

  async registrationEmailResending(
    code: string,
    email: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    user.codeConfirmation = code;
    return this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ email });
  }

  async findUserAndUpdateCode(userId: string): Promise<boolean> {
    try {
      await this.userRepository.update(
        {
          id: userId,
        },
        { isConfirmed: true },
      );
      return true;
    } catch (e) {
      return false;
    }
  }
  async findUserByCode(code: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ codeConfirmation: code });
  }

  async findUserId(userId: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id: userId });
  }
  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserEntity> {
    return this.userRepository.findOneBy(
      { email: loginOrEmail } && { login: loginOrEmail },
    );
  }
  async findUserByLogin(login: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ login });
  }
}
