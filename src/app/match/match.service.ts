import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, createMatchDto: CreateMatchDto) {
    const [homeTeam, awayTeam] = await this.prisma.$transaction([
      this.prisma.team.findUnique({
        where: {
          id: createMatchDto.homeTeamId,
        },
      }),
      this.prisma.team.findUnique({
        where: {
          id: createMatchDto.awayTeamId,
        },
      }),
    ]);

    if (!homeTeam) {
      throw new NotFoundException(`Team with ID ${createMatchDto.homeTeamId} not found`);
    }
    if (!awayTeam) {
      throw new NotFoundException(`Team with ID ${createMatchDto.awayTeamId} not found`);
    }

    const match = await this.prisma.$transaction(async (tx) => {
      const { id: matchId } = await tx.match.create({
        data: {
          date: createMatchDto.date,
          homeScore: 0,
          awayScore: 0,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await tx.teamsOnMatch.createMany({
        data: [
          {
            teamId: createMatchDto.homeTeamId,
            matchId: matchId,
            homeTeam: true,
          },
          {
            teamId: createMatchDto.awayTeamId,
            matchId: matchId,
            homeTeam: false,
          },
        ],
      });

      return tx.match.findUniqueOrThrow({
        where: {
          id: matchId,
        },
        include: {
          teams: true,
        },
      });
    });

    this.logger.log(`Match created: ${match.id}`);

    return match;
  }

  async findAll(user: User) {
    const result = await this.prisma.match.findMany({
      where: {
        userId: user.id,
      },
      include: {
        teams: true,
      },
    });

    return result;
  }

  async findOne(user: User, id: number) {
    const match = await this.prisma.match.findUnique({
      where: {
        id,
      },
      include: {
        teams: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    if (match.userId !== user.id) {
      throw new ForbiddenException(`You do not have permission to access this match`);
    }

    return match;
  }

  async update(user: User, id: number, updateMatchDto: UpdateMatchDto) {
    const match = await this.findOne(user, id);

    if (match.isFinished) {
      throw new BadRequestException(`Match with ID ${id} is already finished`);
    }

    return this.prisma.$transaction(async (tx) => {
      // ======== Update teams on match ======== //
      if (updateMatchDto.homeTeamId) {
        const homeTeam = match.teams.find((team) => team.homeTeam)!;

        await tx.teamsOnMatch.update({
          where: {
            teamId_matchId: {
              matchId: match.id,
              teamId: homeTeam.teamId,
            },
          },
          data: {
            teamId: updateMatchDto.homeTeamId,
          },
        });
      }

      if (updateMatchDto.awayTeamId) {
        const awayTeam = match.teams.find((team) => !team.homeTeam)!;

        await tx.teamsOnMatch.update({
          where: {
            teamId_matchId: {
              matchId: match.id,
              teamId: awayTeam.teamId,
            },
          },
          data: {
            teamId: updateMatchDto.awayTeamId,
          },
        });
      }

      // ======== Update match fields ======== //
      const updateFields: Prisma.MatchUpdateInput = {};

      if (updateMatchDto.homeScore > 0) {
        updateFields.homeScore = updateMatchDto.homeScore;
      }
      if (updateMatchDto.awayScore > 0) {
        updateFields.awayScore = updateMatchDto.awayScore;
      }
      if (updateMatchDto.finished) {
        updateFields.isFinished = updateMatchDto.finished;
      }

      updateFields.isStarted = true;

      return await tx.match.update({
        where: {
          id: match.id,
        },
        data: updateFields,
        include: {
          teams: {
            include: {
              team: true,
            },
          },
        },
      });
    });
  }

  async remove(user: User, id: number) {
    const match = await this.findOne(user, id);

    await this.prisma.$transaction(async (tx) => {
      await tx.teamsOnMatch.deleteMany({
        where: {
          matchId: match.id,
        },
      });

      await tx.match.delete({
        where: {
          id: match.id,
        },
      });
    });

    return { result: 'Match deleted' };
  }
}
