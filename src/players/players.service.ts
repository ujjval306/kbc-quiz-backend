import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './player.schema';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<Player>,
  ) {}

  async create(displayName: string): Promise<Player> {
    const createdPlayer = new this.playerModel({ displayName });
    return await createdPlayer.save();
  }

  async findById(id: string): Promise<Player> {
    return await this.playerModel.findById(id).exec();
  }

  async update(playerId: string, updates: Partial<Player>): Promise<Player> {
    return await this.playerModel
      .findByIdAndUpdate(playerId, updates, { new: true })
      .exec();
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }
}
