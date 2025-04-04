export const calculateAssessments = (response: ScreenerResponse, domains: Domain[]) => {
  const scores = response.reduce((acc, curr) => {
    acc[curr.domain] = acc[curr.domain] + curr.value
    return acc
  }, {})

  return domains.filter((item => scores[item.name] >= item.scoringThreshold)).map((item) => {
    return item.level2Assessment
  })
}