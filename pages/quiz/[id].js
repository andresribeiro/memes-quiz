import axios from "axios"
import { ThemeProvider } from "styled-components"

import QuizScreen from "../../src/screens/Quiz"

export default function QuizDaGaleraPage({ externalDatabase }) {
  return (
    <ThemeProvider theme={JSON.parse(externalDatabase).theme}>
      <QuizScreen 
        externalQuestions={JSON.parse(externalDatabase).questions}
        externalBg={JSON.parse(externalDatabase).bg}
      />
    </ThemeProvider>
  )
}

export async function getServerSideProps(context) {
  const [projectName, githubUser] = context.query.id.split('___')

  try {
    const response = await axios.get(`https://${projectName}.o${githubUser }.vercel.app/api/db`)

    return {
      props: {
        externalDatabase: JSON.stringify(response.data)
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}