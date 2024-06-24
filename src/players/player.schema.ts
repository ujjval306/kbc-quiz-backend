// src/players/player.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Player extends Document {
  @Prop({ required: true })
  displayName: string;

  @Prop({ default: 0 })
  prizeMoney: number;

  @Prop({ default: 0 })
  currentLevel: number;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  startTime: Date;

  @Prop({ default: 2 })
  lifelines: number;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
