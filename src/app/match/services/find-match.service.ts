import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class FindMatchService {
  constructor(private readonly prisma: PrismaService) {}

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
}
