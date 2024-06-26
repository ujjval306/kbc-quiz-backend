import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './question.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async seedQuestions() {
    const questions = [
      {
        question: 'What is 2+7?',
        options: ['3', '7', '9', '11'],
        correctAnswer: '9',
      },
      {
        question: 'What is 5x15?',
        options: ['25', '50', '75', '100'],
        correctAnswer: '75',
      },
      {
        question: 'What is 6x9?',
        options: ['54', '36', '24', '69'],
        correctAnswer: '54',
      },
      {
        question: 'What is 0+0?',
        options: ['0', '1', '100', '1000'],
        correctAnswer: '0',
      },
      {
        question: 'How many alphabets are there in the word "apple"?',
        options: ['10', '15', '5', '7'],
        correctAnswer: '5',
      },
      {
        question: 'What is the colour of the moon?',
        options: ['red', 'orange', 'pink', 'white'],
        correctAnswer: 'white',
      },
      {
        question: 'How many legs does a chicken have?',
        options: ['1', '2', '4', '10'],
        correctAnswer: '2',
      },
      {
        question: 'Which one of these is not a programming language?',
        options: ['C', 'C++', 'Javascript', 'English'],
        correctAnswer: 'English',
      },
      {
        question: 'How many days are there in a week?',
        options: ['10', '5', '7', '6'],
        correctAnswer: '7',
      },
      {
        question: 'Which of these is not a React library inbuilt hook?',
        options: [
          'useState',
          'useRef',
          'useImperativeHandle',
          'useLocalStorage',
        ],
        correctAnswer: 'useLocalStorage',
      },
    ];

    for (const question of questions) {
      const newQuestion = new this.questionModel(question);
      await newQuestion.save();
    }

    return 'Seeding complete';
  }
}
