-- AlterTable
-- Adiciona coluna email ao modelo User
ALTER TABLE "User" ADD COLUMN "email" TEXT;

-- Cria índice único para email
CREATE UNIQUE INDEX "User_email_key" ON "User"("email") WHERE "email" IS NOT NULL;

