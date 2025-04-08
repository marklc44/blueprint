import type { Prisma } from "@prisma/client"

// TODO: find the right Prisma types that cover all this
export interface ScreenerAnswer extends Prisma.JsonObject {
  title: string
  value: number
}

export interface ScreenerQuestion {
  id?: string
  questionId: string
  title: string
  domain?: string
}

export interface Answer extends Prisma.JsonObject {
  title: string
  value: number
}

export interface Section {
  id: string
  type?: string
  title?: string
  answers: Array<Answer>
  questions: Array<ScreenerQuestion>
}

export interface ScreenerJson {
  id: string
  name: string
  disorder: string
  fullName: string
  content: {
    displayName: string
    sections: Section[]
  }
}



// TODO: This should be an aggregate type of the full include tree payload
// but sort of different
export interface ScreenerHack {
  id: string
  name: string
  disorder: string
  fullName: string
  displayName: string
  screenerSections: Array<{
    answers: Array<Answer>
    questions: Array<{
      question: {
        id: string
        title: string
        domain?: {
          id: string
          name: string
          scoringThreshold: number
          level2Assessment: string
        }
      }
    }>
  }>
}

export interface StoreScreenerResponseArgs {
  screenerSectionId: string
  answers: Omit<Prisma.AnswerCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'screenerResponse'>[]
}

// Key checker
export function hasKey<O extends object, K extends keyof O>(obj: O, key: keyof K): key is keyof K {
  return key in obj;
}