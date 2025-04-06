import { storeScreenerResponse, getDomains } from "@/api/response"
import { getScreenerByName } from "@/api/screener"
import { calculateAssessments } from "@/utils/results"
import { transformScreener } from "@/utils/transformScreener"

export const getScreenerPage = async (name: string) => {
  const screener = await getScreenerByName(name)

  return transformScreener(screener)
}

export const submitScreenerResponse = async (response: ScreenerResponse) => {
  await storeScreenerResponse(response)
  const domains = await getDomains()

  return calculateAssessments(response, domains)
}

