import { useRouter } from "next/router"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import AlternativesForm from "../../src/components/AlternativesForm";
import BackLinkArrow from "../../src/components/BackLinkArrow";
import Button from "../../src/components/Button";
import QuizContainer from "../../src/components/QuizContainer";
import QuizBackground from "../../src/components/QuizBackground";
import QuizLogo from "../../src/components/QuizLogo";
import Widget from "../../src/components/Widget";

import db from "../../db.json";

const loadingContainer = {
  width: "2rem",
  height: "2rem",
  display: "flex",
  justifyContent: "space-around"
};

const loadingCircle = {
  display: "block",
  width: "0.5rem",
  height: "0.5rem",
  backgroundColor: db.theme.colors.primary,
  borderRadius: "0.25rem"
};

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2
    }
  },
  end: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const loadingCircleVariants = {
  start: {
    y: "50%"
  },
  end: {
    y: "150%"
  }
};

const loadingCircleTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: "easeInOut"
};

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>Carregando...</Widget.Header>

      <Widget.Content>
        <motion.div
          style={loadingContainer}
          variants={loadingContainerVariants}
          initial="start"
          animate="end"
        >
        <motion.span
          style={loadingCircle}
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
        />
        <motion.span
          style={loadingCircle}
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
        />
        <motion.span
          style={loadingCircle}
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
        />
        </motion.div>
      </Widget.Content>
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
            }, 1500)
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

export default function Quiz() {
  const router = useRouter()

  const { name }  = router.query

  const totalQuestions = db.questions.length;
	const [questionIndex, setQuestionIndex] = useState(0);
	const [results, setResults] = useState(0)
	const question = db.questions[questionIndex];

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
						handleAddResult={handleAddResult}
          />
        )}

        {screenState === screenStates.RESULT && <ResultWidget name={name} numberOfCorrets={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}
