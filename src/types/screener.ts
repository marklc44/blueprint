import { Prisma } from "@prisma/client"

export interface ScreenerAnswer extends Prisma.JsonObject {
  title: string
  value: number
}

export interface ScreenerQuestion extends Prisma.JsonObject {
  question_id: string
  title: string
}

export interface Section extends Prisma.JsonObject {
  type: string
  title: string
  answers: Array<ScreenerAnswer>
  questions: Array<ScreenerQuestion>
}
export interface Content extends Prisma.JsonObject {
  display_name: string
  sections: Array<Section>
}
export interface ScreenerJson extends Prisma.JsonObject {
  id: string
  name: string
  disorder: string
  full_name: string
  content: Content
}