import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, User } from '@prisma/client';
import { mock, mockDeep, MockProxy } from 'jest-mock-extended';
import { PrismaService } from '../../prisma/prisma.service';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

const user: User = {
  id: 1,
  email: 'example@mail.io',
  name: 'Test User',
  apiKey: 'a key',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const match: Prisma.MatchGetPayload<{
  include: {
    teams: true;
  };
}> = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  homeScore: 0,
  awayScore: 0,
  date: new Date(),
  userId: 1,
  isFinished: false,
  isStarted: false,
  teams: [],
};

describe('MatchController', () => {
  let controller: MatchController;
  let matchService: MockProxy<MatchService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: MatchService,
          useValue: mock<MatchService>(),
        },
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    controller = module.get<MatchController>(MatchController);
    matchService = module.get(MatchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a match', async () => {
      matchService.create.mockResolvedValue(match);
      expect(await controller.create({} as any, user)).toEqual(match);
    });
  });

  describe('findAll', () => {
    it('should return an array of matches', async () => {
      matchService.findAll.mockResolvedValue([match]);
      expect(await controller.findAll(user)).toEqual([match]);
    });
  });

  describe('findOne', () => {
    it('should return a match', async () => {
      // @ts-expect-error matchService findOne mock is not typed correctly
      matchService.findOne.mockResolvedValue(match);
      expect(await controller.findOne(1, user)).toEqual(match);
    });
  });

  describe('update', () => {
    it('should update a match', async () => {
      // @ts-expect-error matchService findOne mock is not typed correctly
      matchService.update.mockResolvedValue(match);
      expect(await controller.update(1, {} as any, user)).toEqual(match);
    });
  });

  describe('remove', () => {
    it('should remove a match', async () => {
      const removalSuccess = { result: 'success' };
      matchService.remove.mockResolvedValue(removalSuccess);
      expect(await controller.remove(1, user)).toEqual(removalSuccess);
    });
  });
});
