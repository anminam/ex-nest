import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll()', () => {
    it('should return an Array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('하나를 가져온다', () => {
      service.create({
        title: '우왕',
        genres: ['test'],
        year: 2022,
      });
      const result = service.getOne(1);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Object);
      expect(result.title).toEqual('우왕');
    });

    it('should throw 404 Error', () => {
      const id = 999;
      try {
        service.getOne(id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`영화를 찾을 수 없습니다. id: ${id}`);
      }
    });
  });

  describe('deleteOne', () => {
    it('delete a movie', () => {
      service.create({
        title: '우왕',
        genres: ['test'],
        year: 2022,
      });

      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll();
      expect(afterDelete.length).toBeLessThan(beforeDelete);
    });

    it('should return a 404', () => {
      try {
        service.deleteOne(444);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('create one', () => {
      const beforeMovie = service.getAll().length;
      service.create({
        title: '우왕',
        genres: ['test'],
        year: 2022,
      });
      const afterMovie = service.getAll().length;
      expect(afterMovie).toBeGreaterThan(beforeMovie);
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.create({
        title: '우왕',
        genres: ['test'],
        year: 2022,
      });

      service.update(1, { title: '좌왕' });

      const movie = service.getOne(1);
      expect(movie.title).toEqual('좌왕');
    });

    it('should throw a NotFoundException', () => {
      const id = 444;
      try {
        service.update(id, { title: '좌왕' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
