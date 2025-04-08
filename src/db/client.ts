import { PrismaClient } from "@prisma/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"
import { createClient } from "@libsql/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://dev-marklc44.aws-us-west-2.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(turso)

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
