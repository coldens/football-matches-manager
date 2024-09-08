import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, User } from '@prisma/client';
import { mock, mockDeep, MockProxy } from 'jest-mock-extended';
import { CreateMatchService } from '../services/create-match.service';
import { DeleteMatchService } from '../services/delete-match.service';
import { FindMatchService } from '../services/find-match.service';
import { UpdateMatchService } from '../services/update-match.service';
import { MatchController } from './match.controller';

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

describe(MatchController.name, () => {
  let controller: MatchController;
  let findService: MockProxy<FindMatchService>;
  let createService: MockProxy<CreateMatchService>;
  let updateService: MockProxy<UpdateMatchService>;
  let deleteService: MockProxy<DeleteMatchService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: FindMatchService,
          useValue: mock<FindMatchService>(),
        },
        {
          provide: CreateMatchService,
          useValue: mock<CreateMatchService>(),
        },
        {
          provide: UpdateMatchService,
          useValue: mock<UpdateMatchService>(),
        },
        {
          provide: DeleteMatchService,
          useValue: mock<DeleteMatchService>(),
        },
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    controller = module.get(MatchController);
    findService = module.get(FindMatchService);
    createService = module.get(CreateMatchService);
    updateService = module.get(UpdateMatchService);
    deleteService = module.get(DeleteMatchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a match', async () => {
      createService.execute.mockResolvedValue(match);
      expect(await controller.create({} as any, user)).toEqual(match);
    });
  });

  describe('findAll', () => {
    it('should return an array of matches', async () => {
      findService.findAll.mockResolvedValue([match]);
      expect(await controller.findAll(user)).toEqual([match]);
    });
  });

  describe('findOne', () => {
    it('should return a match', async () => {
      // @ts-expect-error matchService findOne mock is not typed correctly
      findService.findOne.mockResolvedValue(match);
      expect(await controller.findOne(1, user)).toEqual(match);
    });
  });

  describe('update', () => {
    it('should update a match', async () => {
      // @ts-expect-error matchService findOne mock is not typed correctly
      updateService.execute.mockResolvedValue(match);
      expect(await controller.update(1, {} as any, user)).toEqual(match);
    });
  });

  describe('remove', () => {
    it('should remove a match', async () => {
      const removalSuccess = { result: 'success' };
      deleteService.execute.mockResolvedValue(removalSuccess);
      expect(await controller.remove(1, user)).toEqual(removalSuccess);
    });
  });
});
