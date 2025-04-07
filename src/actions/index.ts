import { storeScreenerResponse } from "@/api/response"
import { getScreenerByName } from "@/api/screener"
import { transformScreener } from "@/utils/transformScreener"

export const getScreenerPage = async (name: string) => {
  const screener = await getScreenerByName(name)

  return transformScreener(screener)
}

export const submitScreenerResponse = async (response: ScreenerResponse) => {
  try {
    const res = await fetch('/api/responses', {
      method: 'POST',
      body: JSON.stringify(response),
    })
  } catch (error) {
    console.error(error)
  }
}

