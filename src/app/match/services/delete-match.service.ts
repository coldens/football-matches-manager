import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { FindMatchService } from './find-match.service';

@Injectable()
export class DeleteMatchService {
  private readonly logger = new Logger(DeleteMatchService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly findService: FindMatchService,
  ) {}

  async execute(user: User, id: number) {
    const match = await this.findService.findOne(user, id);

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

    this.logger.log(`Match with ID ${id} deleted`);

    return { result: 'Match deleted' };
  }
}
