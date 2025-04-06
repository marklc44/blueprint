import { Screener } from "@prisma/client"

export const transformScreener = (screener: Screener) => {
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

  return formattedScreener
}