-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAIL');

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "externalId" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "orderId" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "pixQrCode" TEXT NOT NULL,
    "pixQrCodeBase64" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);
