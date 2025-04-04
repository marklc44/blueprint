import { prisma } from "@/db/client"

export const getAllScreeners = async () => {
  return await prisma.screener.findMany()
}
      
// Get screener by name
// this could be more generalized to pass in more query where params
export const getScreenerByName = async (name: string) => {
  // Screener includes related questions with domain mapping
  return await prisma.screener.findUnique({
    where: { name },
    include: {
      questions: true,
    },
  })
}

