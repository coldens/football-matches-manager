import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { UseAuth } from '../guard/use-auth';
import { UseUser } from '../guard/use-user';
import { User } from '@prisma/client';

@Controller('match')
@UseAuth()
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  create(@Body() createMatchDto: CreateMatchDto, @UseUser() user: User) {
    return this.matchService.create(user, createMatchDto);
  }

  @Get()
  findAll(@UseUser() user: User) {
    return this.matchService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @UseUser() user: User) {
    return this.matchService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateMatchDto: UpdateMatchDto,
    @UseUser() user: User,
  ) {
    return this.matchService.update(user, id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @UseUser() user: User) {
    return this.matchService.remove(user, id);
  }
}
