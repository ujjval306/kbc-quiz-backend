import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { GameModule } from './game/game.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kbc_quiz'),
    ScheduleModule.forRoot(),
    GameModule,
    PlayersModule,
  ],
})
export class AppModule {}
