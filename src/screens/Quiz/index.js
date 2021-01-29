import { useRouter } from "next/router"
import { useState, useEffect } from "react";

import AlternativesForm from "../../components/AlternativesForm";
import Button from "../../components/Button";
import BackLinkArrow from "../../components/BackLinkArrow";
import QuizContainer from "../../components/QuizContainer";
import QuizBackground from "../../components/QuizBackground";
import QuizLogo from "../../components/QuizLogo";
import Widget from "../../components/Widget";

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>Carregando...</Widget.Header>

      <Widget.Content>[Desafio do Loading]</Widget.Content>
    </Widget>
  );
}


function ResultWidget({ name, numberOfCorrets }) {
  return (
    <Widget>
      <Widget.Header>Resultado</Widget.Header>

      <Widget.Content>
        <p>Você acertou {numberOfCorrets} perguntas, {name}!</p>
	    </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({ question, questionIndex, totalQuestions, onSubmit, handleAddResult }) {
  const questionId = `question__${questionIndex}`;
  const [selectedAlternative, setSelectedAlternative] = useState(undefined)
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false)
	const isCorrect = selectedAlternative === question.answer
	const hasAlternativeSelected = selectedAlternative !== undefined

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
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

        <AlternativesForm
          onSubmit={(event) => {
						event.preventDefault();
						
						setIsQuestionSubmited(true)

            setTimeout(() => {
							handleAddResult(isCorrect)
							onSubmit();

							setIsQuestionSubmited(false)
							setSelectedAlternative(undefined)
            }, 3000)
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
						const alternativeId = `alternative__${alternativeIndex}`;
						const selectedAlternativeStatus = isQuestionSubmited && isCorrect
						const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR'
						const isSelected = selectedAlternative === alternativeIndex

            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
								key={alternativeId}
								data-selected={isSelected}
								data-status={isQuestionSubmited && alternativeStatus}
              >
                {alternative}
                <input
                  style={{ display: "none" }}
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                  onChange={() => {
                    setSelectedAlternative(alternativeIndex)
                  }}
                />
              </Widget.Topic>
            );
          })}

          <Button type="submit" disabled={!hasAlternativeSelected}>Confirmar</Button>

          {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você errou!</p>}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: "QUIZ",
  LOADING: "LOADING",
  RESULT: "RESULT",
};

export default function Quiz({ externalQuestions, externalBg }) {
  const router = useRouter()

  const { name }  = router.query

  const totalQuestions = externalQuestions.length;
	const [questionIndex, setQuestionIndex] = useState(0);
	const [results, setResults] = useState(0)
  const question = externalQuestions[questionIndex];

  const [screenState, setScreenState] = useState(screenStates.LOADING);

	function handleAddResult(newResult) {
		if (newResult) {
			setResults(results + 1)
		}
	}

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
    <QuizBackground backgroundImage={externalBg}>
      <QuizContainer>
        <QuizLogo />

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
						onSubmit={handleSubmit}
						handleAddResult={handleAddResult}
          />
        )}

        {screenState === screenStates.RESULT && <ResultWidget name={name} numberOfCorrets={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}
