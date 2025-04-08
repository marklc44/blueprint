import { prisma } from "../db/client"
import type { Prisma } from "@prisma/client"
import type { StoreScreenerResponseArgs } from "@/types/screener"

// Store answers
export const storeScreenerResponse = async (response: StoreScreenerResponseArgs) => {
  const createArgs: Prisma.ScreenerResponseCreateArgs = {
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
export const getDomains = async (): Promise<Prisma.DomainGetPayload<object | undefined>[]> => {
  return await prisma.domain.findMany()
}

