import { UseAuth } from '@/app/auth/use-auth';
import { UseUser } from '@/app/auth/use-user';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchDto } from '../dto/update-match.dto';
import { CreateMatchService } from '../services/create-match.service';
import { DeleteMatchService } from '../services/delete-match.service';
import { FindMatchService } from '../services/find-match.service';
import { UpdateMatchService } from '../services/update-match.service';

@Controller('match')
@UseAuth()
export class MatchController {
  constructor(
    private readonly findService: FindMatchService,
    private readonly createService: CreateMatchService,
    private readonly updateService: UpdateMatchService,
    private readonly deleteService: DeleteMatchService,
  ) {}

  @Post()
  create(@Body() createMatchDto: CreateMatchDto, @UseUser() user: User) {
    return this.createService.execute(user, createMatchDto);
  }

  @Get()
  findAll(@UseUser() user: User) {
    return this.findService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @UseUser() user: User) {
    return this.findService.findOne(user, id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateMatchDto: UpdateMatchDto, @UseUser() user: User) {
    return this.updateService.execute(user, id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @UseUser() user: User) {
    return this.deleteService.execute(user, id);
  }
}
