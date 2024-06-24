// src/game/game.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Question, QuestionSchema } from './question.schema';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { Player, PlayerSchema } from '../players/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  controllers: [GameController, SeedController],
  providers: [GameService, SeedService],
})
export class GameModule {}
