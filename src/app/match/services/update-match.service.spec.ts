import { PrismaService } from '@/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { DeepMockProxy, mock, mockDeep, MockProxy } from 'jest-mock-extended';
import { FindMatchService } from './find-match.service';
import { UpdateMatchService } from './update-match.service';

describe(UpdateMatchService, () => {
  let service: UpdateMatchService;
  let prisma: DeepMockProxy<PrismaService>;
  let findService: MockProxy<FindMatchService>;

  const user: User = {
    id: 1,
    email: 'test@mail.io',
    name: 'Test User',
    apiKey: 'test-api-key',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMatchService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
        {
          provide: FindMatchService,
          useValue: mock<FindMatchService>(),
        },
      ],
    }).compile();

    service = module.get(UpdateMatchService);
    prisma = module.get(PrismaService);
    findService = module.get(FindMatchService);

    Logger.overrideLogger(false);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update a match', async () => {
    const updateMatchDto = {
      homeScore: 1,
      awayScore: 0,
      isFinished: true,
    };

    const match = {
      teams: [
        {
          teamId: 1,
          matchId: 1,
          homeTeam: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          team: {
            id: 1,
            name: 'Team 1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        {
          teamId: 2,
          matchId: 1,
          homeTeam: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          team: {
            id: 2,
            name: 'Team 2',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
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
    } satisfies Awaited<ReturnType<FindMatchService['findOne']>>;

    findService.findOne.mockResolvedValueOnce(match); // Mock the findService to return the match

    prisma.$transaction.mockResolvedValueOnce(match); // Mock the transaction to return the match updated

    const result = await service.execute(user, 1, updateMatchDto);

    expect(result).toEqual(match);
  });
});
