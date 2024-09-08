import { PrismaService } from '@/prisma/prisma.service';
import { Logger, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CreateMatchService } from './create-match.service';

describe(CreateMatchService.name, () => {
  let service: CreateMatchService;
  let prisma: DeepMockProxy<PrismaService>;

  const user = {
    id: 1,
    email: 'test@mail.io',
    name: 'Test User',
    apiKey: 'test-api-key',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const team1 = {
    id: 1,
    name: 'Team 1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const team2 = {
    id: 2,
    name: 'Team 2',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMatchService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get(CreateMatchService);
    prisma = module.get(PrismaService);

    Logger.overrideLogger(false);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a match', async () => {
    const createMatchDto = {
      date: new Date(),
      homeTeamId: 1,
      awayTeamId: 2,
    };

    prisma.$transaction.mockResolvedValueOnce([team1, team2]); // Mock the transaction to return the teams

    prisma.$transaction.mockResolvedValueOnce({
      id: 1,
      teams: [],
    }); // Mock the transaction to return the match created

    const match = await service.execute(user, createMatchDto);

    expect(match).toEqual({
      id: 1,
      teams: [],
    });
  });

  it('should throw an error if home team is not found', async () => {
    const createMatchDto = {
      date: new Date(),
      homeTeamId: 1,
      awayTeamId: 2,
    };

    prisma.$transaction.mockResolvedValueOnce([null, team2]); // Mock the transaction to return the teams

    await expect(service.execute(user, createMatchDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw an error if away team is not found', async () => {
    const createMatchDto = {
      date: new Date(),
      homeTeamId: 1,
      awayTeamId: 2,
    };

    prisma.$transaction.mockResolvedValueOnce([team1, null]); // Mock the transaction to return the teams

    await expect(service.execute(user, createMatchDto)).rejects.toThrow(NotFoundException);
  });
});
