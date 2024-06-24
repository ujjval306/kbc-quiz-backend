// src/game/seed.controller.ts

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({ summary: 'Seed the questions in the database' })
  async seedQuestions() {
    return await this.seedService.seedQuestions();
  }
}
