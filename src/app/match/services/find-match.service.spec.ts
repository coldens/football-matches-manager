import { PrismaService } from '@/prisma/prisma.service';
import { Logger, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { FindMatchService } from './find-match.service';

describe(FindMatchService.name, () => {
  let service: FindMatchService;
  let prisma: DeepMockProxy<PrismaService>;

  const user = {
    id: 1,
    email: 'test@mail.io',
    name: 'Test User',
    apiKey: 'test-api-key',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const matches = [
    {
      teams: [
        {
          teamId: 1,
          matchId: 1,
          homeTeam: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          teamId: 2,
          matchId: 1,
          homeTeam: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      homeScore: 0,
      awayScore: 0,
      date: new Date(),
      userId: 1,
      isFinished: false,
      isStarted: false,
    },
  ] satisfies Awaited<ReturnType<FindMatchService['findAll']>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindMatchService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get(FindMatchService);
    prisma = module.get(PrismaService);

    Logger.overrideLogger(false);
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return all matches', async () => {
      prisma.match.findMany.mockResolvedValueOnce(matches);

      const result = await service.findAll(user);

      expect(result).toEqual(matches);
    });
  });

  describe('findOne', () => {
    it('should return a match', async () => {
      prisma.match.findUnique.mockResolvedValueOnce(matches[0]);

      const result = await service.findOne(user, 1);

      expect(result).toEqual(matches[0]);
    });

    it('should throw an error if match is not found', async () => {
      prisma.match.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne(user, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
