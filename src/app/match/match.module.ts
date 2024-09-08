import { Module } from '@nestjs/common';
import { MatchController } from './http/match.controller';
import { CreateMatchService } from './services/create-match.service';
import { DeleteMatchService } from './services/delete-match.service';
import { FindMatchService } from './services/find-match.service';
import { UpdateMatchService } from './services/update-match.service';

@Module({
  controllers: [MatchController],
  providers: [FindMatchService, CreateMatchService, UpdateMatchService, DeleteMatchService],
})
export class MatchModule {}
