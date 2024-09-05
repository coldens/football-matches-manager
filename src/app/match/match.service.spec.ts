import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { User } from '@prisma/client';
import { Logger } from '@nestjs/common';

describe('MatchService', () => {
  let service: MatchService;
  let prisma: DeepMockProxy<PrismaService>;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get(MatchService);
    prisma = module.get(PrismaService);

    user = {
      id: 1,
      email: 'test@mail.io',
      name: 'Test User',
      apiKey: 'test-api-key',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    Logger.overrideLogger(false);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a match', async () => {
      const createMatchDto = {
        date: new Date(),
        homeTeamId: 1,
        awayTeamId: 2,
      };

      prisma.$transaction.mockResolvedValue({
        id: 1,
        teams: [],
      });

      const match = await service.create(user, createMatchDto);

      expect(match).toEqual({
        id: 1,
        teams: [],
      });
    });

    it('should throw an error if home team and away team are the same', async () => {
      const createMatchDto = {
        date: new Date(),
        homeTeamId: 1,
        awayTeamId: 1,
      };

      await expect(service.create(user, createMatchDto)).rejects.toThrowError();
    });
  });
});
