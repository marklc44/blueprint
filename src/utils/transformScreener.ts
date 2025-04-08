import { toSnakeCaseLight } from "./utils"
import { ScreenerHack } from "@/types/screener"

export const transformScreener = (screener: ScreenerHack) => {
  const { id, name: screenerName, disorder, fullName, displayName } = screener
  // flatten questions
  const sections = screener?.screenerSections?.map((item) => {
    const questions = item.questions?.map((q) => {
      return {
        questionId: q.question.id,
        title: q.question.title,
        domain: q?.question?.domain?.name && toSnakeCaseLight(q.question.domain.name),
      }
    })
    return {
      ...item,
      questions,
    }
  })
  const formattedScreener = {
    id,
    name: screenerName,
    disorder,
    fullName,
    content: {
      displayName,
      sections: sections,
    },
  }

  // TODO: save the question mapping for the screener somewhere, and return here to have it separate from screener data
  return formattedScreener
}