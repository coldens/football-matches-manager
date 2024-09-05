import { Logger, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Team, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { PrismaService } from '../../prisma/prisma.service';
import { MatchService } from './match.service';

describe('MatchService', () => {
  let service: MatchService;
  let prisma: DeepMockProxy<PrismaService>;
  let user: User;
  let team1: Team;
  let team2: Team;

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
    };

    team1 = {
      id: 1,
      name: 'Team 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    team2 = {
      id: 2,
      name: 'Team 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

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

      prisma.$transaction.mockResolvedValueOnce([team1, team2]); // Mock the transaction to return the teams

      prisma.$transaction.mockResolvedValueOnce({
        id: 1,
        teams: [],
      }); // Mock the transaction to return the match created

      const match = await service.create(user, createMatchDto);

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

      await expect(service.create(user, createMatchDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if away team is not found', async () => {
      const createMatchDto = {
        date: new Date(),
        homeTeamId: 1,
        awayTeamId: 2,
      };

      prisma.$transaction.mockResolvedValueOnce([team1, null]); // Mock the transaction to return the teams

      await expect(service.create(user, createMatchDto)).rejects.toThrow(NotFoundException);
    });
  });
});
