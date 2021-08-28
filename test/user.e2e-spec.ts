import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/modules/user/dto/create-user.dto';
import * as request from 'supertest';

const createUserDto: CreateUserDto = {
  username: 'foo',
  email: 'foo@foo.ru',
  password: 'foo',
};

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST)', async (done) => {
    return request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body.user).toBeDefined();
        done();
      });
  });
});
