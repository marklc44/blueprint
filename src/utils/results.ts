import { toSnakeCaseLight } from './utils'

export const calculateAssessments = (response: ScreenerResponse, domains: Domain[]) => {
  const scores = response.answers.reduce((acc, curr) => {
    acc[curr.domain] = acc[curr.domain] + curr.value
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