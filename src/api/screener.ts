import { prisma } from "@/db/client"
      
// Get screener by name
export const getScreener = async (name: string) => {
  // Screener includes related questions with domain mapping
  return await prisma.screener.findUnique({
    where: { name },
    include: {
      questions: true,
    },
  })
}

