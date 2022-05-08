import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  describe('/movies', () => {
    it('Get', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });

    it('Post', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: '우왕', year: 2022, genres: ['test'] })
        .expect(201);
    });

    it('Post 400', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: '우왕', year: 2022, genres: ['test'], test: true })
        .expect(400);
    });

    it('Delete', () => {
      return request(app.getHttpServer()).delete('/movies').expect(404);
    });
  });

  describe('/movies/:id', () => {
    it('GET 200', () => {
      return request(app.getHttpServer()).get('/movies/1').expect(200);
    });
    it('GET 404', () => {
      return request(app.getHttpServer()).get('/movies/77').expect(404);
    });
    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: 'update Test' })
        .expect(200);
    });
    it('Delete 200', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });
  });
});
