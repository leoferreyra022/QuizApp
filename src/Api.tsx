import { shuffleArray } from './utils'
import axios from 'axios';

export type Question = {
    category:string;
    correct_answer:string;
    difficulty:string;
    incorrect_answers:string[];
    question:string;
    type:string;
}

export type QuestionState = Question & { answers : string[]}

export enum DifficultyEnum {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}

export enum GamesCategoryEnum {
    VideoGames = 15,
    BoardGames = 16
}

const baseUri = "https://opentdb.com/api.php?";

// Using fetch library
export const fetchQuizQuestionsAsync = 
async (amount: number, difficulty: DifficultyEnum) => {
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
    const data = await (await fetch(endpoint)).json();
    //console.log(data);
    return data.results.map((question : Question) => ({
        ...question,
        answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
    }))
}
// Using Axios library
export const getQuizQuestionAsync = async (
    amount: number, 
    difficulty?: DifficultyEnum, 
    category?: GamesCategoryEnum) : Promise<any> => {
        const endpoint = 
        `${baseUri}amount=${amount}&difficulty=${difficulty}&category=${category}&type=multiple`;

        return await axios.get(endpoint)
        .then(resp => resp.data.results.map((question : Question) => ({
            ...question,
            answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
        })))
        .catch(err => console.log(err));
  }