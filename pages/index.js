import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import styled from "styled-components";
import db from "../db.json";

import Widget from "../src/components/Widget";
import QuizBackground from "../src/components/QuizBackground";
import QuizLogo from "../src/components/QuizLogo";
import Footer from "../src/components/Footer";
import GitHubCorner from "../src/components/GitHubCorner";

export const QuizContainer = styled.div`
  margin: auto 10%;
  padding-top: 45px;

  width: 100%;
  max-width: 350px;

  @media screen and (max-width: 500px) {
    margin: auto;
    padding: 15px;
  }
`;

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");

  return (
    <>
      <Head>
        <title>Quiz sobre memes</title>
        <meta property="og:image" content={db.bg} />
      </Head>
      <QuizBackground backgroundImage={db.bg}>
        <QuizContainer>
          <QuizLogo />
          <Widget>
            <Widget.Header>
              <h1>Quiz sobre memes</h1>
            </Widget.Header>
            <Widget.Content>
              <form
                onSubmit={(event) => {
                  event.preventDefault();

                  router.push(`/quiz?name=${name}`);
                }}
              >
                <input
                  placeholder="Diz aí seu nome"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />

                <button type="submit" disabled={name.length === 0}>
                  {name.length === 0 ? "Jogar" : `Jogar como ${name}`}
                </button>
              </form>
            </Widget.Content>
          </Widget>

          <Widget>
            <Widget.Content>
              <Widget.Header>
                <h1>Quizes da galera</h1>
              </Widget.Header>

              <p>Lorem ipsulum dolor sit amet...</p>
            </Widget.Content>
          </Widget>
          <Footer />
        </QuizContainer>
        <GitHubCorner projectUrl="https://github.com/andresribeiro" />
      </QuizBackground>
    </>
  );
}
