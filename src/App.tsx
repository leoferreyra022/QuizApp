import React , {useState, useEffect} from 'react';
import QuestionCardComponent from './Components/QuestionCardComponent';
import { GamesCategoryEnum, getQuizQuestionAsync } from './Api';
import { QuestionState, DifficultyEnum } from './Api'
import { GlobalStyle, Wrapper } from './App.styles'

const TOTAL_QUESTIONS : number = 10;

export type UserAnswer = {
  question: string;
  answer: string;
  isCorrect: boolean;
  correctAnswer: string;
}

function App() {

  const localStorageKey: string = "storedScore";
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState(0);
  const [storedScore, setStoredScore] = useState(Number(localStorage.getItem(localStorageKey)) || 0);
  const [gameOver, setGameOver] = useState(true);

  useEffect(() => {
    localStorage.setItem(localStorageKey, storedScore.toString())
  },[storedScore]);
  
  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await getQuizQuestionAsync(
      TOTAL_QUESTIONS, 
      DifficultyEnum.EASY,
      GamesCategoryEnum.BoardGames);

    setQuestions(newQuestions);
    setScore(0);
    setNumber(0);
    setUserAnswers([]);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const isCorrect = questions[number].correct_answer === answer;

      if(isCorrect){
        setScore(prev => prev + 1);
        setStoredScore(prev => prev + 1);
      }

      const userAnswer = {
        question : questions[number].question,
        answer,
        isCorrect: isCorrect,
        correctAnswer : questions[number].correct_answer
      };

      setUserAnswers(prev => [...prev, userAnswer]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);
    } else{
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <div className="App">
          <h1>BoardGames Quiz</h1>
          {(gameOver || userAnswers.length === TOTAL_QUESTIONS) && (
            <button className="start" onClick={startTrivia}>
              Start Trivia
            </button>
          )}
          {!gameOver && <p className="score">Score: {score}</p>}
          <p className="score">Historical Score: {storedScore}</p>
          {loading && <p>Loading Questions...</p>}
          {!loading && !gameOver && (
            <QuestionCardComponent
              questionNr = {number + 1}
              totalQuestions = {TOTAL_QUESTIONS}
              question = {questions[number].question}
              answers = {questions[number].answers}
              userAnswer = {userAnswers ? userAnswers[number] : undefined}
              callback = {checkAnswer}
            />
          )}
          {!gameOver && !loading && userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTIONS && (
            <button className="next" onClick={nextQuestion}>
              {userAnswers.length === TOTAL_QUESTIONS ? "Finish quiz" : "Next Question" }
            </button>
          )}
          {userAnswers.length === TOTAL_QUESTIONS && <h4 className="score">Game over!</h4>}
        </div>
      </Wrapper>
    </>
  );
  
}

export default App;
