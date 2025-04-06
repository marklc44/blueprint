import { prisma } from "@/db/client"

export const getAllScreeners = async () => {
  return await prisma.screener.findMany({
    include: {
      screenerSections: true,
    }
  })
}
      
// Get screener by name
// this could be more generalized to pass in more query where params
export const getScreenerByName = async (name: string) => {
  // Screener includes related questions with domain mapping
  console.log('name: ', name)
  const screener = await prisma.screener.findUnique({
    where: { name },
    include: {
      screenerSections: {
        include: {
          questions: true,
        },
      },
    },
  })
  console.log('screener: ', screener)
  // build screenerJson from response
  const { id, name: screenerName, disorder, fullName, displayName } = screener
  const formattedScreener = {
    id,
    name: screenerName,
    disorder,
    fullName,
    content: {
      displayName,
      sections: screener?.screenerSections,
    },
  }
  console.log('formattedScreener: ', formattedScreener)
  return formattedScreener
}

