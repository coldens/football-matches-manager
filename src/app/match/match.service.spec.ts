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

  let matches: Awaited<ReturnType<MatchService['findAll']>>;

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

    matches = [
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
    ];

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

  describe('findAll', () => {
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

  describe('update', () => {
    it('should update a match', async () => {
      const updateMatchDto = {
        homeScore: 1,
        awayScore: 0,
        isFinished: true,
      };

      // @ts-expect-error Mocking the findOne method to return the match
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(matches[0]); // Mock the findOne method to return the match

      prisma.$transaction.mockResolvedValueOnce(matches[0]); // Mock the transaction to return the match updated

      const result = await service.update(user, 1, updateMatchDto);

      expect(result).toEqual(matches[0]);
    });
  });

  describe('remove', () => {
    it('should remove a match', async () => {
      // @ts-expect-error Mocking the findOne method to return the match
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(matches[0]); // Mock the findOne method to return the match

      prisma.match.delete.mockResolvedValueOnce(matches[0]); // Mock the delete method to return the match deleted

      const result = await service.remove(user, 1);

      expect(result).toEqual({
        result: 'Match deleted',
      });
    });
  });
});
