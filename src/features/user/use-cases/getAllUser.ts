import { UserQueryDto } from '../dto/user.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserService } from '../api/user.service';
import {
  PaginationModelsView,
  PaginationView,
} from '../../../setting/pagination.model';
import { UserModelResult } from '../dto/user.model';
import { UserEntity } from '../entity/user.entity';

export class GetAllUser {
  constructor(public readonly userQueryDto: UserQueryDto) {}
}

@QueryHandler(GetAllUser)
export class GetAllUserHandler implements IQueryHandler<GetAllUser> {
  constructor(private readonly userRepo: UserService) {}
  async execute(query: GetAllUser) {
    const paginationUser: PaginationModelsView = {
      pageNumber: query.userQueryDto.pageNumber || 1,
      pageSize: query.userQueryDto.pageSize || 10,
      searchLoginTerm: query.userQueryDto.searchLoginTerm || '',
      searchEmailTerm: query.userQueryDto.searchEmailTerm || '',
      sortBy: query.userQueryDto.sortBy || 'createdAt',
      sortDirection:
        query.userQueryDto.sortDirection === 'asc' ? 'asc' : 'desc',
    };

    return await this.userRepo.getUsers(paginationUser);
  }
}
