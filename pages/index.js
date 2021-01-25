import styled from "styled-components";
import db from "../db.json";

import Widget from "../src/components/Widget";
import QuizBackground from "../src/components/QuizBackground";
import Footer from "../src/components/Footer";
import GitHubCorner from "../src/components/GitHubCorner";
import { delBasePath } from "next/dist/next-server/lib/router/router";

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
  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <Widget>
          <Widget.Content>
            <Widget.Header>
              <h1>Lorem ipsulum</h1>
            </Widget.Header>

            <p>Lorem ipsulum dolor sit amet...</p>
          </Widget.Content>
        </Widget>

        <Widget>
          <Widget.Content>
            <Widget.Header>
              <h1>Lorem ipsulum</h1>
            </Widget.Header>

            <p>Lorem ipsulum dolor sit amet...</p>
          </Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/andresribeiro" />
    </QuizBackground>
  );
}
