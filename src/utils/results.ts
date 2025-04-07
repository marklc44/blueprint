import { toSnakeCaseLight } from './utils'

export const calculateScores = (response: ScreenerResponse, domains: Domain[], questions) => {
  return response.answers.reduce((acc, curr) => {
    console.log('curr: ', curr.value)
    const currDomain = questions?.find((item) => item.questionId === curr.questionId)?.domain
    acc[currDomain] = acc[currDomain] ? acc[currDomain] + curr.value : 0 + curr.value
    return acc
  }, {})
}

export const calculateAssessments = (response: ScreenerResponse, domains: Domain[], questions) => {
  // calculate scores by domain
  const scores = calculateScores(response, domains, questions)

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