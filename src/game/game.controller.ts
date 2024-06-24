// src/game/game.controller.ts

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { GameService } from './game.service';
import { Player } from '../players/player.schema';
import { Question } from './question.schema';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new game' })
  @ApiBody({
    schema: { type: 'object', properties: { displayName: { type: 'string' } } },
  })
  @ApiResponse({
    status: 201,
    description: 'Game started successfully',
    type: Player,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async startNewGame(
    @Body('displayName') displayName: string,
  ): Promise<Player> {
    return this.gameService.startNewGame(displayName);
  }

  @Get('question/:playerId')
  @ApiOperation({ summary: 'Fetch a question for the player' })
  @ApiParam({ name: 'playerId', required: true, description: 'Player ID' })
  async fetchQuestion(@Param('playerId') playerId: string): Promise<Question> {
    return this.gameService.fetchQuestion(playerId);
  }

  @Post('answer')
  @ApiOperation({ summary: 'Submit an answer for a question' })
  @ApiBody({
    schema: {
      example: {
        playerId: 'playerId',
        questionId: 'questionId',
        answer: 'answer',
      },
    },
  })
  async submitAnswer(
    @Body() body: { playerId: string; questionId: string; answer: string },
  ): Promise<{ correct: boolean; player: Player }> {
    const { playerId, questionId, answer } = body;
    return this.gameService.submitAnswer(playerId, questionId, answer);
  }

  @Post('lifeline')
  @ApiOperation({ summary: 'Use a lifeline' })
  @ApiBody({
    schema: {
      example: { playerId: 'playerId', lifeline: '50-50', questionId: '' },
    },
  })
  async useLifeline(
    @Body() body: { playerId: string; lifeline: string; questionId: string },
  ): Promise<any> {
    const { playerId, lifeline, questionId } = body;
    return this.gameService.useLifeline(playerId, lifeline, questionId);
  }

  @Post('quit')
  @ApiOperation({ summary: 'Quit the game' })
  @ApiBody({ schema: { example: { playerId: 'playerId' } } })
  async quitGame(@Body('playerId') playerId: string): Promise<Player> {
    return this.gameService.quitGame(playerId);
  }

  @Get('players')
  @ApiOperation({ summary: 'Get all players' })
  async getAllPlayers(): Promise<Player[]> {
    return this.gameService.getAllPlayers();
  }
}
