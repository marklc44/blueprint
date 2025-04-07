import { ScreenerResponseCreateArgs } from './../../node_modules/.prisma/client/index.d'
import { prisma } from "../db/client"

// TODO: store response
export const storeScreenerResponse = async (response: ScreenerResponseCreateArgs) => {
  console.log('request body: ', response)
  const createArgs = {
    data: {
      screenerSectionId: response.screenerSectionId,
      answers: {
        create: response.answers,
      },
    },
  }
  return await prisma.screenerResponse.create(createArgs)
}
// Get domains
export const getDomains = async () => {
  return await prisma.domain.findMany()
}

