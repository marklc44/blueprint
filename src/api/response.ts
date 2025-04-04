import { prisma } from "../db/client"

// TODO: store response
export const storeScreenerResponse = async (response: ScreenerResponse) => {
  return await prisma.screenerResponse.create({
    data: response,
  })
}
// Get domains
export const getDomains = async () => {
  return await prisma.domain.findMany()
}

