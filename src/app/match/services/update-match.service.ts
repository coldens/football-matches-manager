import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UpdateMatchDto } from '../dto/update-match.dto';
import { FindMatchService } from './find-match.service';

@Injectable()
export class UpdateMatchService {
  private readonly logger = new Logger(UpdateMatchService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly findService: FindMatchService,
  ) {}

  async execute(user: User, id: number, updateMatchDto: UpdateMatchDto) {
    const match = await this.findService.findOne(user, id);

    if (match.isFinished) {
      throw new BadRequestException(`Match with ID ${id} is already finished`);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
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

    this.logger.log(`Match with ID ${id} has been updated`);

    return updated;
  }
}
