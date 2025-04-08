import { StoreScreenerResponseArgs, ScreenerQuestion } from '@/types/screener'
import { toSnakeCaseLight } from './utils'
import type { Prisma } from '@prisma/client'

export interface Scores {
  [key: string]: number
}

export const calculateScores = (response: StoreScreenerResponseArgs, questions: ScreenerQuestion[]) => {
  return response.answers.reduce((acc, curr) => {
    const currDomain = questions?.find((item) => item.questionId === curr.questionId)?.domain
    if (typeof currDomain === 'string') {
      acc[currDomain] = acc[currDomain] ? acc[currDomain] + curr.value : 0 + curr.value
    }
    
    return acc
  }, {} as Scores)
}

export const calculateAssessments = (
  response: StoreScreenerResponseArgs,
  domains: Prisma.DomainGetPayload<object>[],
  questions: ScreenerQuestion[]
) => {
  // calculate scores by domain
  const scores = calculateScores(response, questions)

  // create assessments from scores
  const results = domains.filter((item) => {
    const snakeCaseName = toSnakeCaseLight(item.name)
    return scores[snakeCaseName] >= item.scoringThreshold
  }).map((item) => {
    return item.level2Assessment
  })

  // dedup
  return [...new Set(results)]
}