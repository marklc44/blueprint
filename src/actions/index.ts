import { storeScreenerResponse, getDomains } from "@/api/response"
import { getScreener } from "@/api/screener"
import { calculateAssessments } from "@/utils/results"

export const fetchScreener = async (name: string) => {
  return await getScreener(name)
}



export const submitScreenerResponse = async (response: ScreenerResponse) => {
  await storeScreenerResponse(response)
  const domains = await getDomains()

  return calculateAssessments(response, domains)
}

