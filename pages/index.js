import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { motion } from 'framer-motion'

import Widget from "../src/components/Widget";
import QuizContainer from "../src/components/QuizContainer";
import QuizBackground from "../src/components/QuizBackground";
import QuizLogo from "../src/components/QuizLogo";
import Footer from "../src/components/Footer";
import GitHubCorner from "../src/components/GitHubCorner";
import Input from "../src/components/Input";
import Button from "../src/components/Button";
import Link from "../src/components/Link";

import db from "../db.json";

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
          <Widget
          as={motion.section}
          transition={{ duration: 0.3 }}
          variants={{
              show: { opacity: 1 },
              hidden: { opacity: 0 }
          }}
          initial="hidden"
          animate="show"
          >
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
                <Input
                  name="nomeDoUsuario"
                  placeholder="Diz aí seu nome"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />

                <Button type="submit" disabled={name.length === 0}>
                  {name.length === 0 ? "Jogar" : `Jogar como ${name}`}
                </Button>
              </form>
            </Widget.Content>
          </Widget>

          <Widget
          as={motion.section}
          transition={{ delay: 0.1, duration: 0.3 }}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 }
          }}
          initial="hidden"
          animate="show"
          >
            <Widget.Content>
              <h1>Quizes da galera</h1>

              <ul>
              {db.external.map(externalLink => {
                const [projectName, githubUser] = externalLink
                  .replace(/\//g, '')
                  .replace('https:', '')
                  .replace('.vercel.app', '')
                  .split('.')

                return (
                  <li key={externalLink}>
                    <Widget.Topic as={Link} href={`/quiz/${projectName}___${githubUser}?name=${name || 'anônimo'}`}>
                      {`${githubUser}/${projectName}`}
                    </Widget.Topic>
                  </li>
                )
              })}
              </ul>

            </Widget.Content>
          </Widget>
          <Footer 
          as={motion.footer}
          transition={{ delay: 0.2, duration: 0.3 }}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 }
          }}
          initial="hidden"
          animate="show"
          />
        </QuizContainer>
        <GitHubCorner projectUrl="https://github.com/andresribeiro/memes-quiz" />
      </QuizBackground>
    </>
  );
}
