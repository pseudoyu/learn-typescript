import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('shoyld throw if email empty', () => {
        const dto: AuthDto = {
          email: '',
          password: 'zy',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        const dto: AuthDto = {
          email: 'zy@zy.com',
          password: '',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(400);
      });

      it('should throw if email invalid', () => {
        const dto: AuthDto = {
          email: 'zy',
          password: 'zy',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(400);
      });

      it('should create a new user', () => {
        const dto: AuthDto = {
          email: 'zy@zy.com',
          password: 'zy',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('should throw if email empty', () => {
        const dto: AuthDto = {
          email: '',
          password: 'zy',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        const dto: AuthDto = {
          email: 'zy@zy.com',
          password: '',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(400);
      });

      it('should throw if email invalid', () => {
        const dto: AuthDto = {
          email: 'zy',
          password: 'zy',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(400);
      });

      it('should signin', () => {
        const dto: AuthDto = {
          email: 'zy@zy.com',
          password: 'zy',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('Users', () => {
    describe('Get current user', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Update current user', () => {
      it('should update current user', () => {
        const dto: EditUserDto = {
          firstName: 'Yu',
          lastName: 'Zhang',
          email: 'test@zy.com',
        };

        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it.todo('should create a new bookmark');
    });

    describe('Get bookmarks', () => {
      it.todo('should get all bookmarks');
    });

    describe('Get bookmark by id', () => {
      it.todo('should get a bookmark by id');
    });

    describe('Update bookmark', () => {
      it.todo('should update a bookmark');
    });

    describe('Delete bookmark', () => {
      it.todo('should delete a bookmark');
    });
  });
});
