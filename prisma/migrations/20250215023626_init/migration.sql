-- CreateTable
CREATE TABLE "Applicant" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "exerciseFrequency" VARCHAR(20) NOT NULL,
    "exercisePurpose" TEXT NOT NULL,
    "postureType" VARCHAR(20) NOT NULL,
    "nerveResponse" TEXT NOT NULL,
    "participationIntent" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);
