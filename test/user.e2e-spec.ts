import { INestApplication } from '@nestjs/common';
import { TestingUser } from './helper/helper';
import { UserModelView } from '../src/features/user/dto/user.model';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { createConfig } from '../src/config/create.config';
import * as request from 'supertest';

describe('user', () => {
  let app: INestApplication;
  let server;
  let testingUser: TestingUser;
  let newUser1: UserModelView;
  let newUser2: UserModelView;
  let newUser3: UserModelView;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app = createConfig(app);
    await app.init();
    server = app.getHttpServer();
    testingUser = new TestingUser(server);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('DELETE ALL', () => {
    it('delete all user', async () => {
      const response = await request(server).delete('/testing/all-data');
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  describe('POST', () => {
    it('Unauthorized user, 401', async () => {
      const response = await request(server).post('/sa/users').send({});
      expect(response.status).toBe(401);
    });
    it('no data available user, 400', async () => {
      const errorUser = {
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
        .post('/sa/users')
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(errorUser);
    });
    it('data is empty user, 400', async () => {
      const user = {
        login: '',
        password: '',
        email: '',
      };
      const errorUser = {
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
        .post('/sa/users')
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(user);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(errorUser);
    });

    it('correct data user, 201', async () => {
      newUser1 = await testingUser.createUser();
      const response = await request(server)
        .get('/sa/users')
        .auth('admin', 'qwerty', { type: 'basic' });

      expect(response.status).toBe(200);

      it('correct data user, 201', async () => {
        newUser2 = await testingUser.createUser();
        const response = await request(server)
          .get('sa/users')
          .auth('admin', 'qwerty', { type: 'basic' });

        expect(response.status).toBe(200);
      });

      it('correct data user pagination, 201', async () => {
        newUser3 = await testingUser.createUserForPagination();
        const response = await request(server)
          .get('sa/users')
          .auth('admin', 'qwerty', { type: 'basic' });

        expect(response.status).toBe(200);
      });
    });

    describe('GET => :id', () => {
      it('Unauthorized user, 401', async () => {
        const response = await request(server).get('/sa/users');
        expect(response.status).toBe(401);
      });
      it('pagination: sortBy: createdAt, sortDirection: desc, pageNumber: 1, pageSize: 10', async () => {
        const response = await request(server)
          .get('/sa/users')
          .auth('admin', 'qwerty', { type: 'basic' })
          .query({
            sortBy: 'createdAt',
            sortDirection: 'desc',
            pageNumber: 1,
            pageSize: 10,
          });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          pagesCount: 1,
          page: 1,
          pageSize: 10,
          totalCount: 3,
          items: expect.any(Array),
        });
      });
      it('pagination: sortBy: createdAt, sortDirection: asc, pageNumber: 1, pageSize: 10', async () => {
        const response = await request(server)
          .get('/sa/users')
          .auth('admin', 'qwerty', { type: 'basic' })
          .query({
            sortBy: 'createdAt',
            sortDirection: 'asc',
            pageNumber: 1,
            pageSize: 10,
          });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          pagesCount: 1,
          page: 1,
          pageSize: 10,
          totalCount: 3,
          items: expect.any(Array),
        });
      });

      it('pagination searchLoginTerm', async () => {
        const response = await request(server)
          .get('/sa/users')
          .auth('admin', 'qwerty', { type: 'basic' })
          .query({
            searchEmailTerm: 'A',
          });

        expect(response.status).toBe(200);
        expect(response.body.items[0].id).toBe(newUser3.id);
      });
    });
    describe('DELETE => :id', () => {
      it('Unauthorized user, 401', async () => {
        const response = await request(server).get('/sa/users');
        expect(response.status).toBe(401);
      });
      it('not found, 404', async () => {
        const response = await request(server)
          .get('/sa/users/-12345')
          .auth('admin', 'qwerty', { type: 'basic' });

        expect(response.status).toBe(404);
      });
      it('delete user, 204', async () => {
        const response = await request(server)
          .delete(`/sa/users/${newUser3.id}`)
          .auth('admin', 'qwerty', { type: 'basic' });
        expect(response.status).toBe(204);

        const responseAfter = await request(server)
          .get(`/sa/users/${newUser3.id}`)
          .auth('admin', 'qwerty', { type: 'basic' });

        expect(responseAfter.status).toBe(404);
      });
    });
  });
});
