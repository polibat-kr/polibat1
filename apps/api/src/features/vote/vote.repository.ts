import { PrismaClient, Vote, VoteOption, VoteParticipation, Prisma } from '@prisma/client';
import {
  CreateVoteRequestDto,
  UpdateVoteRequestDto,
  ParticipateVoteRequestDto,
} from './vote.dto';

const prisma = new PrismaClient();

/**
 * Vote Repository
 * 투표 데이터베이스 작업
 */
export class VoteRepository {
  /**
   * 투표 생성 (옵션 포함)
   */
  static async createVote(
    postId: string,
    data: CreateVoteRequestDto
  ): Promise<Vote & { options: VoteOption[] }> {
    // postId로 게시글 UUID 조회
    const post = await prisma.post.findUnique({
      where: { postId },
      select: { id: true },
    });

    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    // 이미 투표가 존재하는지 확인 (1:1 관계)
    const existingVote = await prisma.vote.findUnique({
      where: { postId: post.id },
    });

    if (existingVote) {
      throw new Error('이미 투표가 존재하는 게시글입니다.');
    }

    // 트랜잭션으로 투표와 옵션 동시 생성
    const vote = await prisma.$transaction(async (tx) => {
      // 투표 생성
      const newVote = await tx.vote.create({
        data: {
          postId: post.id,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          allowMultiple: data.allowMultiple,
        },
      });

      // 투표 옵션 생성
      const options = await Promise.all(
        data.options.map((option, index) =>
          tx.voteOption.create({
            data: {
              optionId: `Option ${index + 1}`,
              voteId: newVote.id,
              content: option.content,
              displayOrder: option.displayOrder,
            },
          })
        )
      );

      return { ...newVote, options };
    });

    return vote;
  }

  /**
   * 투표 ID로 투표 조회 (옵션 포함)
   */
  static async findVoteById(
    voteId: string
  ): Promise<(Vote & { options: VoteOption[] }) | null> {
    const vote = await prisma.vote.findUnique({
      where: { id: voteId },
      include: {
        options: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    return vote;
  }

  /**
   * 게시글 ID로 투표 조회
   */
  static async findVoteByPostId(
    postId: string
  ): Promise<(Vote & { options: VoteOption[] }) | null> {
    // postId로 게시글 UUID 조회
    const post = await prisma.post.findUnique({
      where: { postId },
      select: { id: true },
    });

    if (!post) {
      return null;
    }

    const vote = await prisma.vote.findUnique({
      where: { postId: post.id },
      include: {
        options: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    return vote;
  }

  /**
   * 투표 수정
   */
  static async updateVote(
    voteId: string,
    data: UpdateVoteRequestDto
  ): Promise<Vote> {
    const updateData: Prisma.VoteUpdateInput = {};

    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }
    if (data.endDate) {
      updateData.endDate = new Date(data.endDate);
    }
    if (data.status) {
      updateData.status = data.status;
    }

    const vote = await prisma.vote.update({
      where: { id: voteId },
      data: updateData,
    });

    return vote;
  }

  /**
   * 투표 삭제
   */
  static async deleteVote(voteId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // 투표 참여 기록 삭제
      await tx.voteParticipation.deleteMany({
        where: { voteId },
      });

      // 투표 옵션 삭제
      await tx.voteOption.deleteMany({
        where: { voteId },
      });

      // 투표 삭제
      await tx.vote.delete({
        where: { id: voteId },
      });
    });
  }

  /**
   * 투표 참여 (복수 선택 지원)
   */
  static async participateVote(
    voteId: string,
    voterId: string,
    optionIds: string[]
  ): Promise<VoteParticipation[]> {
    // 기존 참여 기록 확인
    const existingParticipations = await prisma.voteParticipation.findMany({
      where: {
        voteId,
        voterId,
      },
    });

    // 트랜잭션으로 참여 기록 생성 및 카운트 업데이트
    const participations = await prisma.$transaction(async (tx) => {
      // 기존 참여 기록 삭제
      if (existingParticipations.length > 0) {
        await tx.voteParticipation.deleteMany({
          where: {
            voteId,
            voterId,
          },
        });

        // 기존 옵션들의 카운트 감소
        for (const participation of existingParticipations) {
          await tx.voteOption.update({
            where: { id: participation.optionId },
            data: { voteCount: { decrement: 1 } },
          });
        }

        // 총 투표자 수 감소
        await tx.vote.update({
          where: { id: voteId },
          data: { totalVoters: { decrement: 1 } },
        });
      }

      // 새로운 참여 기록 생성
      const newParticipations = await Promise.all(
        optionIds.map((optionId) =>
          tx.voteParticipation.create({
            data: {
              voteId,
              voterId,
              optionId,
            },
          })
        )
      );

      // 새로운 옵션들의 카운트 증가
      for (const optionId of optionIds) {
        await tx.voteOption.update({
          where: { id: optionId },
          data: { voteCount: { increment: 1 } },
        });
      }

      // 총 투표자 수 증가 (신규 참여인 경우만)
      if (existingParticipations.length === 0) {
        await tx.vote.update({
          where: { id: voteId },
          data: { totalVoters: { increment: 1 } },
        });
      }

      return newParticipations;
    });

    return participations;
  }

  /**
   * 투표 참여 취소
   */
  static async cancelParticipation(voteId: string, voterId: string): Promise<void> {
    const participations = await prisma.voteParticipation.findMany({
      where: {
        voteId,
        voterId,
      },
    });

    if (participations.length === 0) {
      throw new Error('투표 참여 기록을 찾을 수 없습니다.');
    }

    await prisma.$transaction(async (tx) => {
      // 참여 기록 삭제
      await tx.voteParticipation.deleteMany({
        where: {
          voteId,
          voterId,
        },
      });

      // 옵션 카운트 감소
      for (const participation of participations) {
        await tx.voteOption.update({
          where: { id: participation.optionId },
          data: { voteCount: { decrement: 1 } },
        });
      }

      // 총 투표자 수 감소
      await tx.vote.update({
        where: { id: voteId },
        data: { totalVoters: { decrement: 1 } },
      });
    });
  }

  /**
   * 사용자의 투표 참여 여부 조회
   */
  static async findUserParticipation(
    voteId: string,
    voterId: string
  ): Promise<VoteParticipation[]> {
    const participations = await prisma.voteParticipation.findMany({
      where: {
        voteId,
        voterId,
      },
      include: {
        option: true,
      },
    });

    return participations;
  }

  /**
   * 투표 결과 조회 (옵션별 통계)
   */
  static async getVoteResults(
    voteId: string
  ): Promise<Vote & { options: VoteOption[] }> {
    const vote = await prisma.vote.findUnique({
      where: { id: voteId },
      include: {
        options: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!vote) {
      throw new Error('투표를 찾을 수 없습니다.');
    }

    return vote;
  }

  /**
   * 투표 통계 조회
   */
  static async getVoteStats(): Promise<{
    totalVotes: number;
    activeVotes: number;
    closedVotes: number;
    totalParticipants: number;
  }> {
    const [totalVotes, activeVotes, closedVotes, totalParticipants] =
      await Promise.all([
        prisma.vote.count(),
        prisma.vote.count({ where: { status: 'ACTIVE' } }),
        prisma.vote.count({ where: { status: 'CLOSED' } }),
        prisma.voteParticipation.count(),
      ]);

    return {
      totalVotes,
      activeVotes,
      closedVotes,
      totalParticipants,
    };
  }
}
