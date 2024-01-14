import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModelView, UserModelResult } from '../dto/user.model';
import { UserQueryDto } from '../dto/user.dto';
import { PaginationView } from '../../../setting/pagination.model';

@Injectable()
export class UserRepoSql {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getUsers(
    userQueryDto: UserQueryDto,
  ): Promise<PaginationView<UserModelResult[]>> {
    const searchEmailTerm = userQueryDto.searchEmailTerm;
    const searchLoginTerm = userQueryDto.searchLoginTerm;

    const pageSkip = +userQueryDto.pageSize * (+userQueryDto.pageNumber - 1);
    const orderBy = `"${userQueryDto.sortBy}" ${userQueryDto.sortDirection}`;

    const users = await this.dataSource.query(
      `
        select u."id", u."login", u."email", u."createdAt"
        from public."users" u
        where u."login" ILIKE $1 OR u."email" ILIKE $2
        ORDER BY ${orderBy}
        LIMIT $3 OFFSET $4
        `,

      [
        `%${searchLoginTerm}%`,
        `%${searchEmailTerm}%`,
        userQueryDto.pageSize,
        pageSkip,
      ],
    );
    const userCount = await this.dataSource.query(
      `
        select count(*)
      from public."users" u
      where u."email" ILIKE $1 OR u."login" ILIKE $2
    `,
      [`%${searchEmailTerm}%`, `%${searchLoginTerm}%`],
    );
    const count = +userCount[0].count;

    return {
      pagesCount: Math.ceil(count / userQueryDto.pageSize),
      page: userQueryDto.pageNumber,
      pageSize: userQueryDto.pageSize,
      totalCount: count,
      items: users,
    };
  }

  async createUser(newUser: UserModelView) {
    const createUser = await this.dataSource.query(
      `
        INSERT INTO public."users" ("login", "email", "password", "codeConfirmation", "isConfirmed")
        VALUES ($1, $2, $3, $4, $5)
        Returning "id", "login", "email", "createdAt"
      `,
      [
        newUser.login,
        newUser.email,
        newUser.password,
        newUser.codeConfirmation,
        newUser.isConfirmed,
      ],
    );
    return {
      id: createUser[0].id,
      login: createUser[0].login,
      email: createUser[0].email,
      createdAt: createUser[0].createdAt,
    } as UserModelView;
  }

  async findUserByLogin(login: string): Promise<UserModelView> {
    const user = await this.dataSource.query(
      `
    select u.id, u.login
    from public."users" u
    where login = $1
    `,
      [login],
    );
    return user[0];
  }

  async findUserByEmail(email: string): Promise<UserModelView> {
    const user = await this.dataSource.query(
      `
      select u.id, u."email", u."isConfirmed"
      from public."users" u
      where "email" = $1
   `,
      [email],
    );
    return user[0];
  }

  async validateEmail(email: string): Promise<UserModelView> {
    const user = await this.dataSource.query(
      `
   select u."id", u."email", u."isConfirmed"
   from public."users" u
    `,
      [email],
    );

    return user[0] && user[0].isConfirmed !== true ? user[0] : null;
  }

  async findUserId(userId: string) {
    const user = await this.dataSource.query(
      `
    select u.id, u.email, u.login, u."createdAt"
    from public.users u
    where u.id = $1
    `,
      [userId],
    );
    return user[0];
  }

  async deleteUserId(userId: string) {
    const deleteUser = await this.dataSource.query(
      `
     delete
     from "users" u
     where u."id" = $1
    `,
      [userId],
    );
    return { deleteCount: deleteUser[1] };
  }
  async findUserByLoginOrEmail(loginOrEmail: string) {
    const user = await this.dataSource.query(
      `
    select u."id", u."login", u."email", u.password
    from "users" u
    where u."login" = $1 or email = $1
    `,
      [loginOrEmail],
    );
    return {
      id: user[0].id,
      login: user[0].login,
      email: user[0].email,
      password: user[0].password,
    } as UserModelView;
  }

  async registrationEmailResending(
    code: string,
    email: string,
  ): Promise<UserModelView> {
    const user = await this.dataSource.query(
      `
    update public."users"
    set "codeConfirmation" = $1
    where "email" = $2
    returning "codeConfirmation", "email" 
    `,
      [code, email],
    );
    return user[0][0];
  }
}
