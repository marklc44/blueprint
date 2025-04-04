import { PrismaClient } from "@prisma/client"
// import { PrismaLibSQL } from "@prisma/adapter-libsql"
// import { createClient } from "@libsql/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaClientSingleton = () => {
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
