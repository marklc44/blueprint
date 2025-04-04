import { Prisma } from "@prisma/client"

export interface Section extends Prisma.JsonObject {
  type: string
  title: string
  answers: Array<{
    title: string
    value: number
  }>
  questions: Array<{
    question_id: string
    title: string
  }>
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