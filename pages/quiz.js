import { useState, useEffect } from "react";

import Button from "../src/components/Button";
import QuizContainer from "../src/components/QuizContainer";
import QuizBackground from "../src/components/QuizBackground";
import QuizLogo from "../src/components/QuizLogo";
import Widget from "../src/components/Widget";

import db from "../db.json";

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>Carregando...</Widget.Header>

      <Widget.Content>[Desafio do Loading]</Widget.Content>
    </Widget>
  );
}

function QuestionWidget({ question, questionIndex, totalQuestions, onSubmit }) {
  const questionId = `question__${questionIndex}`;

  return (
    <Widget>
      <Widget.Header>
        <h3>
          Pergunta {questionIndex + 1} de {totalQuestions}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
        }}
        src={question.image}
      />

      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>

        <form
          onSubmit={(event) => {
            event.preventDefault();

            onSubmit();
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;

            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
                key={alternativeIndex}
              >
                {alternative}
                <input
                  // style={{ display: "none" }}
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                />
              </Widget.Topic>
            );
          })}

          <Button type="submit">Confirmar</Button>
        </form>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: "QUIZ",
  LOADING: "LOADING",
  RESULT: "RESULT",
};

export default function Quiz() {
  const totalQuestions = db.questions.length;
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = db.questions[questionIndex];

  const [screenState, setScreenState] = useState(screenStates.LOADING);

  function handleSubmit() {
    const nextQuestion = questionIndex + 1;

    if (nextQuestion >= totalQuestions) {
      setScreenState(screenStates.RESULT);
    } else {
      setQuestionIndex(nextQuestion);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setScreenState("QUIZ");
    }, 1000);
  }, []);

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmit}
          />
        )}

        {screenState === screenStates.RESULT && (
          <div>Você acertou X questões, parabéns!</div>
        )}
      </QuizContainer>
    </QuizBackground>
  );
}
