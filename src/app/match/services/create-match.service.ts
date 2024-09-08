import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateMatchDto } from '../dto/create-match.dto';

@Injectable()
export class CreateMatchService {
  private readonly logger = new Logger(CreateMatchService.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(user: User, createMatchDto: CreateMatchDto) {
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
}
