--
-- PostgreSQL database dump
--

\restrict LRQex9pbtYoB8OZzz0Qv6wGTIuFGbcRoP4338I3T1GhNhE6pYSduUANG2HJsVza

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: ActionType; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."ActionType" AS ENUM (
    'HIDE',
    'DELETE',
    'RESTORE'
);


ALTER TYPE public."ActionType" OWNER TO polibat;

--
-- Name: BoardType; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."BoardType" AS ENUM (
    'FREE',
    'POLITICIAN',
    'VOTE'
);


ALTER TYPE public."BoardType" OWNER TO polibat;

--
-- Name: CommentStatus; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."CommentStatus" AS ENUM (
    'PUBLISHED',
    'HIDDEN',
    'DELETED'
);


ALTER TYPE public."CommentStatus" OWNER TO polibat;

--
-- Name: MemberStatus; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."MemberStatus" AS ENUM (
    'APPROVED',
    'PENDING',
    'WITHDRAWN',
    'SUSPENDED',
    'BANNED'
);


ALTER TYPE public."MemberStatus" OWNER TO polibat;

--
-- Name: MemberType; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."MemberType" AS ENUM (
    'NORMAL',
    'POLITICIAN',
    'ASSISTANT',
    'ADMIN'
);


ALTER TYPE public."MemberType" OWNER TO polibat;

--
-- Name: NoticeCategory; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."NoticeCategory" AS ENUM (
    'GUIDE',
    'UPDATE',
    'COMMUNICATION',
    'EXTERNAL'
);


ALTER TYPE public."NoticeCategory" OWNER TO polibat;

--
-- Name: PolicyTarget; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."PolicyTarget" AS ENUM (
    'ALL',
    'ALL_MEMBERS',
    'NORMAL_MEMBERS',
    'POLITICIAN_MEMBERS'
);


ALTER TYPE public."PolicyTarget" OWNER TO polibat;

--
-- Name: PoliticianType; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."PoliticianType" AS ENUM (
    'NATIONAL_ASSEMBLY',
    'LOCAL_GOVERNMENT',
    'PRESIDENTIAL'
);


ALTER TYPE public."PoliticianType" OWNER TO polibat;

--
-- Name: PopupPosition; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."PopupPosition" AS ENUM (
    'CENTER',
    'TOP_LEFT',
    'TOP_RIGHT',
    'BOTTOM_LEFT',
    'BOTTOM_RIGHT'
);


ALTER TYPE public."PopupPosition" OWNER TO polibat;

--
-- Name: PostStatus; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."PostStatus" AS ENUM (
    'PUBLISHED',
    'PINNED',
    'HIDDEN',
    'DELETED'
);


ALTER TYPE public."PostStatus" OWNER TO polibat;

--
-- Name: ReactionTargetType; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."ReactionTargetType" AS ENUM (
    'POST',
    'COMMENT'
);


ALTER TYPE public."ReactionTargetType" OWNER TO polibat;

--
-- Name: ReactionType; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."ReactionType" AS ENUM (
    'LIKE',
    'DISLIKE'
);


ALTER TYPE public."ReactionType" OWNER TO polibat;

--
-- Name: ReportStatus; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."ReportStatus" AS ENUM (
    'PENDING',
    'REVIEWING',
    'RESOLVED',
    'REJECTED',
    'DEFERRED'
);


ALTER TYPE public."ReportStatus" OWNER TO polibat;

--
-- Name: ReportTargetType; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."ReportTargetType" AS ENUM (
    'POST',
    'COMMENT'
);


ALTER TYPE public."ReportTargetType" OWNER TO polibat;

--
-- Name: SuggestionStatus; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."SuggestionStatus" AS ENUM (
    'PENDING',
    'REVIEWING',
    'RESOLVED',
    'REJECTED',
    'DEFERRED'
);


ALTER TYPE public."SuggestionStatus" OWNER TO polibat;

--
-- Name: SuggestionType; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."SuggestionType" AS ENUM (
    'FEATURE',
    'COMPLAINT',
    'VOTE_PROPOSAL'
);


ALTER TYPE public."SuggestionType" OWNER TO polibat;

--
-- Name: VoteStatus; Type: TYPE; Schema: public; Owner: polibat
--

CREATE TYPE public."VoteStatus" AS ENUM (
    'ACTIVE',
    'CLOSED',
    'SCHEDULED'
);


ALTER TYPE public."VoteStatus" OWNER TO polibat;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: banners; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.banners (
    id text NOT NULL,
    "bannerId" text NOT NULL,
    title text NOT NULL,
    "imageUrl" text NOT NULL,
    "linkUrl" text NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.banners OWNER TO polibat;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.comments (
    id text NOT NULL,
    "commentId" text NOT NULL,
    "postId" text NOT NULL,
    "authorId" text NOT NULL,
    content text NOT NULL,
    status public."CommentStatus" DEFAULT 'PUBLISHED'::public."CommentStatus" NOT NULL,
    "likeCount" integer DEFAULT 0 NOT NULL,
    "dislikeCount" integer DEFAULT 0 NOT NULL,
    "reportCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.comments OWNER TO polibat;

--
-- Name: member_status_history; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.member_status_history (
    id text NOT NULL,
    "memberId" text NOT NULL,
    "fromStatus" public."MemberStatus" NOT NULL,
    "toStatus" public."MemberStatus" NOT NULL,
    reason text,
    "changedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.member_status_history OWNER TO polibat;

--
-- Name: members; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.members (
    id text NOT NULL,
    "memberId" text NOT NULL,
    "memberType" public."MemberType" NOT NULL,
    status public."MemberStatus" DEFAULT 'APPROVED'::public."MemberStatus" NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    nickname text NOT NULL,
    phone text,
    "profileImage" text,
    "politicianType" public."PoliticianType",
    "politicianName" text,
    party text,
    district text,
    "verificationDoc" text,
    "emailNotification" boolean DEFAULT true NOT NULL,
    "smsNotification" boolean DEFAULT false NOT NULL,
    "pushNotification" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.members OWNER TO polibat;

--
-- Name: notices; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.notices (
    id text NOT NULL,
    "noticeId" text NOT NULL,
    category public."NoticeCategory" NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "isPinned" boolean DEFAULT false NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.notices OWNER TO polibat;

--
-- Name: policy_contents; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.policy_contents (
    id text NOT NULL,
    "templateVersionId" text NOT NULL,
    target public."PolicyTarget" NOT NULL,
    content text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.policy_contents OWNER TO polibat;

--
-- Name: policy_templates; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.policy_templates (
    id text NOT NULL,
    "templateId" text NOT NULL,
    "versionId" text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.policy_templates OWNER TO polibat;

--
-- Name: popups; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.popups (
    id text NOT NULL,
    "popupId" text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "imageUrl" text,
    "linkUrl" text,
    "position" public."PopupPosition" DEFAULT 'CENTER'::public."PopupPosition" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.popups OWNER TO polibat;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.posts (
    id text NOT NULL,
    "postId" text NOT NULL,
    "boardType" public."BoardType" NOT NULL,
    status public."PostStatus" DEFAULT 'PUBLISHED'::public."PostStatus" NOT NULL,
    "authorId" text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    images text[],
    attachments text[],
    "viewCount" integer DEFAULT 0 NOT NULL,
    "likeCount" integer DEFAULT 0 NOT NULL,
    "dislikeCount" integer DEFAULT 0 NOT NULL,
    "commentCount" integer DEFAULT 0 NOT NULL,
    "reportCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.posts OWNER TO polibat;

--
-- Name: reactions; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.reactions (
    id text NOT NULL,
    "userId" text NOT NULL,
    "targetType" public."ReactionTargetType" NOT NULL,
    "postId" text,
    "commentId" text,
    "reactionType" public."ReactionType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.reactions OWNER TO polibat;

--
-- Name: reports; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.reports (
    id text NOT NULL,
    "reportId" text NOT NULL,
    "reporterId" text NOT NULL,
    "reportedUserId" text NOT NULL,
    "targetType" public."ReportTargetType" NOT NULL,
    "postId" text,
    "commentId" text,
    reason text NOT NULL,
    status public."ReportStatus" DEFAULT 'PENDING'::public."ReportStatus" NOT NULL,
    "adminId" text,
    "adminNote" text,
    "actionType" public."ActionType",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "processedAt" timestamp(3) without time zone
);


ALTER TABLE public.reports OWNER TO polibat;

--
-- Name: suggestions; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.suggestions (
    id text NOT NULL,
    "suggestionId" text NOT NULL,
    "suggestionType" public."SuggestionType" NOT NULL,
    status public."SuggestionStatus" DEFAULT 'PENDING'::public."SuggestionStatus" NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "adminReply" text,
    "adminId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "repliedAt" timestamp(3) without time zone
);


ALTER TABLE public.suggestions OWNER TO polibat;

--
-- Name: vote_options; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.vote_options (
    id text NOT NULL,
    "optionId" text NOT NULL,
    "voteId" text NOT NULL,
    content text NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "voteCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.vote_options OWNER TO polibat;

--
-- Name: vote_participations; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.vote_participations (
    id text NOT NULL,
    "voterId" text NOT NULL,
    "voteId" text NOT NULL,
    "optionId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.vote_participations OWNER TO polibat;

--
-- Name: votes; Type: TABLE; Schema: public; Owner: polibat
--

CREATE TABLE public.votes (
    id text NOT NULL,
    "postId" text NOT NULL,
    status public."VoteStatus" DEFAULT 'ACTIVE'::public."VoteStatus" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "allowMultiple" boolean DEFAULT false NOT NULL,
    "totalVoters" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.votes OWNER TO polibat;

--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.banners (id, "bannerId", title, "imageUrl", "linkUrl", "displayOrder", "startDate", "endDate", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.comments (id, "commentId", "postId", "authorId", content, status, "likeCount", "dislikeCount", "reportCount", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: member_status_history; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.member_status_history (id, "memberId", "fromStatus", "toStatus", reason, "changedBy", "createdAt") FROM stdin;
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.members (id, "memberId", "memberType", status, email, "passwordHash", nickname, phone, "profileImage", "politicianType", "politicianName", party, district, "verificationDoc", "emailNotification", "smsNotification", "pushNotification", "createdAt", "updatedAt", "lastLoginAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: notices; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.notices (id, "noticeId", category, title, content, "isPinned", "viewCount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: policy_contents; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.policy_contents (id, "templateVersionId", target, content, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: policy_templates; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.policy_templates (id, "templateId", "versionId", title, content, "isActive", "createdAt") FROM stdin;
\.


--
-- Data for Name: popups; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.popups (id, "popupId", title, content, "imageUrl", "linkUrl", "position", "startDate", "endDate", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.posts (id, "postId", "boardType", status, "authorId", title, content, images, attachments, "viewCount", "likeCount", "dislikeCount", "commentCount", "reportCount", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: reactions; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.reactions (id, "userId", "targetType", "postId", "commentId", "reactionType", "createdAt") FROM stdin;
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.reports (id, "reportId", "reporterId", "reportedUserId", "targetType", "postId", "commentId", reason, status, "adminId", "adminNote", "actionType", "createdAt", "processedAt") FROM stdin;
\.


--
-- Data for Name: suggestions; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.suggestions (id, "suggestionId", "suggestionType", status, "userId", title, content, "adminReply", "adminId", "createdAt", "repliedAt") FROM stdin;
\.


--
-- Data for Name: vote_options; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.vote_options (id, "optionId", "voteId", content, "displayOrder", "voteCount") FROM stdin;
\.


--
-- Data for Name: vote_participations; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.vote_participations (id, "voterId", "voteId", "optionId", "createdAt") FROM stdin;
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: polibat
--

COPY public.votes (id, "postId", status, "startDate", "endDate", "allowMultiple", "totalVoters") FROM stdin;
\.


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: member_status_history member_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.member_status_history
    ADD CONSTRAINT member_status_history_pkey PRIMARY KEY (id);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: notices notices_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.notices
    ADD CONSTRAINT notices_pkey PRIMARY KEY (id);


--
-- Name: policy_contents policy_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.policy_contents
    ADD CONSTRAINT policy_contents_pkey PRIMARY KEY (id);


--
-- Name: policy_templates policy_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.policy_templates
    ADD CONSTRAINT policy_templates_pkey PRIMARY KEY (id);


--
-- Name: popups popups_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.popups
    ADD CONSTRAINT popups_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: reactions reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_pkey PRIMARY KEY (id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: suggestions suggestions_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.suggestions
    ADD CONSTRAINT suggestions_pkey PRIMARY KEY (id);


--
-- Name: vote_options vote_options_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.vote_options
    ADD CONSTRAINT vote_options_pkey PRIMARY KEY (id);


--
-- Name: vote_participations vote_participations_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.vote_participations
    ADD CONSTRAINT vote_participations_pkey PRIMARY KEY (id);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (id);


--
-- Name: banners_bannerId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "banners_bannerId_key" ON public.banners USING btree ("bannerId");


--
-- Name: banners_displayOrder_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "banners_displayOrder_idx" ON public.banners USING btree ("displayOrder");


--
-- Name: banners_endDate_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "banners_endDate_idx" ON public.banners USING btree ("endDate");


--
-- Name: banners_isActive_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "banners_isActive_idx" ON public.banners USING btree ("isActive");


--
-- Name: banners_startDate_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "banners_startDate_idx" ON public.banners USING btree ("startDate");


--
-- Name: comments_authorId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "comments_authorId_idx" ON public.comments USING btree ("authorId");


--
-- Name: comments_commentId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "comments_commentId_key" ON public.comments USING btree ("commentId");


--
-- Name: comments_createdAt_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "comments_createdAt_idx" ON public.comments USING btree ("createdAt");


--
-- Name: comments_postId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "comments_postId_idx" ON public.comments USING btree ("postId");


--
-- Name: comments_status_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX comments_status_idx ON public.comments USING btree (status);


--
-- Name: member_status_history_createdAt_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "member_status_history_createdAt_idx" ON public.member_status_history USING btree ("createdAt");


--
-- Name: member_status_history_memberId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "member_status_history_memberId_idx" ON public.member_status_history USING btree ("memberId");


--
-- Name: members_createdAt_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "members_createdAt_idx" ON public.members USING btree ("createdAt");


--
-- Name: members_email_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX members_email_idx ON public.members USING btree (email);


--
-- Name: members_email_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX members_email_key ON public.members USING btree (email);


--
-- Name: members_memberId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "members_memberId_key" ON public.members USING btree ("memberId");


--
-- Name: members_memberType_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "members_memberType_idx" ON public.members USING btree ("memberType");


--
-- Name: members_nickname_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX members_nickname_key ON public.members USING btree (nickname);


--
-- Name: members_status_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX members_status_idx ON public.members USING btree (status);


--
-- Name: notices_category_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX notices_category_idx ON public.notices USING btree (category);


--
-- Name: notices_createdAt_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "notices_createdAt_idx" ON public.notices USING btree ("createdAt");


--
-- Name: notices_isPinned_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "notices_isPinned_idx" ON public.notices USING btree ("isPinned");


--
-- Name: notices_noticeId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "notices_noticeId_key" ON public.notices USING btree ("noticeId");


--
-- Name: policy_contents_isActive_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "policy_contents_isActive_idx" ON public.policy_contents USING btree ("isActive");


--
-- Name: policy_contents_target_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX policy_contents_target_idx ON public.policy_contents USING btree (target);


--
-- Name: policy_templates_isActive_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "policy_templates_isActive_idx" ON public.policy_templates USING btree ("isActive");


--
-- Name: policy_templates_templateId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "policy_templates_templateId_idx" ON public.policy_templates USING btree ("templateId");


--
-- Name: policy_templates_templateId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "policy_templates_templateId_key" ON public.policy_templates USING btree ("templateId");


--
-- Name: policy_templates_versionId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "policy_templates_versionId_key" ON public.policy_templates USING btree ("versionId");


--
-- Name: popups_endDate_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "popups_endDate_idx" ON public.popups USING btree ("endDate");


--
-- Name: popups_isActive_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "popups_isActive_idx" ON public.popups USING btree ("isActive");


--
-- Name: popups_popupId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "popups_popupId_key" ON public.popups USING btree ("popupId");


--
-- Name: popups_startDate_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "popups_startDate_idx" ON public.popups USING btree ("startDate");


--
-- Name: posts_authorId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "posts_authorId_idx" ON public.posts USING btree ("authorId");


--
-- Name: posts_boardType_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "posts_boardType_idx" ON public.posts USING btree ("boardType");


--
-- Name: posts_createdAt_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "posts_createdAt_idx" ON public.posts USING btree ("createdAt");


--
-- Name: posts_postId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "posts_postId_key" ON public.posts USING btree ("postId");


--
-- Name: posts_status_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX posts_status_idx ON public.posts USING btree (status);


--
-- Name: reactions_commentId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "reactions_commentId_idx" ON public.reactions USING btree ("commentId");


--
-- Name: reactions_postId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "reactions_postId_idx" ON public.reactions USING btree ("postId");


--
-- Name: reactions_targetType_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "reactions_targetType_idx" ON public.reactions USING btree ("targetType");


--
-- Name: reactions_userId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "reactions_userId_idx" ON public.reactions USING btree ("userId");


--
-- Name: reactions_userId_targetType_postId_commentId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "reactions_userId_targetType_postId_commentId_key" ON public.reactions USING btree ("userId", "targetType", "postId", "commentId");


--
-- Name: reports_createdAt_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "reports_createdAt_idx" ON public.reports USING btree ("createdAt");


--
-- Name: reports_reportId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "reports_reportId_key" ON public.reports USING btree ("reportId");


--
-- Name: reports_reportedUserId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "reports_reportedUserId_idx" ON public.reports USING btree ("reportedUserId");


--
-- Name: reports_reporterId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "reports_reporterId_idx" ON public.reports USING btree ("reporterId");


--
-- Name: reports_status_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX reports_status_idx ON public.reports USING btree (status);


--
-- Name: reports_targetType_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "reports_targetType_idx" ON public.reports USING btree ("targetType");


--
-- Name: suggestions_createdAt_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "suggestions_createdAt_idx" ON public.suggestions USING btree ("createdAt");


--
-- Name: suggestions_status_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX suggestions_status_idx ON public.suggestions USING btree (status);


--
-- Name: suggestions_suggestionId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "suggestions_suggestionId_key" ON public.suggestions USING btree ("suggestionId");


--
-- Name: suggestions_suggestionType_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "suggestions_suggestionType_idx" ON public.suggestions USING btree ("suggestionType");


--
-- Name: suggestions_userId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "suggestions_userId_idx" ON public.suggestions USING btree ("userId");


--
-- Name: vote_options_voteId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "vote_options_voteId_idx" ON public.vote_options USING btree ("voteId");


--
-- Name: vote_participations_voteId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "vote_participations_voteId_idx" ON public.vote_participations USING btree ("voteId");


--
-- Name: vote_participations_voterId_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "vote_participations_voterId_idx" ON public.vote_participations USING btree ("voterId");


--
-- Name: vote_participations_voterId_voteId_optionId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "vote_participations_voterId_voteId_optionId_key" ON public.vote_participations USING btree ("voterId", "voteId", "optionId");


--
-- Name: votes_endDate_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "votes_endDate_idx" ON public.votes USING btree ("endDate");


--
-- Name: votes_postId_key; Type: INDEX; Schema: public; Owner: polibat
--

CREATE UNIQUE INDEX "votes_postId_key" ON public.votes USING btree ("postId");


--
-- Name: votes_startDate_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX "votes_startDate_idx" ON public.votes USING btree ("startDate");


--
-- Name: votes_status_idx; Type: INDEX; Schema: public; Owner: polibat
--

CREATE INDEX votes_status_idx ON public.votes USING btree (status);


--
-- Name: comments comments_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: member_status_history member_status_history_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.member_status_history
    ADD CONSTRAINT "member_status_history_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: policy_contents policy_contents_templateVersionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.policy_contents
    ADD CONSTRAINT "policy_contents_templateVersionId_fkey" FOREIGN KEY ("templateVersionId") REFERENCES public.policy_templates("versionId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: posts posts_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reactions reactions_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT "reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reactions reactions_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT "reactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reactions reactions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reports reports_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "reports_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reports reports_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "reports_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reports reports_reportedUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "reports_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reports reports_reporterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: suggestions suggestions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.suggestions
    ADD CONSTRAINT "suggestions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vote_options vote_options_voteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.vote_options
    ADD CONSTRAINT "vote_options_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES public.votes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vote_participations vote_participations_optionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.vote_participations
    ADD CONSTRAINT "vote_participations_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES public.vote_options(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vote_participations vote_participations_voteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.vote_participations
    ADD CONSTRAINT "vote_participations_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES public.votes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vote_participations vote_participations_voterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.vote_participations
    ADD CONSTRAINT "vote_participations_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: votes votes_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polibat
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT "votes_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict LRQex9pbtYoB8OZzz0Qv6wGTIuFGbcRoP4338I3T1GhNhE6pYSduUANG2HJsVza

