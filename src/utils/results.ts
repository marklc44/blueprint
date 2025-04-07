import { toSnakeCaseLight } from './utils'

export const calculateAssessments = (response: ScreenerResponse, domains: Domain[], questions) => {
  const scores = response.answers.reduce((acc, curr) => {
    console.log('curr: ', curr.value)
    const currDomain = questions?.find((item) => item.questionId === curr.questionId)?.domain
    acc[currDomain] = acc[currDomain] ? acc[currDomain] + curr.value : 0 + curr.value
    return acc
  }, {})

  console.log('scores: ', scores)

  return domains.filter((item) => {
    const snakeCaseName = toSnakeCaseLight(item.name)
    return scores[snakeCaseName] >= item.scoringThreshold
  }).map((item) => {
    return item.level2Assessment
  })
}