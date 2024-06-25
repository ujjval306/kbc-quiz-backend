import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kbc_quiz'),
    GameModule,
    PlayersModule,
  ],
})
export class AppModule {}
