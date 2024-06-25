import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './question.schema';
import { Player } from '../players/player.schema';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
  ) {}

  async startNewGame(displayName: string): Promise<Player> {
    const player = new this.playerModel({ displayName });
    return player.save();
  }

  async fetchQuestion(
    playerId: string,
  ): Promise<Omit<Question, 'correctAnswer'>> {
    const player = await this.playerModel.findById(playerId);
    if (!player) throw new NotFoundException('Player not found');
    if (player.status === 'forfeited')
      throw new BadRequestException(
        'This game has been forfeited. You cannot continue.',
      );

    const questions = await this.questionModel.find();
    const unAnsweredQuestion = questions.filter(
      (q: any) => !player.answeredQuestions.includes(q._id),
    );

    const question =
      unAnsweredQuestion[Math.floor(Math.random() * unAnsweredQuestion.length)];
    const { correctAnswer, ...questionWithoutAnswer } = question.toObject();
    console.log('correctAnswer: ', correctAnswer);

    return questionWithoutAnswer;
  }

  async submitAnswer(
    playerId: string,
    questionId: string,
    answer: string,
  ): Promise<{ correct: boolean; player: Player; correctAnswer: string }> {
    const question = await this.questionModel.findById(questionId);
    if (!question) throw new NotFoundException('Question not found');

    const player = await this.playerModel.findById(playerId);
    if (!player) throw new NotFoundException('Player not found');
    if (player.status === 'forfeited')
      throw new BadRequestException(
        'This game has been forfeited. You cannot continue.',
      );

    const correct = question.correctAnswer === answer;

    if (player.answeredQuestions.includes(questionId)) {
      throw new BadRequestException('Question has already been answered');
    }

    const correctAnswer = question.correctAnswer;

    if (correct) {
      player.currentLevel++;
      player.prizeMoney = this.calculatePrizeMoney(player.currentLevel);

      if (player.currentLevel >= 9) {
        player.status = 'completed';
      }
    } else {
      player.status = 'lost';
      if (player.currentLevel < 4) {
        player.prizeMoney = 0;
      } else {
        player.prizeMoney = this.calculateMilestonePrizeMoney(
          player.currentLevel,
        );
      }
    }
    player.answeredQuestions.push(questionId);

    await player.save();
    return { correct, player, correctAnswer };
  }

  calculatePrizeMoney(level: number): number {
    const prizeLevels = [
      1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000,
    ];
    return prizeLevels[level - 1];
  }

  calculateMilestonePrizeMoney(level: number): number {
    const milestones = [0, 0, 0, 1000, 1000, 100000, 100000, 1000000, 1000000];
    return milestones[level - 1];
  }

  async useLifeline(
    playerId: string,
    lifeline: string,
    questionId: string,
  ): Promise<any> {
    const player = await this.playerModel.findById(playerId);
    if (!player) throw new NotFoundException('Player not found');
    if (player.status === 'forfeited')
      throw new BadRequestException(
        'This game has been forfeited. You cannot continue.',
      );

    if (player.lifelines <= 0) {
      throw new Error('No lifelines left');
    }

    player.lifelines--;
    await player.save();

    const question = await this.questionModel.findById(questionId);
    if (!question) throw new NotFoundException('Question not found');

    let lifelineResult;

    if (lifeline === '50-50') {
      const incorrectOptions = question.options.filter(
        (option) => option !== question.correctAnswer,
      );
      const optionsToRemove = incorrectOptions.slice(0, 2);
      const remainingOptions = question.options.filter(
        (option) => !optionsToRemove.includes(option),
      );
      lifelineResult = {
        question: question.question,
        options: remainingOptions,
      };
    } else if (lifeline === 'AskTheAI') {
      lifelineResult = {
        question: question.question,
        hint: question.correctAnswer,
      };
    }

    return { message: 'Lifeline used', lifelineResult, player };
  }

  async quitGame(playerId: string): Promise<Player> {
    const player = await this.playerModel.findById(playerId);
    if (!player) throw new NotFoundException('Player not found');
    if (player.status === 'forfeited')
      throw new BadRequestException(
        'This game has been forfeited. You cannot continue.',
      );

    if (player.currentLevel < 4) {
      throw new BadRequestException(
        'Player can only quit after winning Rs 1000 (level 4)',
      );
    }

    player.status = 'quit';
    await player.save();
    return player;
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.playerModel.find();
  }

  @Interval(30000)
  @Cron(CronExpression.EVERY_30_SECONDS)
  async forFeitIncompleteGames(): Promise<void> {
    const threshold = new Date(Date.now() - 30 * 1000);
    const incompleteGames = await this.playerModel.find({
      status: 'in-progress',
      startTime: { $lt: threshold },
    });

    for (const game of incompleteGames) {
      game.status = 'forfeited';
      game.prizeMoney = 0;
      await game.save();
    }
  }
}
