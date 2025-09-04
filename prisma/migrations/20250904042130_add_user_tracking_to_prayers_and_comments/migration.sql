-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "public"."Prayer" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Prayer" ADD CONSTRAINT "Prayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
