import React from 'react';
import { UserAnswer } from '../App';
import { ButtonWrapper, Wrapper } from './QuestionCardComponent.styles';

type Props = {
    question:string;
    answers:string[];
    callback:(e: React.MouseEvent<HTMLButtonElement>) => void;
    userAnswer:UserAnswer | undefined;
    questionNr:number;
    totalQuestions:number
}

const QuestionCardComponent: React.FC<Props> = ({
    question,answers,callback,userAnswer,
    questionNr,totalQuestions}) => (
        <Wrapper>
            <div>
                <p className="number">
                    Question: {questionNr} / {totalQuestions}
                </p>
                <p dangerouslySetInnerHTML={{__html: question}}></p>
                <div>
                    {answers.map( answer => (
                        <ButtonWrapper 
                        key = {answer}
                        correct={userAnswer?.correctAnswer === answer}
                        userClicked={userAnswer?.answer === answer}>
                                <button disabled={userAnswer ? true : false} value={answer} onClick={callback}>
                                    <span dangerouslySetInnerHTML={{__html: answer}}></span>
                                </button>
                        </ButtonWrapper>
                    ))}
                </div>
            </div>
        </Wrapper>
    );


export default QuestionCardComponent