import { Member, MemberStatus } from '@prisma/client';
import { AuthRepository } from './auth.repository';
import { PasswordUtil } from '../../shared/utils/password';
import { JwtUtil, TokenPayload } from '../../shared/utils/jwt';
import { ApiError } from '../../shared/middleware/error-handler';
import { ERROR_CODES } from '../../shared/utils/error-codes';
import { redisClient } from '../../core/redis';
import {
  SignupRequestDto,
  SignupResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
  CurrentUserResponseDto,
} from './auth.dto';

/**
 * Auth Service
 * 인증 비즈니스 로직 처리
 */
export class AuthService {
  /**
   * 회원가입
   */
  static async signup(data: SignupRequestDto): Promise<SignupResponseDto> {
    // 1. 이메일 중복 확인
    const emailExists = await AuthRepository.isEmailExists(data.email);
    if (emailExists) {
      throw new ApiError(409, '이미 사용 중인 이메일입니다.', ERROR_CODES.EMAIL_ALREADY_EXISTS);
    }

    // 2. 닉네임 중복 확인
    const nicknameExists = await AuthRepository.isNicknameExists(data.nickname);
    if (nicknameExists) {
      throw new ApiError(409, '이미 사용 중인 닉네임입니다.', ERROR_CODES.NICKNAME_ALREADY_EXISTS);
    }

    // 3. 비밀번호 강도 검증
    const passwordValidation = PasswordUtil.validateStrength(data.password);
    if (!passwordValidation.isValid) {
      throw new ApiError(400, passwordValidation.errors[0], ERROR_CODES.INVALID_PASSWORD);
    }

    // 4. 일반적인 비밀번호 패턴 확인
    if (PasswordUtil.isCommonPassword(data.password)) {
      throw new ApiError(400, '너무 흔한 비밀번호입니다. 다른 비밀번호를 사용해주세요.', ERROR_CODES.WEAK_PASSWORD);
    }

    // 5. 비밀번호 해싱
    const passwordHash = await PasswordUtil.hash(data.password);

    // 6. 회원 상태 결정
    // - 일반회원, 관리자: 자동 승인
    // - 정치인/보좌관: 승인 대기
    const status: MemberStatus =
      data.memberType === 'NORMAL' || data.memberType === 'ADMIN' ? 'APPROVED' : 'PENDING';

    // 7. 회원 생성
    const member = await AuthRepository.createMember({
      email: data.email,
      passwordHash,
      nickname: data.nickname,
      memberType: data.memberType,
      status,
      politicianType: data.politicianType,
      politicianName: data.politicianName,
      party: data.party,
      district: data.district,
    });

    // 8. 응답 생성
    return {
      userId: member.id,
      memberId: member.memberId,
      email: member.email,
      nickname: member.nickname,
      memberType: member.memberType,
      status: member.status,
      message:
        status === 'PENDING'
          ? '회원가입이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다.'
          : '회원가입이 완료되었습니다.',
    };
  }

  /**
   * 로그인
   */
  static async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    // 1. 이메일로 회원 조회
    const member = await AuthRepository.findByEmail(data.email);
    if (!member) {
      throw new ApiError(401, '이메일 또는 비밀번호가 올바르지 않습니다.', ERROR_CODES.INVALID_CREDENTIALS);
    }

    // 2. 비밀번호 검증
    const isPasswordValid = await PasswordUtil.verify(data.password, member.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, '이메일 또는 비밀번호가 올바르지 않습니다.', ERROR_CODES.INVALID_CREDENTIALS);
    }

    // 3. 회원 상태 확인
    this.validateMemberStatus(member);

    // 4. 최근 로그인 시간 업데이트
    await AuthRepository.updateLastLogin(member.id);

    // 5. JWT 토큰 생성
    const tokenPayload: TokenPayload = {
      userId: member.id,
      memberId: member.memberId,
      email: member.email,
      memberType: member.memberType,
      status: member.status,
    };

    const accessToken = JwtUtil.generateAccessToken(tokenPayload);
    const refreshToken = JwtUtil.generateRefreshToken(tokenPayload);

    // 6. Redis에 Refresh Token 저장 (7일)
    if (redisClient.isReady()) {
      try {
        await redisClient.saveRefreshToken(member.id, refreshToken, 7 * 24 * 60 * 60);
      } catch (error) {
        console.error('❌ Redis Refresh Token 저장 실패:', error);
        // Redis 저장 실패는 로그인을 막지 않음 (옵션)
      }
    }

    // 7. 응답 생성
    return {
      user: {
        userId: member.id,
        memberId: member.memberId,
        email: member.email,
        nickname: member.nickname,
        memberType: member.memberType,
        status: member.status,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '15m',
      },
    };
  }

  /**
   * 토큰 갱신
   */
  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
    // 1. Refresh Token 검증
    let payload: TokenPayload;
    try {
      payload = JwtUtil.verifyRefreshToken(refreshToken);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'REFRESH_TOKEN_EXPIRED') {
          throw new ApiError(401, 'Refresh Token이 만료되었습니다. 다시 로그인해주세요.', ERROR_CODES.REFRESH_TOKEN_EXPIRED);
        }
        if (error.message === 'REFRESH_TOKEN_INVALID') {
          throw new ApiError(401, '유효하지 않은 Refresh Token입니다.', ERROR_CODES.REFRESH_TOKEN_INVALID);
        }
      }
      throw new ApiError(401, 'Token 검증에 실패했습니다.', ERROR_CODES.TOKEN_VERIFICATION_FAILED);
    }

    // 2. Redis에서 Refresh Token 검증 (옵션)
    if (redisClient.isReady()) {
      try {
        const isValid = await redisClient.validateRefreshToken(payload.userId, refreshToken);
        if (!isValid) {
          throw new ApiError(401, '유효하지 않은 Refresh Token입니다.', ERROR_CODES.REFRESH_TOKEN_INVALID);
        }
      } catch (error) {
        console.error('❌ Redis Refresh Token 검증 실패:', error);
        // Redis 검증 실패 시 JWT 검증만으로 진행
      }
    }

    // 3. 회원 조회
    const member = await AuthRepository.findByUserId(payload.userId);
    if (!member) {
      throw new ApiError(404, '회원을 찾을 수 없습니다.', ERROR_CODES.MEMBER_NOT_FOUND);
    }

    // 3. 회원 상태 확인
    this.validateMemberStatus(member);

    // 4. 새 토큰 생성
    const newTokenPayload: TokenPayload = {
      userId: member.id,
      memberId: member.memberId,
      email: member.email,
      memberType: member.memberType,
      status: member.status,
    };

    const newAccessToken = JwtUtil.generateAccessToken(newTokenPayload);
    const newRefreshToken = JwtUtil.generateRefreshToken(newTokenPayload);

    // 5. Redis에 새로운 Refresh Token 저장
    if (redisClient.isReady()) {
      try {
        await redisClient.saveRefreshToken(member.id, newRefreshToken, 7 * 24 * 60 * 60);
      } catch (error) {
        console.error('❌ Redis Refresh Token 저장 실패:', error);
      }
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: '15m',
    };
  }

  /**
   * 로그아웃
   */
  static async logout(userId: string): Promise<void> {
    // Redis에서 Refresh Token 삭제
    if (redisClient.isReady()) {
      try {
        await redisClient.deleteRefreshToken(userId);
      } catch (error) {
        console.error('❌ Redis Refresh Token 삭제 실패:', error);
        throw new ApiError(500, '로그아웃 처리 중 오류가 발생했습니다.', ERROR_CODES.INTERNAL_SERVER_ERROR);
      }
    }
  }

  /**
   * 현재 사용자 정보 조회
   */
  static async getCurrentUser(userId: string): Promise<CurrentUserResponseDto> {
    const member = await AuthRepository.findByUserId(userId);
    if (!member) {
      throw new ApiError(404, '회원을 찾을 수 없습니다.', ERROR_CODES.MEMBER_NOT_FOUND);
    }

    const response: CurrentUserResponseDto = {
      userId: member.id,
      memberId: member.memberId,
      email: member.email,
      nickname: member.nickname,
      memberType: member.memberType,
      status: member.status,
      createdAt: member.createdAt,
      lastLoginAt: member.lastLoginAt,
    };

    // 정치인 정보 추가
    if (member.memberType === 'POLITICIAN' || member.memberType === 'ASSISTANT') {
      response.politicianInfo = {
        politicianType: member.politicianType!,
        politicianName: member.politicianName,
        party: member.party,
        district: member.district,
      };
    }

    return response;
  }

  /**
   * 비밀번호 변경
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // 1. 회원 조회
    const member = await AuthRepository.findByUserId(userId);
    if (!member) {
      throw new ApiError(404, '회원을 찾을 수 없습니다.', ERROR_CODES.MEMBER_NOT_FOUND);
    }

    // 2. 현재 비밀번호 검증
    const isPasswordValid = await PasswordUtil.verify(currentPassword, member.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, '현재 비밀번호가 올바르지 않습니다.', ERROR_CODES.INVALID_PASSWORD);
    }

    // 3. 새 비밀번호 강도 검증
    const passwordValidation = PasswordUtil.validateStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new ApiError(400, passwordValidation.errors[0], ERROR_CODES.INVALID_PASSWORD);
    }

    // 4. 새 비밀번호 해싱 및 업데이트
    const newPasswordHash = await PasswordUtil.hash(newPassword);
    await AuthRepository.updatePassword(userId, newPasswordHash);
  }

  /**
   * 회원 상태 검증 (로그인 가능 여부)
   */
  private static validateMemberStatus(member: Member): void {
    switch (member.status) {
      case 'PENDING':
        throw new ApiError(403, '관리자 승인 대기 중입니다. 승인 후 로그인이 가능합니다.', ERROR_CODES.MEMBER_PENDING);
      case 'WITHDRAWN':
        throw new ApiError(403, '탈퇴한 회원입니다.', ERROR_CODES.MEMBER_WITHDRAWN);
      case 'SUSPENDED':
        throw new ApiError(403, '정지된 회원입니다. 관리자에게 문의하세요.', ERROR_CODES.MEMBER_SUSPENDED);
      case 'BANNED':
        throw new ApiError(403, '영구 정지된 회원입니다.', ERROR_CODES.MEMBER_BANNED);
      case 'APPROVED':
        // 정상 상태
        break;
      default:
        throw new ApiError(500, '알 수 없는 회원 상태입니다.', ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
  }
}
