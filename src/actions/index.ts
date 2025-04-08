import { getScreenerByName } from "@/api/screener"
import { transformScreener } from "@/utils/transformScreener"
import type { StoreScreenerResponseArgs } from "@/types/screener"

export const getScreenerPage = async (name: string) => {
  try {
    const screener = await getScreenerByName(name)
    if (screener) {
      // @ts-expect-error TODO
      return transformScreener(screener)
    }
    return null
  } catch(error) {
    console.error(error)
    // TODO: might actually want to break build here?
    // Or log and alert
    return null
  }
}

export const submitScreenerResponse = async (response: StoreScreenerResponseArgs) => {
  try {
    const res = await fetch('/api/responses', {
      method: 'POST',
      body: JSON.stringify(response),
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

