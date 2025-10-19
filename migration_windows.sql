-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('NORMAL', 'POLITICIAN', 'ASSISTANT', 'ADMIN');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('APPROVED', 'PENDING', 'WITHDRAWN', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "PoliticianType" AS ENUM ('NATIONAL_ASSEMBLY', 'LOCAL_GOVERNMENT', 'PRESIDENTIAL');

-- CreateEnum
CREATE TYPE "BoardType" AS ENUM ('FREE', 'POLITICIAN', 'VOTE');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PUBLISHED', 'PINNED', 'HIDDEN', 'DELETED');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PUBLISHED', 'HIDDEN', 'DELETED');

-- CreateEnum
CREATE TYPE "VoteStatus" AS ENUM ('ACTIVE', 'CLOSED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- CreateEnum
CREATE TYPE "ReactionTargetType" AS ENUM ('POST', 'COMMENT');

-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('POST', 'COMMENT');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED', 'DEFERRED');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('HIDE', 'DELETE', 'RESTORE');

-- CreateEnum
CREATE TYPE "SuggestionType" AS ENUM ('FEATURE', 'COMPLAINT', 'VOTE_PROPOSAL');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED', 'DEFERRED');

-- CreateEnum
CREATE TYPE "NoticeCategory" AS ENUM ('GUIDE', 'UPDATE', 'COMMUNICATION', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "PopupPosition" AS ENUM ('CENTER', 'TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT');

-- CreateEnum
CREATE TYPE "PolicyTarget" AS ENUM ('ALL', 'ALL_MEMBERS', 'NORMAL_MEMBERS', 'POLITICIAN_MEMBERS');

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "memberType" "MemberType" NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'APPROVED',
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "phone" TEXT,
    "profileImage" TEXT,
    "politicianType" "PoliticianType",
    "politicianName" TEXT,
    "party" TEXT,
    "district" TEXT,
    "verificationDoc" TEXT,
    "emailNotification" BOOLEAN NOT NULL DEFAULT true,
    "smsNotification" BOOLEAN NOT NULL DEFAULT false,
    "pushNotification" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_status_history" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "fromStatus" "MemberStatus" NOT NULL,
    "toStatus" "MemberStatus" NOT NULL,
    "reason" TEXT,
    "changedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "boardType" "BoardType" NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'PUBLISHED',
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "attachments" TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "dislikeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "dislikeCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "status" "VoteStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "allowMultiple" BOOLEAN NOT NULL DEFAULT false,
    "totalVoters" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote_options" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "voteId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "voteCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "vote_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote_participations" (
    "id" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "voteId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vote_participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetType" "ReactionTargetType" NOT NULL,
    "postId" TEXT,
    "commentId" TEXT,
    "reactionType" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportedUserId" TEXT NOT NULL,
    "targetType" "ReportTargetType" NOT NULL,
    "postId" TEXT,
    "commentId" TEXT,
    "reason" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "adminId" TEXT,
    "adminNote" TEXT,
    "actionType" "ActionType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggestions" (
    "id" TEXT NOT NULL,
    "suggestionId" TEXT NOT NULL,
    "suggestionType" "SuggestionType" NOT NULL,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "adminReply" TEXT,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repliedAt" TIMESTAMP(3),

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notices" (
    "id" TEXT NOT NULL,
    "noticeId" TEXT NOT NULL,
    "category" "NoticeCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "popups" (
    "id" TEXT NOT NULL,
    "popupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "linkUrl" TEXT,
    "position" "PopupPosition" NOT NULL DEFAULT 'CENTER',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "popups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "bannerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_templates" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "policy_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_contents" (
    "id" TEXT NOT NULL,
    "templateVersionId" TEXT NOT NULL,
    "target" "PolicyTarget" NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_memberId_key" ON "members"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_nickname_key" ON "members"("nickname");

-- CreateIndex
CREATE INDEX "members_memberType_idx" ON "members"("memberType");

-- CreateIndex
CREATE INDEX "members_status_idx" ON "members"("status");

-- CreateIndex
CREATE INDEX "members_email_idx" ON "members"("email");

-- CreateIndex
CREATE INDEX "members_createdAt_idx" ON "members"("createdAt");

-- CreateIndex
CREATE INDEX "member_status_history_memberId_idx" ON "member_status_history"("memberId");

-- CreateIndex
CREATE INDEX "member_status_history_createdAt_idx" ON "member_status_history"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "posts_postId_key" ON "posts"("postId");

-- CreateIndex
CREATE INDEX "posts_boardType_idx" ON "posts"("boardType");

-- CreateIndex
CREATE INDEX "posts_status_idx" ON "posts"("status");

-- CreateIndex
CREATE INDEX "posts_authorId_idx" ON "posts"("authorId");

-- CreateIndex
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "comments_commentId_key" ON "comments"("commentId");

-- CreateIndex
CREATE INDEX "comments_postId_idx" ON "comments"("postId");

-- CreateIndex
CREATE INDEX "comments_authorId_idx" ON "comments"("authorId");

-- CreateIndex
CREATE INDEX "comments_status_idx" ON "comments"("status");

-- CreateIndex
CREATE INDEX "comments_createdAt_idx" ON "comments"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "votes_postId_key" ON "votes"("postId");

-- CreateIndex
CREATE INDEX "votes_status_idx" ON "votes"("status");

-- CreateIndex
CREATE INDEX "votes_startDate_idx" ON "votes"("startDate");

-- CreateIndex
CREATE INDEX "votes_endDate_idx" ON "votes"("endDate");

-- CreateIndex
CREATE INDEX "vote_options_voteId_idx" ON "vote_options"("voteId");

-- CreateIndex
CREATE INDEX "vote_participations_voteId_idx" ON "vote_participations"("voteId");

-- CreateIndex
CREATE INDEX "vote_participations_voterId_idx" ON "vote_participations"("voterId");

-- CreateIndex
CREATE UNIQUE INDEX "vote_participations_voterId_voteId_optionId_key" ON "vote_participations"("voterId", "voteId", "optionId");

-- CreateIndex
CREATE INDEX "reactions_userId_idx" ON "reactions"("userId");

-- CreateIndex
CREATE INDEX "reactions_targetType_idx" ON "reactions"("targetType");

-- CreateIndex
CREATE INDEX "reactions_postId_idx" ON "reactions"("postId");

-- CreateIndex
CREATE INDEX "reactions_commentId_idx" ON "reactions"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_userId_targetType_postId_commentId_key" ON "reactions"("userId", "targetType", "postId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "reports_reportId_key" ON "reports"("reportId");

-- CreateIndex
CREATE INDEX "reports_reporterId_idx" ON "reports"("reporterId");

-- CreateIndex
CREATE INDEX "reports_reportedUserId_idx" ON "reports"("reportedUserId");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_targetType_idx" ON "reports"("targetType");

-- CreateIndex
CREATE INDEX "reports_createdAt_idx" ON "reports"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "suggestions_suggestionId_key" ON "suggestions"("suggestionId");

-- CreateIndex
CREATE INDEX "suggestions_userId_idx" ON "suggestions"("userId");

-- CreateIndex
CREATE INDEX "suggestions_suggestionType_idx" ON "suggestions"("suggestionType");

-- CreateIndex
CREATE INDEX "suggestions_status_idx" ON "suggestions"("status");

-- CreateIndex
CREATE INDEX "suggestions_createdAt_idx" ON "suggestions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "notices_noticeId_key" ON "notices"("noticeId");

-- CreateIndex
CREATE INDEX "notices_category_idx" ON "notices"("category");

-- CreateIndex
CREATE INDEX "notices_isPinned_idx" ON "notices"("isPinned");

-- CreateIndex
CREATE INDEX "notices_createdAt_idx" ON "notices"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "popups_popupId_key" ON "popups"("popupId");

-- CreateIndex
CREATE INDEX "popups_isActive_idx" ON "popups"("isActive");

-- CreateIndex
CREATE INDEX "popups_startDate_idx" ON "popups"("startDate");

-- CreateIndex
CREATE INDEX "popups_endDate_idx" ON "popups"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "banners_bannerId_key" ON "banners"("bannerId");

-- CreateIndex
CREATE INDEX "banners_isActive_idx" ON "banners"("isActive");

-- CreateIndex
CREATE INDEX "banners_displayOrder_idx" ON "banners"("displayOrder");

-- CreateIndex
CREATE INDEX "banners_startDate_idx" ON "banners"("startDate");

-- CreateIndex
CREATE INDEX "banners_endDate_idx" ON "banners"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "policy_templates_templateId_key" ON "policy_templates"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "policy_templates_versionId_key" ON "policy_templates"("versionId");

-- CreateIndex
CREATE INDEX "policy_templates_templateId_idx" ON "policy_templates"("templateId");

-- CreateIndex
CREATE INDEX "policy_templates_isActive_idx" ON "policy_templates"("isActive");

-- CreateIndex
CREATE INDEX "policy_contents_target_idx" ON "policy_contents"("target");

-- CreateIndex
CREATE INDEX "policy_contents_isActive_idx" ON "policy_contents"("isActive");

-- AddForeignKey
ALTER TABLE "member_status_history" ADD CONSTRAINT "member_status_history_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_options" ADD CONSTRAINT "vote_options_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "votes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_participations" ADD CONSTRAINT "vote_participations_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_participations" ADD CONSTRAINT "vote_participations_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "votes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_participations" ADD CONSTRAINT "vote_participations_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "vote_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_contents" ADD CONSTRAINT "policy_contents_templateVersionId_fkey" FOREIGN KEY ("templateVersionId") REFERENCES "policy_templates"("versionId") ON DELETE CASCADE ON UPDATE CASCADE;

