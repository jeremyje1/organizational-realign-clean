-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "survey_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "valueInt" INTEGER,
    "valueText" TEXT,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Survey_user_id_idx" ON "Survey"("user_id");

-- CreateIndex
CREATE INDEX "Answer_survey_id_idx" ON "Answer"("survey_id");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
