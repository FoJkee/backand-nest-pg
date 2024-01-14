import { INestApplication } from '@nestjs/common';
import { TestingUser } from './helper/helper';
import { UserModelView } from '../src/features/user/dto/user.model';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { createConfig } from '../src/config/create.config';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { UserRepoSql } from '../src/features/user/api/user.repo.sql';

describe('auth', () => {
  let app: INestApplication;
  let server;
  let accessToken;
  let accessToken1;
  let user1: UserModelView | null;
  let user2: UserModelView | null;
  let testingUser: TestingUser;
  let userRepositorySql: UserRepoSql;
  let cookie: any;
  let cookie1: any;
  let session: any;
  // let securityDevicesService: SecurityDevicesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app = createConfig(app);
    await app.init();
    server = app.getHttpServer();
    testingUser = new TestingUser(server);
    // securityDevicesService = app.get<SecurityDevicesService>(
    //   SecurityDevicesService,
    // );
    userRepositorySql = app.get<UserRepoSql>(UserRepoSql);
  });

  afterAll(async () => {
    await app.close();
    await server.close();
  });

  describe('DELETE ALL', () => {
    it('delete all user', async () => {
      const response = await request(server).delete('/testing/all-data');
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  describe('POST User', () => {
    it('create user', async () => {
      user1 = await testingUser.createUserForPagination();
      const response = await request(server)
        .get('/sa/users')
        .auth('admin', 'qwerty', { type: 'basic' });

      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);
    });
  });

  describe('POST Registration', () => {
    it('empty data registration user, 400', async () => {
      const errRegistr = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'login',
          },
          {
            message: expect.any(String),
            field: 'password',
          },
          {
            message: expect.any(String),
            field: 'email',
          },
        ],
      };
      const response = await request(server)
        .post('/auth/registration')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual(errRegistr);
    });
    it('create registration user, 204', async () => {
      const response = await request(server).post('/auth/registration').send({
        login: 'andrey',
        password: '12345678',
        email: 'romanovsky0815@gmail.com',
      });

      user2 = await userRepositorySql.findUserByLoginOrEmail(
        'romanovsky0815@gmail.com',
      );
      expect(response.status).toBe(204);
    });
    it('data exist, 400', async () => {
      await request(server)
        .post('/auth/registration')
        .send({
          login: 'andrey',
          password: '12345678',
          email: 'romanovsky0815@gmail.com',
        })
        .expect(400, {
          errorsMessages: [
            {
              message: 'Login exist',
              field: 'login',
            },
            {
              message: 'Email exist',
              field: 'email',
            },
          ],
        });
    });
  });

  describe('POST email-resending', () => {
    it('not email, 400', async () => {
      const err = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'email',
          },
        ],
      };

      const response = await request(server)
        .post('/auth/registration-email-resending')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual(err);
    });

    it('not user with this email, 400', async () => {
      const err = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'email',
          },
        ],
      };

      const response = await request(server)
        .post('/auth/registration-email-resending')
        .send({ email: 'hello@gmail.com' });
      expect(response.status).toBe(400);
      expect(response.body).toEqual(err);
    });

    it('user correct email, 204', async () => {
      const response = await request(server)
        .post('/auth/registration-email-resending')
        .send({ email: user2!.email });

      user2 = await userRepositorySql.findUserByLoginOrEmail(
        'romanovsky0815@gmail.com',
      );
      expect(response.status).toBe(204);
    });
  });

  describe('POST registration-confirmation', () => {
    it('not code, 400', async () => {
      const err = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'code',
          },
        ],
      };

      const response = await request(server)
        .post('/auth/registration-confirmation')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual(err);
    });
    it('incorrect code, 400', async () => {
      const err = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'code',
          },
        ],
      };
      const response = await request(server)
        .post('/auth/registration-confirmation')
        .send({ code: 'msgndgn-jkngkg-ljjksfg' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(err);
    });

    it('correct code, 204', async () => {
      const response = await request(server)
        .post('/auth/registration-confirmation')
        .send({ code: user2!.codeConfirmation });

      expect(response.status).toBe(204);
    });
  });

  // describe('POST password recovery', () => {
  //   it('incorrect email, 400', async () => {
  //     const err = {
  //       errorsMessages: [
  //         {
  //           message: expect.any(String),
  //           field: 'email',
  //         },
  //       ],
  //     };
  //     const response = await request(server)
  //       .post('/auth/password-recovery')
  //       .send({ email: 'sdlngs@gmail.cm' });
  //
  //     expect(response.status).toBe(400);
  //     expect(response.body).toEqual(err);
  //   });
  //   it('correct email, 204', async () => {
  //     await request(server)
  //       .post('/auth/password-recovery')
  //       .send({ email: user2!.email })
  //       .expect(204);
  //
  //     user2 = await userRepositorySql.findUserByLoginOrEmail(
  //       'romanovsky0815@gmail.com',
  //     );
  //   });
  // });

  // describe('POST new password ', () => {
  //   it('incorrect data, 400', async () => {
  //     const err = {
  //       errorsMessages: [
  //         {
  //           message: expect.any(String),
  //           field: 'newPassword',
  //         },
  //       ],
  //     };
  //
  //     const response = await request(server)
  //       .post('/auth/new-password')
  //       .send({ recoveryCode: user2!.codeConfirmation });
  //
  //     expect(response.status).toBe(400);
  //     expect(response.body).toEqual(err);
  //   });
  //   it('incorrect data, 400', async () => {
  //     const err = {
  //       errorsMessages: [
  //         {
  //           message: expect.any(String),
  //           field: 'recoveryCode',
  //         },
  //       ],
  //     };
  //     const response = await request(server)
  //       .post('/auth/new-password')
  //       .send({ newPassword: '987654321' });
  //
  //     expect(response.status).toBe(400);
  //     expect(response.body).toEqual(err);
  //   });
  //   it('incorrect data, 400', async () => {
  //     const err = {
  //       errorsMessages: [
  //         {
  //           message: expect.any(String),
  //           field: 'newPassword',
  //         },
  //         {
  //           message: expect.any(String),
  //           field: 'recoveryCode',
  //         },
  //       ],
  //     };
  //
  //     const response = await request(server)
  //       .post('/auth/new-password')
  //       .send({});
  //
  //     expect(response.status).toBe(400);
  //     expect(response.body).toEqual(err);
  //   });
  //   it('correct code, 204', async () => {
  //     await request(server)
  //       .post('/auth/new-password')
  //       .send({
  //         recoveryCode: user2!.codeConfirmation,
  //         newPassword: '987654321',
  //       })
  //       .expect(204);
  //   });
  // });

  describe('POST Login', () => {
    it('data incorrect, 400', async () => {
      const errorLogin = {
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'loginOrEmail',
          },
          {
            message: expect.any(String),
            field: 'password',
          },
        ],
      };

      const response = await request(server).post('/auth/login').send({});
      expect(response.status).toBe(400);
      expect(response.body).toEqual(errorLogin);
    });
    it('login user', async () => {
      const response = await request(server)
        .post('/auth/login')
        .set('User-Agent', faker.internet.userAgent())
        .send({ loginOrEmail: 'kuraga', password: '1234567' });

      accessToken = response.body.accessToken;
      cookie = response.get('Set-Cookie');

      user1 = await userRepositorySql.findUserId(user1!.id);
      // session = await securityDevicesService.getDeviceAllSessionUserId(
      //   user1!.id,
      // );
      expect(response.status).toBe(200);
      expect(accessToken).toBeDefined();
      expect(session.length).toBe(0);
      expect(response.body).toEqual({ accessToken: expect.any(String) });
      expect(cookie).toBeDefined();
    });
  });

  // describe('POST Refresh-Token', () => {
  //   it('no cookies, 401', async () => {
  //     const response = await request(server)
  //       .post('/auth/refresh-token')
  //       .send({});
  //     expect(response.status).toBe(401);
  //   });
  //   it('incorrect cookies, 401', async () => {
  //     const response = await request(server)
  //       .post('/auth/refresh-token')
  //       .set('Cookie', ['refreshToken = hello123'])
  //       .send({});
  //     expect(response.status).toBe(401);
  //   });
  //
  //   it('refresh-token user', async () => {
  //     const response = await request(server)
  //       .post('/auth/refresh-token')
  //       .set('Cookie', cookie)
  //       .send({});
  //
  //     cookie = response.get('Set-Cookie');
  //     expect(response.body.accessToken).toBeDefined();
  //     expect(cookie).toBeDefined();
  //   });
  // });

  it('login user', async () => {
    const response = await request(server)
      .post('/auth/login')
      .set('User-Agent', faker.internet.userAgent())
      .send({ loginOrEmail: 'kuraga', password: '1234567' });

    accessToken1 = response.body.accessToken;
    cookie1 = response.get('Set-Cookie');

    user1 = await userRepositorySql.findUserId(user1!.id);
    // session = await securityDevicesService.getDeviceAllSessionUserId(user1!.id);
    expect(response.status).toBe(200);
    expect(accessToken1).toBeDefined();
    expect(response.body).toEqual({ accessToken: expect.any(String) });
    expect(cookie1).toBeDefined();
  });
  // describe('POST logout', () => {
  //   it('incorrect token user, 401', async () => {
  //     const response = await request(server)
  //       .post('/auth/logout')
  //       .set('Cookie', ['refreshToken = Hello'])
  //       .send({});
  //
  //     expect(response.status).toBe(401);
  //   });
  //
  //   it('incorrect token user, 401', async () => {
  //     const response = await request(server).post('/auth/logout').send({});
  //     expect(response.status).toBe(401);
  //   });
  //
  //   it('logout user', async () => {
  //     const response = await request(server)
  //       .post('/auth/logout')
  //       .set('Cookie', cookie)
  //       .send({});
  //
  //     user1 = await userRepositorySql.findUserId(user1!.id);
  //     session = await securityDevicesService.getDeviceAllSessionUserId(
  //       user1!.id,
  //     );
  //     expect(response.status).toBe(204);
  //     expect(session.length).toBe(1);
  //   });
  // });
  // describe('GET => me', () => {
  //   it('unauthorized, 401', async () => {
  //     const response = await request(server).get(`/auth/me`);
  //     expect(response.status).toBe(401);
  //   });
  //   it('correct token, 200', async () => {
  //     const response = await request(server)
  //       .get(`/auth/me`)
  //       .auth(accessToken, { type: 'bearer' });
  //
  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual({
  //       email: user1!.email,
  //       login: user1!.login,
  //       userId: user1!.id,
  //     });
  //   });
  // });
});
