import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';

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
    describe('Get empty bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      it('should create a new bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'test',
          description: 'test',
          link: 'https://www.google.com',
        };

        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('should get all bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by id', () => {
      it('should get a bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams({
            id: '$S{bookmarkId}',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Update bookmark', () => {
      it('should update a bookmark', () => {
        const dto = {
          title: 'test2',
          description: 'test2',
          link: 'https://www.google.com',
        };
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams({
            id: '$S{bookmarkId}',
          })
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Delete bookmark', () => {
      it('should delete a bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams({
            id: '$S{bookmarkId}',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });
    });

    describe('Get empty bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
