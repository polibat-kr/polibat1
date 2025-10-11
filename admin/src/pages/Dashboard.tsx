import React, { useState, useEffect } from 'react';
import { openAdminPage } from '../utils/navigation';
import { 
  Users, 
  FileText, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Monitor,
  Smartphone,
  Tablet,
  BarChart3,
  PieChart
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  ChartDataset,
  ChartData,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

// 탭 인터페이스 정의
interface TabItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Dashboard = () => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '대시보드 - POLIBAT admin';
  }, []);

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState('members');
  
  const [memberPeriod, setMemberPeriod] = useState('일간');
  const [postPeriod, setPostPeriod] = useState('일간');
  const [visitorPeriod, setVisitorPeriod] = useState('일간');
  const [visitorAvgPeriod, setVisitorAvgPeriod] = useState('최근 7일');
  
  // 차트 상태 관리
  const [memberChartType, setMemberChartType] = useState('누적'); // '누적', '변동'
  const [memberChartItems, setMemberChartItems] = useState(['전체회원']);
  const [memberChartPeriod, setMemberChartPeriod] = useState('주간');

  const [postChartType, setPostChartType] = useState('누적'); // '누적', '변동'
  const [postChartItems, setPostChartItems] = useState(['게시글+댓글']);
  const [postChartPeriod, setPostChartPeriod] = useState('주간');
  const [postVariationType, setPostVariationType] = useState('신규'); // '신규', '신고', '숨김', '삭제'
  const [postChartBoard, setPostChartBoard] = useState('전체'); // '전체', '자유게시판', '정치인게시판', '투표'

  const [visitorChartType, setVisitorChartType] = useState('누적'); // '누적', '일평균'
  const [visitorChartItems, setVisitorChartItems] = useState(['전체']);
  const [visitorChartPeriod, setVisitorChartPeriod] = useState('주간');
  const [visitorAvgPeriod2, setVisitorAvgPeriod2] = useState('최근 7일');
  
  const periods = ['일간', '주간', '월간', '연간'];
  const avgPeriods = ['최근 7일', '최근 14일', '최근 30일', '사용자지정'];

  // 통일된 색상 시스템 정의
  const chartColors = [
    { 
      bg: 'rgba(59, 130, 246, 0.1)', 
      border: 'rgb(59, 130, 246)', 
      label: 'bg-blue-100 text-blue-700 border-blue-200' 
    }, // 파란색
    { 
      bg: 'rgba(34, 197, 94, 0.1)', 
      border: 'rgb(34, 197, 94)', 
      label: 'bg-green-100 text-green-700 border-green-200' 
    }, // 초록색
    { 
      bg: 'rgba(147, 51, 234, 0.1)', 
      border: 'rgb(147, 51, 234)', 
      label: 'bg-purple-100 text-purple-700 border-purple-200' 
    }, // 보라색
    { 
      bg: 'rgba(234, 88, 12, 0.1)', 
      border: 'rgb(234, 88, 12)', 
      label: 'bg-orange-100 text-orange-700 border-orange-200' 
    }, // 주황색
    { 
      bg: 'rgba(239, 68, 68, 0.1)', 
      border: 'rgb(239, 68, 68)', 
      label: 'bg-red-100 text-red-700 border-red-200' 
    }, // 빨간색
    { 
      bg: 'rgba(245, 158, 11, 0.1)', 
      border: 'rgb(245, 158, 11)', 
      label: 'bg-yellow-100 text-yellow-700 border-yellow-200' 
    }, // 노란색
    { 
      bg: 'rgba(107, 114, 128, 0.1)', 
      border: 'rgb(107, 114, 128)', 
      label: 'bg-gray-100 text-gray-700 border-gray-200' 
    }, // 회색
  ];

  // 기본 색상 (undefined 방지용)
  const defaultColor = chartColors[6]; // 회색을 기본값으로 사용

  // 회원 차트 색상 매핑
  const getMemberItemColors = (memberChartType: string) => {
    if (memberChartType === '누적') {
      return {
        '전체회원': chartColors[0], // 파란색
        '일반회원': chartColors[1], // 초록색
        '정치인': chartColors[2], // 보라색
        '보좌진': chartColors[3], // 주황색
      };
    } else {
      return {
        '신규회원': chartColors[1], // 초록색
        '탈퇴회원': chartColors[6], // 회색
        '정지회원': chartColors[5], // 노란색
        '강퇴회원': chartColors[4], // 빨간색
      };
    }
  };

  // 게시글 차트 색상 매핑
  const getPostItemColors = () => {
    return {
      '게시글+댓글': chartColors[0], // 파란색
      '게시글': chartColors[1], // 초록색
      '댓글': chartColors[2], // 보라색
    };
  };

  // 방문자 차트 색상 매핑
  const getVisitorItemColors = () => {
    return {
      '전체': chartColors[0], // 파란색
      'PC접속': chartColors[1], // 초록색
      '모바일접속': chartColors[2], // 보라색
      '태블릿접속': chartColors[5], // 노란색
      '기타': chartColors[6], // 회색
      '로그인': chartColors[3], // 주황색
      '미로그인': chartColors[4], // 빨간색
    };
  };

  // 샘플 시계열 데이터 생성
  const generateTimeSeriesData = (period: string, count: number, baseValue: number, variation: number = 0.2) => {
    const labels = [];
    const data = [];
    const now = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now);
      
      switch (period) {
        case '일간':
          date.setDate(date.getDate() - i);
          labels.push(date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }));
          break;
        case '주간':
          date.setDate(date.getDate() - (i * 7));
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          labels.push(`${weekStart.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} 주`);
          break;
        case '월간':
          date.setMonth(date.getMonth() - i);
          labels.push(date.toLocaleDateString('ko-KR', { year: '2-digit', month: 'short' }));
          break;
        case '연간':
          date.setFullYear(date.getFullYear() - i);
          labels.push(date.toLocaleDateString('ko-KR', { year: 'numeric' }));
          break;
        default:
          date.setDate(date.getDate() - i);
          labels.push(date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }));
      }
      
      const randomVariation = (Math.random() - 0.5) * variation * baseValue;
      const trendFactor = 1 + (Math.random() - 0.5) * 0.1; // 미세한 증감 트렌드
      data.push(Math.max(0, Math.round(baseValue * trendFactor + randomVariation)));
    }
    
    return { labels, data };
  };

  // 탭 데이터 정의
  const tabs: TabItem[] = [
    { id: 'members', name: '회원현황', icon: Users },
    { id: 'posts', name: '게시글현황', icon: FileText },
    { id: 'visitors', name: '방문자현황', icon: Eye }
  ];

  // 기간에 따른 배수 설정 (일간 대비)
  const periodMultiplier = {
    '일간': 1,
    '주간': 7,
    '월간': 30,
    '연간': 365
  };

  // 회원 통계 데이터 생성 함수
  const getMemberStats = (period: string) => {
    const multiplier = periodMultiplier[period as keyof typeof periodMultiplier];
    
    // 기본 일간 데이터
    const dailyBase = {
      total: { current: 10245, change: 15 },
      normal: { current: 7156, change: 12 },
      politician: { current: 2089, change: 2 },
      politicianDetail: { current: 1545, change: 1 },
      assistant: { current: 544, change: 1 }
    };

    // 변동값은 기간에 따라 증가
    const changeMultiplier = period === '일간' ? 1 : 
                            period === '주간' ? 5 : 
                            period === '월간' ? 20 : 50;

    return {
      total: { 
        current: dailyBase.total.current, 
        change: Math.round(dailyBase.total.change * changeMultiplier)
      },
      normal: { 
        current: dailyBase.normal.current, 
        change: Math.round(dailyBase.normal.change * changeMultiplier)
      },
      politician: { 
        current: dailyBase.politician.current, 
        change: Math.round(dailyBase.politician.change * changeMultiplier)
      },
      politicianDetail: { 
        current: dailyBase.politicianDetail.current, 
        change: Math.round(dailyBase.politicianDetail.change * changeMultiplier)
      },
      assistant: { 
        current: dailyBase.assistant.current, 
        change: Math.round(dailyBase.assistant.change * changeMultiplier)
      }
    };
  };

  // 회원 변동 상세 데이터 생성 함수
  const getMemberDetails = (period: string) => {
    const multiplier = periodMultiplier[period as keyof typeof periodMultiplier];
    
    // 기본 일간 데이터
    const dailyBase = {
      new: { total: 15, normal: 12, politician: 2, politicianDetail: 1, assistant: 1 },
      withdrawal: { total: 3, normal: 3, politician: 0, politicianDetail: 0, assistant: 0 },
      suspended: { total: 2, normal: 2, politician: 0, politicianDetail: 0, assistant: 0 },
      banned: { total: 1, normal: 1, politician: 0, politicianDetail: 0, assistant: 0 }
    };

    // 기간에 따른 실제적인 증가
    const realMultiplier = period === '일간' ? 1 : 
                          period === '주간' ? 6 : 
                          period === '월간' ? 25 : 280;

    const result = {
      new: {
        total: Math.round(dailyBase.new.total * realMultiplier),
        normal: Math.round(dailyBase.new.normal * realMultiplier),
        politician: Math.round(dailyBase.new.politician * realMultiplier * 0.8),
        politicianDetail: Math.round(dailyBase.new.politicianDetail * realMultiplier * 0.7),
        assistant: Math.round(dailyBase.new.assistant * realMultiplier * 0.7)
      },
      withdrawal: {
        total: Math.round(dailyBase.withdrawal.total * realMultiplier * 0.9),
        normal: Math.round(dailyBase.withdrawal.normal * realMultiplier * 0.9),
        politician: Math.round(dailyBase.withdrawal.politician * realMultiplier),
        politicianDetail: 0,
        assistant: period === '연간' ? 1 : 0
      },
      suspended: {
        total: Math.round(dailyBase.suspended.total * realMultiplier * 0.8),
        normal: Math.round(dailyBase.suspended.normal * realMultiplier * 0.8),
        politician: period === '월간' || period === '연간' ? 1 : 0,
        politicianDetail: 0,
        assistant: 0
      },
      banned: {
        total: Math.round(dailyBase.banned.total * realMultiplier * 0.5),
        normal: Math.round(dailyBase.banned.normal * realMultiplier * 0.5),
        politician: 0,
        politicianDetail: 0,
        assistant: 0
      }
    };

    return result;
  };

  // 게시글 통계 데이터 생성 함수
  const getPostStats = (period: string) => {
    // 기간에 따른 실제적인 변동값
    const changeMultiplier = period === '일간' ? 1 : 
                            period === '주간' ? 7 : 
                            period === '월간' ? 30 : 365;

    // 각 게시판별 기본 일간 변동값
    const dailyChanges = {
      freeBoard: 8,        // 자유게시판 일간 신규 게시글
      polibatBoard: 2,     // 정치인게시판 일간 신규 게시글
      votes: 0.5,          // 투표 일간 신규 (2일에 1개)
      freeBoardComments: 80,    // 자유게시판 일간 신규 댓글
      polibatBoardComments: 10, // 정치인게시판 일간 신규 댓글
      voteComments: 5            // 투표 일간 신규 댓글
    };

    // 기간별 변동값 계산
    const freeChange = Math.round(dailyChanges.freeBoard * changeMultiplier);
    const polibatChange = Math.round(dailyChanges.polibatBoard * changeMultiplier);
    const voteChange = Math.round(dailyChanges.votes * changeMultiplier);
    const freeCommentsChange = Math.round(dailyChanges.freeBoardComments * changeMultiplier);
    const polibatCommentsChange = Math.round(dailyChanges.polibatBoardComments * changeMultiplier);
    const voteCommentsChange = Math.round(dailyChanges.voteComments * changeMultiplier);

    return {
      totalPosts: { current: 1010, change: freeChange + polibatChange + voteChange },
      freeBoard: { current: 510, change: freeChange },
      polibatBoard: { current: 490, change: polibatChange },
      votes: { current: 10, change: voteChange },
      totalComments: { current: 10100, change: freeCommentsChange + polibatCommentsChange + voteCommentsChange },
      freeBoardComments: { current: 5100, change: freeCommentsChange },
      polibatBoardComments: { current: 4900, change: polibatCommentsChange },
      voteComments: { current: 100, change: voteCommentsChange },
      combined: { current: 11110, change: (freeChange + polibatChange + voteChange) + (freeCommentsChange + polibatCommentsChange + voteCommentsChange) },
      freeBoardCombined: { current: 5610, change: freeChange + freeCommentsChange },
      polibatBoardCombined: { current: 5390, change: polibatChange + polibatCommentsChange },
      voteCombined: { current: 110, change: voteChange + voteCommentsChange }
    };
  };

  // 게시글 변동 상세 데이터 생성 함수
  const getPostDetails = (period: string) => {
    const multiplier = period === '일간' ? 1 : 
                      period === '주간' ? 7 : 
                      period === '월간' ? 30 : 365;

    return {
      newPosts: { total: Math.round(10 * multiplier), free: Math.round(8 * multiplier), polibat: Math.round(2 * multiplier), vote: Math.round(0.5 * multiplier) },
      newComments: { total: Math.round(95 * multiplier), free: Math.round(80 * multiplier), polibat: Math.round(10 * multiplier), vote: Math.round(5 * multiplier) },
      newCombined: { total: Math.round(105 * multiplier), free: Math.round(88 * multiplier), polibat: Math.round(12 * multiplier), vote: Math.round(5.5 * multiplier) },
      reportedPosts: { total: Math.round(1 * multiplier * 0.1), free: Math.round(1 * multiplier * 0.1), polibat: 0, vote: 0 },
      reportedComments: { total: Math.round(2 * multiplier * 0.1), free: Math.round(2 * multiplier * 0.1), polibat: 0, vote: 0 },
      reportedCombined: { total: Math.round(3 * multiplier * 0.1), free: Math.round(3 * multiplier * 0.1), polibat: 0, vote: 0 },
      hiddenPosts: { total: Math.round(0.5 * multiplier * 0.5), free: Math.round(0.5 * multiplier * 0.5), polibat: 0, vote: 0 },
      hiddenComments: { total: Math.round(1 * multiplier * 0.5), free: Math.round(1 * multiplier * 0.5), polibat: 0, vote: 0 },
      hiddenCombined: { total: Math.round(1.5 * multiplier * 0.5), free: Math.round(1.5 * multiplier * 0.5), polibat: 0, vote: 0 },
      deletedPosts: { total: Math.round(0.2 * multiplier * 0.3), free: Math.round(0.2 * multiplier * 0.3), polibat: 0, vote: 0 },
      deletedComments: { total: Math.round(0.5 * multiplier * 0.3), free: Math.round(0.5 * multiplier * 0.3), polibat: 0, vote: 0 },
      deletedCombined: { total: Math.round(0.7 * multiplier * 0.3), free: Math.round(0.7 * multiplier * 0.3), polibat: 0, vote: 0 }
    };
  };

  // 방문자 통계 데이터 생성 함수
  const getVisitorStats = (period: string) => {
    const changeMultiplier = period === '일간' ? 1 : 
                            period === '주간' ? 7 : 
                            period === '월간' ? 30 : 365;

    // 일간 방문자 변동
    const dailyChanges = {
      pc: 15,
      mobile: 25,
      tablet: 2,
      other: 0.3,
      loggedIn: 12,
      guest: 30
    };

    const pcChange = Math.round(dailyChanges.pc * changeMultiplier);
    const mobileChange = Math.round(dailyChanges.mobile * changeMultiplier);
    const tabletChange = Math.round(dailyChanges.tablet * changeMultiplier);
    const otherChange = Math.round(dailyChanges.other * changeMultiplier);
    const totalChange = pcChange + mobileChange + tabletChange + otherChange;

    return {
      total: { current: 1234, change: totalChange },
      pc: { current: 500, change: pcChange },
      mobile: { current: 700, change: mobileChange },
      tablet: { current: 30, change: tabletChange },
      other: { current: 4, change: otherChange },
      loggedIn: { current: 456, change: Math.round(dailyChanges.loggedIn * changeMultiplier) },
      guest: { current: 778, change: Math.round(dailyChanges.guest * changeMultiplier) }
    };
  };

  // 방문자 평균 데이터 생성 함수
  const getVisitorAvgStats = (avgPeriod: string) => {
    const baseMultiplier = avgPeriod === '최근 7일' ? 1 : 
                           avgPeriod === '최근 14일' ? 1.1 : 
                           avgPeriod === '최근 30일' ? 1.2 : 1.3;

    return {
      total: Math.round(40 * baseMultiplier),
      pc: Math.round(15 * baseMultiplier),
      mobile: Math.round(20 * baseMultiplier),
      tablet: Math.round(3 * baseMultiplier),
      other: Math.round(2 * baseMultiplier),
      loggedIn: Math.round(12 * baseMultiplier),
      guest: Math.round(28 * baseMultiplier)
    };
  };

  // 회원 차트 데이터 생성
  const getMemberChartData = (): ChartData<'line'> => {
    const count = memberChartPeriod === '일간' ? 30 : memberChartPeriod === '주간' ? 12 : memberChartPeriod === '월간' ? 12 : 5;
    const { labels } = generateTimeSeriesData(memberChartPeriod, count, 100);
    
    const datasets: ChartDataset<'line'>[] = [];
    const colorMapping = getMemberItemColors(memberChartType);

    memberChartItems.forEach((item) => {
      let baseValue = 100;
      
      if (memberChartType === '누적') {
        // 기간에 따라 누적값 조정
        const currentStats = getMemberStats('일간');
        switch (item) {
          case '전체회원': baseValue = currentStats.total.current; break;
          case '일반회원': baseValue = currentStats.normal.current; break;
          case '정치인': baseValue = currentStats.politicianDetail.current; break;
          case '보좌진': baseValue = currentStats.assistant.current; break;
        }
      } else {
        // 변동 차트: 기간에 따른 실제적인 변동값
        const periodScale = memberChartPeriod === '일간' ? 1 : 
                           memberChartPeriod === '주간' ? 6 :
                           memberChartPeriod === '월간' ? 25 : 280;
        
        switch (item) {
          case '신규회원': baseValue = 15 * periodScale; break;
          case '탈퇴회원': baseValue = 3 * periodScale * 0.9; break;
          case '정지회원': baseValue = 2 * periodScale * 0.8; break;
          case '강퇴회원': baseValue = 1 * periodScale * 0.5; break;
        }
      }

      const { data } = generateTimeSeriesData(memberChartPeriod, count, baseValue, 0.3);
      const itemColors = colorMapping[item as keyof typeof colorMapping] || defaultColor;
      
      datasets.push({
        label: item,
        data,
        borderColor: itemColors.border,
        backgroundColor: itemColors.bg,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      });
    });

    return { labels, datasets };
  };

  // 게시글 차트 데이터 생성
  const getPostChartData = (): ChartData<'line'> => {
    const count = postChartPeriod === '일간' ? 30 : postChartPeriod === '주간' ? 12 : postChartPeriod === '월간' ? 12 : 5;
    const { labels } = generateTimeSeriesData(postChartPeriod, count, 100);
    
    const datasets: ChartDataset<'line'>[] = [];
    const colorMapping = getPostItemColors();

    postChartItems.forEach((item) => {
      let baseValue = 100;
      
      if (postChartType === '누적') {
        // 게시판별 누적값 조정
        if (postChartBoard === '전체') {
          switch (item) {
            case '게시글': baseValue = 1010; break;
            case '댓글': baseValue = 10100; break;
            case '게시글+댓글': baseValue = 11110; break;
          }
        } else if (postChartBoard === '자유게시판') {
          switch (item) {
            case '게시글': baseValue = 510; break;
            case '댓글': baseValue = 5100; break;
            case '게시글+댓글': baseValue = 5610; break;
          }
        } else if (postChartBoard === '정치인게시판') {
          switch (item) {
            case '게시글': baseValue = 490; break;
            case '댓글': baseValue = 4900; break;
            case '게시글+댓글': baseValue = 5390; break;
          }
        } else if (postChartBoard === '투표') {
          switch (item) {
            case '게시글': baseValue = 10; break;
            case '댓글': baseValue = 100; break;
            case '게시글+댓글': baseValue = 110; break;
          }
        }
      } else {
        // 변동 차트: 기간에 따른 실제적인 변동값
        const periodScale = postChartPeriod === '일간' ? 1 : 
                           postChartPeriod === '주간' ? 7 :
                           postChartPeriod === '월간' ? 30 : 365;
        
        if (postChartBoard === '전체') {
          switch (item) {
            case '게시글': 
              if (postVariationType === '신규') baseValue = 10 * periodScale;
              else if (postVariationType === '신고') baseValue = 1 * periodScale * 0.1;
              else if (postVariationType === '숨김') baseValue = 0.5 * periodScale * 0.5;
              else baseValue = 0.2 * periodScale * 0.3; // 삭제
              break;
            case '댓글': 
              if (postVariationType === '신규') baseValue = 95 * periodScale;
              else if (postVariationType === '신고') baseValue = 2 * periodScale * 0.1;
              else if (postVariationType === '숨김') baseValue = 1 * periodScale * 0.5;
              else baseValue = 0.5 * periodScale * 0.3; // 삭제
              break;
            case '게시글+댓글': 
              if (postVariationType === '신규') baseValue = 105 * periodScale;
              else if (postVariationType === '신고') baseValue = 3 * periodScale * 0.1;
              else if (postVariationType === '숨김') baseValue = 1.5 * periodScale * 0.5;
              else baseValue = 0.7 * periodScale * 0.3; // 삭제
              break;
          }
        } // 다른 게시판들도 비슷하게 처리...
      }

      const { data } = generateTimeSeriesData(postChartPeriod, count, baseValue, 0.4);
      const itemColors = colorMapping[item as keyof typeof colorMapping] || defaultColor;
      
      datasets.push({
        label: item,
        data,
        borderColor: itemColors.border,
        backgroundColor: itemColors.bg,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      });
    });

    return { labels, datasets };
  };

  // 방문자 차트 데이터 생성
  const getVisitorChartData = (): ChartData<'line'> => {
    let count = 30;
    let period = '일간';
    
    if (visitorChartType === '누적') {
      count = visitorChartPeriod === '일간' ? 30 : visitorChartPeriod === '주간' ? 12 : visitorChartPeriod === '월간' ? 12 : 5;
      period = visitorChartPeriod;
    } else {
      count = visitorAvgPeriod2 === '최근 7일' ? 7 : visitorAvgPeriod2 === '최근 14일' ? 14 : visitorAvgPeriod2 === '최근 30일' ? 30 : 30;
      period = '일간'; // 일평균은 항상 일간 단위로 표시
    }
    
    const { labels } = generateTimeSeriesData(period, count, 100);
    
    const datasets: ChartDataset<'line'>[] = [];
    const colorMapping = getVisitorItemColors();

    visitorChartItems.forEach((item) => {
      let baseValue = 100;
      
      switch (item) {
        case '전체': baseValue = visitorChartType === '누적' ? 1200 : 40; break;
        case 'PC접속': baseValue = visitorChartType === '누적' ? 500 : 15; break;
        case '모바일접속': baseValue = visitorChartType === '누적' ? 600 : 20; break;
        case '태블릿접속': baseValue = visitorChartType === '누적' ? 80 : 3; break;
        case '기타': baseValue = visitorChartType === '누적' ? 20 : 1; break;
        case '로그인': baseValue = visitorChartType === '누적' ? 400 : 15; break;
        case '미로그인': baseValue = visitorChartType === '누적' ? 800 : 25; break;
      }

      const { data } = generateTimeSeriesData(period, count, baseValue, 0.3);
      const itemColors = colorMapping[item as keyof typeof colorMapping] || defaultColor;
      
      datasets.push({
        label: item,
        data,
        borderColor: itemColors.border,
        backgroundColor: itemColors.bg,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      });
    });

    return { labels, datasets };
  };

  const getLineChartOptions = (chartData: ChartData<'line'>) => {
    // Y축 최대값 계산 - 선택된 데이터셋만 고려
    let maxValue = 0;
    chartData.datasets.forEach(dataset => {
      const dataMax = Math.max(...(dataset.data as number[]));
      maxValue = Math.max(maxValue, dataMax);
    });
    
    // 적절한 상한선 설정 (높이 줄임)
    const yMax = Math.ceil(maxValue * 1.2);
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: false,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: '기간'
          }
        },
        y: {
          beginAtZero: true,
          max: yMax,
          title: {
            display: true,
            text: '수량'
          }
        },
      },
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
    };
  };

  // 실제 사용할 데이터
  const memberStats = getMemberStats(memberPeriod);
  const memberDetails = getMemberDetails(memberPeriod);
  const postStats = getPostStats(postPeriod);
  const postDetails = getPostDetails(postPeriod);
  const visitorStats = getVisitorStats(visitorPeriod);
  const visitorAvgStats = getVisitorAvgStats(visitorAvgPeriod);

  // 회원 클릭 핸들러
  const handleMemberClick = (type: string, value: number) => {
    if (value === 0) return;
    
    // 타입 매핑: 대시보드 타입 → 페이지 필터값
    const typeMapping: { [key: string]: string } = {
      'total': '전체',
      'normal': '일반회원',
      'politician-detail': '정치인',
      'assistant': '보좌진',
      // 추가 타입들
      '승인-normal': '일반회원',
      '승인-politician': '정치인',
      '승인-assistant': '보좌진',
      '승인대기-normal': '일반회원',
      '승인대기-politician': '정치인',
      '승인대기-assistant': '보좌진'
    };
    
    const mappedType = typeMapping[type] || '전체';
    
    // 상태 조건 처리
    let statusParam = '';
    if (type.includes('승인대기')) {
      statusParam = '&status=승인대기';
    } else if (type.includes('승인') && !type.includes('승인대기')) {
      statusParam = '&status=승인';
    }
    
    // 정치인이면 정치인 페이지로, 아니면 전체회원 페이지로
    const targetPage = (mappedType === '정치인' || mappedType === '보좌진') ? '/members/politicians' : '/members/all';
    
    openAdminPage(`${targetPage}?type=${mappedType}${statusParam}`);
  };

  // 회원상태 변동이력 클릭 핸들러
  const handleMemberStatusHistoryClick = (memberType: string, period: string) => {
    // 회원유형 매핑
    const typeMapping: { [key: string]: string } = {
      'total': '전체',
      'normal': '일반회원',
      'politician': '정치인',
      'assistant': '보좌진'
    };
    
    const mappedType = typeMapping[memberType] || '전체';

    // URL 생성: 대시보드에서 회원상태 변경이력으로 이동
    const url = `/members/status-history?memberType=${mappedType}&period=${period}&changeDate=${new Date().toISOString().split('T')[0]}`;
    openAdminPage(url);
  };

  // 회원 상태 변경 현황 클릭 핸들러 (신규, 탈퇴, 정지, 강퇴)
  const handleStatusChangeClick = (statusType: string, memberType: string) => {
    // 상태 타입 매핑
    const statusMapping: { [key: string]: string } = {
      '신규회원': '신규가입',  // 신규회원은 beforeStatus가 null(신규가입)인 경우
      '탈퇴회원': '탈퇴',
      '정지회원': '정지',
      '강퇴회원': '강퇴'
    };

    // 회원유형 매핑  
    const typeMapping: { [key: string]: string } = {
      'total': '전체',
      'normal': '일반회원',
      'politician': '정치인',
      'assistant': '보좌진'
    };

    const mappedStatus = statusMapping[statusType] || '';
    const mappedType = typeMapping[memberType] || '전체';

    // URL 생성: 회원상태 변경이력 페이지로 이동
    let url = `/members/status-history?memberType=${mappedType}&period=${memberPeriod}`;
    
    if (statusType === '신규회원') {
      // 신규회원의 경우 beforeStatus를 신규가입으로 필터링
      url += `&beforeStatus=신규가입`;
    } else {
      // 다른 경우는 afterStatus로 필터링
      url += `&afterStatus=${mappedStatus}`;
    }
    
    openAdminPage(url);
  };

  // 게시글 클릭 핸들러 (요구사항 1: 조회기준과 게시판명칭을 파라미터로 전달)
  const handlePostClick = (contentType: string, boardType: string, value: number, period?: string) => {
    if (value === 0) return;
    
    // 게시판 타입 매핑: 대시보드 타입 → 페이지 필터값
    const boardMapping: { [key: string]: string } = {
      'total': '전체',
      'free': '자유게시판',
      'polibat': '정치인게시판',
      'vote': '투표'
    };
    
    const mappedBoard = boardMapping[boardType] || '전체';
    const targetPage = contentType.includes('comment') ? 'comments' : 'posts';
    
    // 파라미터 구성
    const params = new URLSearchParams();
    params.append('board', mappedBoard);
    if (period) {
      params.append('period', period);
    }
    
    openAdminPage(`/${targetPage}?${params.toString()}`);
  };

  // 게시글 상세 클릭 핸들러 (요구사항 2: 조회기준, 게시판이름, 상태값을 파라미터로 전달)
  const handleDetailClick = (category: string, type: string, boardType: string, value: number, period?: string) => {
    if (value === 0) return;
    
    // 게시판 타입 매핑
    const boardMapping: { [key: string]: string } = {
      'total': '전체',
      'free': '자유게시판',
      'polibat': '정치인게시판',
      'vote': '투표'
    };
    
    const mappedBoard = boardMapping[boardType] || '전체';
    
    // 파라미터 구성
    const params = new URLSearchParams();
    params.append('board', mappedBoard);
    if (period) {
      params.append('period', period);
    }
    
    // category와 type에 따라 다른 페이지로 이동
    if (type === '신고') {
      // 신고된 게시글/댓글은 신고이력 페이지로 이동
      params.append('status', '신고');
      
      if (category === 'combined') {
        // 게시글+댓글 신고 시 신고이력 페이지로 (전체 콘텐츠)
        openAdminPage(`/reports-history?${params.toString()}`);
      } else {
        const contentTypeParam = category === 'posts' ? '게시글' : '댓글';
        params.append('contentType', contentTypeParam);
        openAdminPage(`/reports-history?${params.toString()}`);
      }
    } else {
      // 신규, 숨김, 삭제는 각각의 관리 페이지로 이동
      const statusMapping: { [key: string]: string } = {
        '신규': '게시',
        '숨김': '숨김',
        '삭제': '삭제'
      };
      
      const mappedStatus = statusMapping[type] || '게시';
      params.append('status', mappedStatus);
      
      if (category === 'combined') {
        // 게시글+댓글 클릭 시 게시글 페이지로 이동 (댓글은 게시글 관리에서 함께 볼 수 있음)
        openAdminPage(`/posts?${params.toString()}`);
      } else {
        const targetPage = category === 'posts' ? 'posts' : 'comments';
        openAdminPage(`/${targetPage}?${params.toString()}`);
      }
    }
  };

  const StatCard = ({ title, value, change, onClick, onChangeClick, icon: Icon, color = 'blue', period, memberType }: any) => (
    <div 
      className={`bg-white p-4 rounded-lg shadow border-l-4 hover:shadow-md transition-shadow ${
        color === 'blue' ? 'border-blue-500' : 
        color === 'green' ? 'border-green-500' : 
        color === 'purple' ? 'border-purple-500' : 'border-gray-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p 
            className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600"
            onClick={onClick}
          >
            {value.toLocaleString()}명
          </p>
          {change !== 0 && (
            <div className={`flex items-center mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span 
                className="text-sm font-medium cursor-pointer hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onChangeClick) {
                    onChangeClick(memberType, period);
                  }
                }}
              >
                {change > 0 ? '+' : ''}{change}명 
                <span className="text-xs text-gray-500 ml-1">({period})</span>
              </span>
            </div>
          )}
        </div>
        {Icon && <Icon className={`w-8 h-8 ${color === 'blue' ? 'text-blue-500' : color === 'green' ? 'text-green-500' : color === 'purple' ? 'text-purple-500' : 'text-gray-500'}`} />}
      </div>
    </div>
  );

  const PostStatCard = ({ title, posts, comments, combined, color = 'blue', boardType, period }: any) => (
    <div className={`bg-white p-4 rounded-lg shadow border-l-4 ${
      color === 'blue' ? 'border-blue-500' : 
      color === 'green' ? 'border-green-500' : 
      color === 'purple' ? 'border-purple-500' : 
      color === 'orange' ? 'border-orange-500' : 
      'border-gray-500'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-700">{title}</h4>
        {period && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            period === '일간' ? 'bg-blue-100 text-blue-700' :
            period === '주간' ? 'bg-green-100 text-green-700' :
            period === '월간' ? 'bg-purple-100 text-purple-700' :
            'bg-orange-100 text-orange-700'
          }`}>
            {period}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <div className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">게시글+댓글</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-900 font-bold">
                {combined.current.toLocaleString()}
              </span>
              {combined.change !== 0 && (
                <span 
                  className={`text-sm font-medium ${combined.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {combined.change > 0 ? '+' : ''}{combined.change}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 pl-2">게시글</span>
            <div className="flex items-center space-x-2">
              <button 
                className="text-blue-600 hover:text-blue-800 underline"
                onClick={() => handlePostClick('posts', boardType, posts.current, period)}
              >
                {posts.current.toLocaleString()}
              </button>
              {posts.change !== 0 && (
                <button 
                  className={`text-sm hover:underline cursor-pointer ${posts.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                  onClick={() => handlePostClick('posts', boardType, posts.change, period)}
                >
                  {posts.change > 0 ? '+' : ''}{posts.change}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 pl-2">댓글</span>
            <div className="flex items-center space-x-2">
              <button 
                className="text-blue-600 hover:text-blue-800 underline"
                onClick={() => handlePostClick('comments', boardType, comments.current, period)}
              >
                {comments.current.toLocaleString()}
              </button>
              {comments.change !== 0 && (
                <button 
                  className={`text-sm hover:underline cursor-pointer ${comments.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                  onClick={() => handlePostClick('comments', boardType, comments.change, period)}
                >
                  {comments.change > 0 ? '+' : ''}{comments.change}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* 제목 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="mt-1 text-gray-600">시스템 현황을 한눈에 확인하세요</p>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex space-x-2">
        {tabs.map((tab: TabItem) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <IconComponent className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* 탭 내용 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* 회원현황 탭 */}
        {activeTab === 'members' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">회원현황</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">조회 기준:</span>
                <select 
                  value={memberPeriod}
                  onChange={(e) => setMemberPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                >
                  {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 회원 누적 현황 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">회원 누적 현황</h3>
              </div>
              <div className="space-y-4">
                {/* 전체회원 - 별도로 강조 표시 */}
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                  <StatCard
                    title="전체회원"
                    value={memberStats.total.current}
                    change={memberStats.total.change}
                    onClick={() => handleMemberClick('total', memberStats.total.current)}
                    onChangeClick={handleMemberStatusHistoryClick}
                    icon={Users}
                    color="blue"
                    period={memberPeriod}
                    memberType="total"
                  />
                </div>

                {/* 세부 회원 현황 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    title="일반회원"
                    value={memberStats.normal.current}
                    change={memberStats.normal.change}
                    onClick={() => handleMemberClick('normal', memberStats.normal.current)}
                    onChangeClick={handleMemberStatusHistoryClick}
                    icon={Users}
                    color="green"
                    period={memberPeriod}
                    memberType="normal"
                  />
                  <StatCard
                    title="정치인"
                    value={memberStats.politicianDetail.current}
                    change={memberStats.politicianDetail.change}
                    onClick={() => handleMemberClick('politician-detail', memberStats.politicianDetail.current)}
                    onChangeClick={handleMemberStatusHistoryClick}
                    icon={Users}
                    color="purple"
                    period={memberPeriod}
                    memberType="politician"
                  />
                  <StatCard
                    title="보좌진"
                    value={memberStats.assistant.current}
                    change={memberStats.assistant.change}
                    onClick={() => handleMemberClick('assistant', memberStats.assistant.current)}
                    onChangeClick={handleMemberStatusHistoryClick}
                    icon={Users}
                    color="purple"
                    period={memberPeriod}
                    memberType="assistant"
                  />
                </div>
              </div>
            </div>

            {/* 회원 변동 상세현황 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">회원 상태 변경 현황</h3>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{memberPeriod}</span> 기준 변동 내역
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {[
                  { title: '신규회원', data: memberDetails.new, color: 'green' },
                  { title: '탈퇴회원', data: memberDetails.withdrawal, color: 'gray' },
                  { title: '정지회원', data: memberDetails.suspended, color: 'yellow' },
                  { title: '강퇴회원', data: memberDetails.banned, color: 'red' }
                ].map((item, index) => (
                  <div key={index} className={`bg-white p-4 rounded-lg border-l-4 ${
                    item.color === 'green' ? 'border-green-500' : 
                    item.color === 'yellow' ? 'border-yellow-500' : 
                    item.color === 'red' ? 'border-red-500' : 'border-gray-500'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-700">{item.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        memberPeriod === '일간' ? 'bg-blue-100 text-blue-700' :
                        memberPeriod === '주간' ? 'bg-green-100 text-green-700' :
                        memberPeriod === '월간' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {memberPeriod}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>전체:</span>
                        <button 
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                          onClick={() => handleStatusChangeClick(item.title, 'total')}
                        >
                          {item.data.total}명
                        </button>
                      </div>
                      <div className="flex justify-between">
                        <span>일반회원:</span>
                        <button 
                          className="text-blue-600 hover:text-blue-800 underline"
                          onClick={() => handleStatusChangeClick(item.title, 'normal')}
                        >
                          {item.data.normal}명
                        </button>
                      </div>
                      <div className="flex justify-between">
                        <span>정치인:</span>
                        <button 
                          className="text-blue-600 hover:text-blue-800 underline"
                          onClick={() => handleStatusChangeClick(item.title, 'politician')}
                        >
                          {item.data.politician}명
                        </button>
                      </div>
                      <div className="flex justify-between">
                        <span>보좌진:</span>
                        <button 
                          className="text-blue-600 hover:text-blue-800 underline"
                          onClick={() => handleStatusChangeClick(item.title, 'assistant')}
                        >
                          {item.data.assistant}명
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 회원 현황 차트 - 맨 아래 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center flex-wrap gap-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    회원 현황 추이
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      memberChartType === '누적' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {memberChartType}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      memberChartPeriod === '일간' ? 'bg-blue-100 text-blue-700' :
                      memberChartPeriod === '주간' ? 'bg-green-100 text-green-700' :
                      memberChartPeriod === '월간' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {memberChartPeriod}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <select 
                    value={memberChartType}
                    onChange={(e) => {
                      setMemberChartType(e.target.value);
                      // 차트 타입 변경 시 기본 선택 항목도 변경
                      if (e.target.value === '누적') {
                        setMemberChartItems(['전체회원']);
                      } else {
                        setMemberChartItems(['신규회원']);
                      }
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="누적">누적 현황</option>
                    <option value="변동">변동 현황</option>
                  </select>
                  <select 
                    value={memberChartPeriod}
                    onChange={(e) => setMemberChartPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {periods.map(period => (
                      <option key={period} value={period}>{period}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">표시할 항목 선택:</label>
                <div className="flex flex-wrap gap-2">
                  {(memberChartType === '누적' 
                    ? ['전체회원', '일반회원', '정치인', '보좌진']
                    : ['신규회원', '탈퇴회원', '정지회원', '강퇴회원']
                  ).map((item) => {
                    const colorMapping = getMemberItemColors(memberChartType);
                    const itemColor = colorMapping[item as keyof typeof colorMapping] || defaultColor;
                    return (
                      <label key={item} className={`flex items-center px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        memberChartItems.includes(item) 
                          ? itemColor.label
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <input
                          type="checkbox"
                          checked={memberChartItems.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMemberChartItems([...memberChartItems, item]);
                            } else {
                              setMemberChartItems(memberChartItems.filter(i => i !== item));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium">{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border" style={{ height: '400px' }}>
                {(() => {
                  const chartData = getMemberChartData();
                  return <Line data={chartData} options={getLineChartOptions(chartData)} />;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* 게시글현황 탭 */}
        {activeTab === 'posts' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">게시글현황</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">조회 기준:</span>
                <select 
                  value={postPeriod}
                  onChange={(e) => setPostPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                >
                  {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 게시글/댓글 누적 현황 */}
            <div>
              <h3 className="text-lg font-medium mb-4">게시글/댓글 누적 현황</h3>
              <div className="space-y-4">
                {/* 전체 현황 - 강조 표시 */}
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                  <PostStatCard
                    title="전체"
                    posts={postStats.totalPosts}
                    comments={postStats.totalComments}
                    combined={postStats.combined}
                    color="blue"
                    boardType="total"
                    period={postPeriod}
                  />
                </div>

                {/* 세부 게시판 현황 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PostStatCard
                    title="자유게시판"
                    posts={{ current: postStats.freeBoard.current, change: postStats.freeBoard.change }}
                    comments={{ current: postStats.freeBoardComments.current, change: postStats.freeBoardComments.change }}
                    combined={{ current: postStats.freeBoardCombined.current, change: postStats.freeBoardCombined.change }}
                    color="green"
                    boardType="free"
                    period={postPeriod}
                  />
                  <PostStatCard
                    title="정치인게시판"
                    posts={{ current: postStats.polibatBoard.current, change: postStats.polibatBoard.change }}
                    comments={{ current: postStats.polibatBoardComments.current, change: postStats.polibatBoardComments.change }}
                    combined={{ current: postStats.polibatBoardCombined.current, change: postStats.polibatBoardCombined.change }}
                    color="purple"
                    boardType="polibat"
                    period={postPeriod}
                  />
                  <PostStatCard
                    title="투표"
                    posts={{ current: postStats.votes.current, change: postStats.votes.change }}
                    comments={{ current: postStats.voteComments.current, change: postStats.voteComments.change }}
                    combined={{ current: postStats.voteCombined.current, change: postStats.voteCombined.change }}
                    color="orange"
                    boardType="vote"
                    period={postPeriod}
                  />
                </div>
              </div>
            </div>

            {/* 게시글/댓글 변동 상세현황 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium">게시글/댓글 변동 상세현황</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    postPeriod === '일간' ? 'bg-blue-100 text-blue-700' :
                    postPeriod === '주간' ? 'bg-green-100 text-green-700' :
                    postPeriod === '월간' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {postPeriod === '일간' ? '어제 대비' :
                     postPeriod === '주간' ? '지난주 대비' :
                     postPeriod === '월간' ? '지난달 대비' :
                     '작년 대비'} 변동 내역
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {/* 전체 변동 현황 - 강조 표시 */}
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-gray-700 mb-3">전체</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded border">
                      <h5 className="text-sm font-medium text-green-600 mb-2">신규</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>게시글+댓글</span>
                          <span className="font-bold text-gray-900">
                            {postDetails.newCombined.total}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span className="pl-2">게시글</span>
                          <button 
                            className="text-blue-600 hover:text-blue-800 underline"
                            onClick={() => handleDetailClick('posts', '신규', 'total', postDetails.newPosts.total, postPeriod)}
                          >
                            {postDetails.newPosts.total}
                          </button>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span className="pl-2">댓글</span>
                          <button 
                            className="text-blue-600 hover:text-blue-800 underline"
                            onClick={() => handleDetailClick('comments', '신규', 'total', postDetails.newComments.total, postPeriod)}
                          >
                            {postDetails.newComments.total}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <h5 className="text-sm font-medium text-red-600 mb-2">신고</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>게시글+댓글</span>
                          <span className="font-bold text-gray-900">
                            {postDetails.reportedCombined.total}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span className="pl-2">게시글</span>
                          <button 
                            className="text-blue-600 hover:text-blue-800 underline"
                            onClick={() => handleDetailClick('posts', '신고', 'total', postDetails.reportedPosts.total, postPeriod)}
                          >
                            {postDetails.reportedPosts.total}
                          </button>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span className="pl-2">댓글</span>
                          <button 
                            className="text-blue-600 hover:text-blue-800 underline"
                            onClick={() => handleDetailClick('comments', '신고', 'total', postDetails.reportedComments.total, postPeriod)}
                          >
                            {postDetails.reportedComments.total}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <h5 className="text-sm font-medium text-yellow-600 mb-2">숨김</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>게시글+댓글</span>
                          <span className="font-bold text-gray-900">
                            {postDetails.hiddenCombined.total}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span className="pl-2">게시글</span>
                          <button 
                            className="text-blue-600 hover:text-blue-800 underline"
                            onClick={() => handleDetailClick('posts', '숨김', 'total', postDetails.hiddenPosts.total, postPeriod)}
                          >
                            {postDetails.hiddenPosts.total}
                          </button>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span className="pl-2">댓글</span>
                          <button 
                            className="text-blue-600 hover:text-blue-800 underline"
                            onClick={() => handleDetailClick('comments', '숨김', 'total', postDetails.hiddenComments.total, postPeriod)}
                          >
                            {postDetails.hiddenComments.total}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <h5 className="text-sm font-medium text-gray-600 mb-2">삭제</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>게시글+댓글</span>
                          <span className="font-bold text-gray-900">
                            {postDetails.deletedCombined.total}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span className="pl-2">게시글</span>
                          <button 
                            className="text-blue-600 hover:text-blue-800 underline"
                            onClick={() => handleDetailClick('posts', '삭제', 'total', postDetails.deletedPosts.total, postPeriod)}
                          >
                            {postDetails.deletedPosts.total}
                          </button>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span className="pl-2">댓글</span>
                          <button 
                            className="text-blue-600 hover:text-blue-800 underline"
                            onClick={() => handleDetailClick('comments', '삭제', 'total', postDetails.deletedComments.total, postPeriod)}
                          >
                            {postDetails.deletedComments.total}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 게시판별 변동 현황 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-medium text-gray-700 mb-3">자유게시판</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-green-600 font-medium">신규</span>
                            <span className="font-medium text-gray-900">
                              {postDetails.newCombined.free}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">게시글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('posts', '신규', 'free', postDetails.newPosts.free, postPeriod)}
                            >
                              {postDetails.newPosts.free}
                            </button>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">댓글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('comments', '신규', 'free', postDetails.newComments.free, postPeriod)}
                            >
                              {postDetails.newComments.free}
                            </button>
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-yellow-600 font-medium">숨김</span>
                            <span className="font-medium text-gray-900">
                              {postDetails.hiddenCombined.free}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">게시글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('posts', '숨김', 'free', postDetails.hiddenPosts.free, postPeriod)}
                            >
                              {postDetails.hiddenPosts.free}
                            </button>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">댓글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('comments', '숨김', 'free', postDetails.hiddenComments.free, postPeriod)}
                            >
                              {postDetails.hiddenComments.free}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-red-600 font-medium">신고</span>
                            <span className="font-medium text-gray-900">
                              {postDetails.reportedCombined.free}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">게시글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('posts', '신고', 'free', postDetails.reportedPosts.free, postPeriod)}
                            >
                              {postDetails.reportedPosts.free}
                            </button>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">댓글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('comments', '신고', 'free', postDetails.reportedComments.free, postPeriod)}
                            >
                              {postDetails.reportedComments.free}
                            </button>
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600 font-medium">삭제</span>
                            <span className="font-medium text-gray-900">
                              {postDetails.deletedCombined.free}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">게시글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('posts', '삭제', 'free', postDetails.deletedPosts.free, postPeriod)}
                            >
                              {postDetails.deletedPosts.free}
                            </button>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">댓글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('comments', '삭제', 'free', postDetails.deletedComments.free, postPeriod)}
                            >
                              {postDetails.deletedComments.free}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-medium text-gray-700 mb-3">정치인게시판</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-green-600 font-medium">신규</span>
                            <span className="font-medium text-gray-900">
                              {postDetails.newCombined.polibat}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">게시글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('posts', '신규', 'polibat', postDetails.newPosts.polibat, postPeriod)}
                            >
                              {postDetails.newPosts.polibat}
                            </button>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">댓글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('comments', '신규', 'polibat', postDetails.newComments.polibat, postPeriod)}
                            >
                              {postDetails.newComments.polibat}
                            </button>
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-yellow-600 font-medium">숨김</span>
                            <span className="font-medium text-gray-900">
                              {postDetails.hiddenCombined.polibat}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">게시글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('posts', '숨김', 'polibat', postDetails.hiddenPosts.polibat, postPeriod)}
                            >
                              {postDetails.hiddenPosts.polibat}
                            </button>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">댓글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('comments', '숨김', 'polibat', postDetails.hiddenComments.polibat, postPeriod)}
                            >
                              {postDetails.hiddenComments.polibat}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-red-600 font-medium">신고</span>
                            <span className="font-medium text-gray-900">
                              {postDetails.reportedCombined.polibat}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">게시글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('posts', '신고', 'polibat', postDetails.reportedPosts.polibat, postPeriod)}
                            >
                              {postDetails.reportedPosts.polibat}
                            </button>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">댓글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('comments', '신고', 'polibat', postDetails.reportedComments.polibat, postPeriod)}
                            >
                              {postDetails.reportedComments.polibat}
                            </button>
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600 font-medium">삭제</span>
                            <span className="font-medium text-gray-900">
                              {postDetails.deletedCombined.polibat}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">게시글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('posts', '삭제', 'polibat', postDetails.deletedPosts.polibat, postPeriod)}
                            >
                              {postDetails.deletedPosts.polibat}
                            </button>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">댓글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('comments', '삭제', 'polibat', postDetails.deletedComments.polibat, postPeriod)}
                            >
                              {postDetails.deletedComments.polibat}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-medium text-gray-700 mb-3">투표</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-green-600 font-medium">신규</span>
                            <span className="font-medium text-gray-900">
                              {postDetails.newCombined.vote}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">게시글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('posts', '신규', 'vote', postDetails.newPosts.vote, postPeriod)}
                            >
                              {postDetails.newPosts.vote}
                            </button>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">댓글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('comments', '신규', 'vote', postDetails.newComments.vote, postPeriod)}
                            >
                              {postDetails.newComments.vote}
                            </button>
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-yellow-600 font-medium">숨김</span>
                            <span className="font-medium text-gray-900">
                              {postDetails.hiddenCombined.vote}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">게시글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('posts', '숨김', 'vote', postDetails.hiddenPosts.vote, postPeriod)}
                            >
                              {postDetails.hiddenPosts.vote}
                            </button>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">댓글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('comments', '숨김', 'vote', postDetails.hiddenComments.vote, postPeriod)}
                            >
                              {postDetails.hiddenComments.vote}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-red-600 font-medium">신고</span>
                            <span className="font-medium text-gray-900">
                              {postDetails.reportedCombined.vote}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">게시글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('posts', '신고', 'vote', postDetails.reportedPosts.vote, postPeriod)}
                            >
                              {postDetails.reportedPosts.vote}
                            </button>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">댓글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('comments', '신고', 'vote', postDetails.reportedComments.vote, postPeriod)}
                            >
                              {postDetails.reportedComments.vote}
                            </button>
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600 font-medium">삭제</span>
                            <span className="font-medium text-gray-900">
                              {postDetails.deletedCombined.vote}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">게시글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('posts', '삭제', 'vote', postDetails.deletedPosts.vote, postPeriod)}
                            >
                              {postDetails.deletedPosts.vote}
                            </button>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="pl-2">댓글</span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 underline"
                              onClick={() => handleDetailClick('comments', '삭제', 'vote', postDetails.deletedComments.vote, postPeriod)}
                            >
                              {postDetails.deletedComments.vote}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 게시글 현황 차트 - 맨 아래 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center flex-wrap gap-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    게시글 현황 추이
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      postChartType === '누적' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {postChartType}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      postChartPeriod === '일간' ? 'bg-blue-100 text-blue-700' :
                      postChartPeriod === '주간' ? 'bg-green-100 text-green-700' :
                      postChartPeriod === '월간' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {postChartPeriod}
                    </div>
                    {postChartType === '변동' && (
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        postVariationType === '신규' ? 'bg-green-100 text-green-700' :
                        postVariationType === '신고' ? 'bg-red-100 text-red-700' :
                        postVariationType === '숨김' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {postVariationType}
                      </div>
                    )}
                    <div className={`px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700`}>
                      {postChartBoard}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <select 
                    value={postChartType}
                    onChange={(e) => {
                      setPostChartType(e.target.value);
                      // 차트 타입 변경 시 기본 선택 항목도 변경
                      setPostChartItems(['게시글+댓글']);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="누적">누적 현황</option>
                    <option value="변동">변동 현황</option>
                  </select>
                  {postChartType === '변동' && (
                    <select 
                      value={postVariationType}
                      onChange={(e) => setPostVariationType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="신규">신규</option>
                      <option value="신고">신고</option>
                      <option value="숨김">숨김</option>
                      <option value="삭제">삭제</option>
                    </select>
                  )}
                  <select 
                    value={postChartBoard}
                    onChange={(e) => setPostChartBoard(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="전체">전체</option>
                    <option value="자유게시판">자유게시판</option>
                    <option value="정치인게시판">정치인게시판</option>
                    <option value="투표">투표</option>
                  </select>
                  <select 
                    value={postChartPeriod}
                    onChange={(e) => setPostChartPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {periods.map(period => (
                      <option key={period} value={period}>{period}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">표시할 항목 선택:</label>
                <div className="flex flex-wrap gap-2">
                  {['게시글+댓글', '게시글', '댓글'].map((item) => {
                    const colorMapping = getPostItemColors();
                    const itemColor = colorMapping[item as keyof typeof colorMapping] || defaultColor;
                    return (
                      <label key={item} className={`flex items-center px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        postChartItems.includes(item) 
                          ? itemColor.label
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <input
                          type="checkbox"
                          checked={postChartItems.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPostChartItems([...postChartItems, item]);
                            } else {
                              setPostChartItems(postChartItems.filter(i => i !== item));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium">{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border" style={{ height: '400px' }}>
                {(() => {
                  const chartData = getPostChartData();
                  return <Line data={chartData} options={getLineChartOptions(chartData)} />;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* 방문자현황 탭 */}
        {activeTab === 'visitors' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">방문자현황</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">조회 기준:</span>
                <select 
                  value={visitorPeriod}
                  onChange={(e) => setVisitorPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                >
                  {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 누적 방문자수 */}
            <div>
              <h3 className="text-lg font-medium mb-4">누적 방문자수</h3>
              <div className="space-y-4">
                {/* 전체 방문자 - 강조 표시 */}
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">누적 방문자수</p>
                        <p className="text-2xl font-bold text-gray-900">{visitorStats.total.current.toLocaleString()}명</p>
                        {visitorStats.total.change !== 0 && (
                          <div className="flex items-center mt-1 text-green-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">
                              +{visitorStats.total.change}명
                              <span className="text-xs text-gray-500 ml-1">({visitorPeriod})</span>
                            </span>
                          </div>
                        )}
                      </div>
                      <Eye className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                </div>

                {/* 세부 방문자 현황 */}
                <div className="space-y-6">
                  {/* 기기별 현황 */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">기기별 누적 방문자수</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">PC접속</p>
                            <p className="text-xl font-bold text-gray-900">{visitorStats.pc.current.toLocaleString()}명</p>
                            {visitorStats.pc.change !== 0 && (
                              <div className="flex items-center mt-1 text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                <span className="text-xs font-medium">
                                  +{visitorStats.pc.change}명
                                  <span className="text-xs text-gray-500 ml-1">({visitorPeriod})</span>
                                </span>
                              </div>
                            )}
                          </div>
                          <Monitor className="w-6 h-6 text-green-500" />
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">모바일접속</p>
                            <p className="text-xl font-bold text-gray-900">{visitorStats.mobile.current.toLocaleString()}명</p>
                            {visitorStats.mobile.change !== 0 && (
                              <div className="flex items-center mt-1 text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                <span className="text-xs font-medium">
                                  +{visitorStats.mobile.change}명
                                  <span className="text-xs text-gray-500 ml-1">({visitorPeriod})</span>
                                </span>
                              </div>
                            )}
                          </div>
                          <Smartphone className="w-6 h-6 text-purple-500" />
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">태블릿접속</p>
                            <p className="text-xl font-bold text-gray-900">{visitorStats.tablet.current.toLocaleString()}명</p>
                            {visitorStats.tablet.change !== 0 && (
                              <div className="flex items-center mt-1 text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                <span className="text-xs font-medium">
                                  +{visitorStats.tablet.change}명
                                  <span className="text-xs text-gray-500 ml-1">({visitorPeriod})</span>
                                </span>
                              </div>
                            )}
                          </div>
                          <Tablet className="w-6 h-6 text-yellow-500" />
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border-l-4 border-gray-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">기타</p>
                            <p className="text-xl font-bold text-gray-900">{visitorStats.other.current}명</p>
                            {visitorStats.other.change !== 0 && (
                              <div className="flex items-center mt-1 text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                <span className="text-xs font-medium">
                                  +{visitorStats.other.change}명
                                  <span className="text-xs text-gray-500 ml-1">({visitorPeriod})</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 로그인별 현황 */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">로그인별 누적 방문자수</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">로그인</p>
                            <p className="text-xl font-bold text-gray-900">{visitorStats.loggedIn.current.toLocaleString()}명</p>
                            {visitorStats.loggedIn.change !== 0 && (
                              <div className="flex items-center mt-1 text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                <span className="text-xs font-medium">
                                  +{visitorStats.loggedIn.change}명
                                  <span className="text-xs text-gray-500 ml-1">({visitorPeriod})</span>
                                </span>
                              </div>
                            )}
                          </div>
                          <Users className="w-6 h-6 text-blue-500" />
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border-l-4 border-gray-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">미로그인</p>
                            <p className="text-xl font-bold text-gray-900">{visitorStats.guest.current.toLocaleString()}명</p>
                            {visitorStats.guest.change !== 0 && (
                              <div className="flex items-center mt-1 text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                <span className="text-xs font-medium">
                                  +{visitorStats.guest.change}명
                                  <span className="text-xs text-gray-500 ml-1">({visitorPeriod})</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 일평균 방문자수 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium">일평균 방문자수</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    visitorAvgPeriod === '최근 7일' ? 'bg-blue-100 text-blue-700' :
                    visitorAvgPeriod === '최근 14일' ? 'bg-green-100 text-green-700' :
                    visitorAvgPeriod === '최근 30일' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    [{visitorAvgPeriod}] 기준
                  </div>
                </div>
                <select 
                  value={visitorAvgPeriod}
                  onChange={(e) => setVisitorAvgPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {avgPeriods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-4">
                {/* 전체 일평균 - 강조 표시 */}
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-gray-600">[{visitorAvgPeriod}] 일평균 방문자수</p>
                    <p className="text-2xl font-bold text-gray-900">{visitorAvgStats.total}명</p>
                  </div>
                </div>

                {/* 세부 일평균 현황 */}
                <div className="space-y-6">
                  {/* 기기별 현황 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                      <h4 className="text-md font-medium text-gray-700">기기별 일평균 방문자수</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        visitorAvgPeriod === '최근 7일' ? 'bg-blue-100 text-blue-700' :
                        visitorAvgPeriod === '최근 14일' ? 'bg-green-100 text-green-700' :
                        visitorAvgPeriod === '최근 30일' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {visitorAvgPeriod}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-sm font-medium text-gray-600">PC접속</p>
                        <p className="text-xl font-bold text-gray-900">{visitorAvgStats.pc}명</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                        <p className="text-sm font-medium text-gray-600">모바일접속</p>
                        <p className="text-xl font-bold text-gray-900">{visitorAvgStats.mobile}명</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
                        <p className="text-sm font-medium text-gray-600">태블릿접속</p>
                        <p className="text-xl font-bold text-gray-900">{visitorAvgStats.tablet}명</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-l-4 border-gray-500">
                        <p className="text-sm font-medium text-gray-600">기타</p>
                        <p className="text-xl font-bold text-gray-900">{visitorAvgStats.other}명</p>
                      </div>
                    </div>
                  </div>

                  {/* 로그인별 현황 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                      <h4 className="text-md font-medium text-gray-700">로그인별 일평균 방문자수</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        visitorAvgPeriod === '최근 7일' ? 'bg-blue-100 text-blue-700' :
                        visitorAvgPeriod === '최근 14일' ? 'bg-green-100 text-green-700' :
                        visitorAvgPeriod === '최근 30일' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {visitorAvgPeriod}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-600">로그인</p>
                        <p className="text-xl font-bold text-gray-900">{visitorAvgStats.loggedIn}명</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-l-4 border-gray-500">
                        <p className="text-sm font-medium text-gray-600">미로그인</p>
                        <p className="text-xl font-bold text-gray-900">{visitorAvgStats.guest}명</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 방문자 현황 차트 - 맨 아래 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center flex-wrap gap-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    방문자 현황 추이
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      visitorChartType === '누적' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {visitorChartType}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      (visitorChartType === '누적' ? visitorChartPeriod : visitorAvgPeriod2) === '일간' || 
                      (visitorChartType === '누적' ? visitorChartPeriod : visitorAvgPeriod2) === '최근 7일' 
                        ? 'bg-blue-100 text-blue-700' :
                      (visitorChartType === '누적' ? visitorChartPeriod : visitorAvgPeriod2) === '주간' || 
                      (visitorChartType === '누적' ? visitorChartPeriod : visitorAvgPeriod2) === '최근 14일'
                        ? 'bg-green-100 text-green-700' :
                      (visitorChartType === '누적' ? visitorChartPeriod : visitorAvgPeriod2) === '월간' || 
                      (visitorChartType === '누적' ? visitorChartPeriod : visitorAvgPeriod2) === '최근 30일'
                        ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {visitorChartType === '누적' ? visitorChartPeriod : visitorAvgPeriod2}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <select 
                    value={visitorChartType}
                    onChange={(e) => {
                      setVisitorChartType(e.target.value);
                      setVisitorChartItems(['전체']);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="누적">누적 현황</option>
                    <option value="일평균">일평균 현황</option>
                  </select>
                  {visitorChartType === '누적' ? (
                    <select 
                      value={visitorChartPeriod}
                      onChange={(e) => setVisitorChartPeriod(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {periods.map(period => (
                        <option key={period} value={period}>{period}</option>
                      ))}
                    </select>
                  ) : (
                    <select 
                      value={visitorAvgPeriod2}
                      onChange={(e) => setVisitorAvgPeriod2(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {avgPeriods.map(period => (
                        <option key={period} value={period}>{period}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">표시할 항목 선택:</label>
                <div className="flex flex-wrap gap-2">
                  {['전체', 'PC접속', '모바일접속', '태블릿접속', '기타', '로그인', '미로그인'].map((item) => {
                    const colorMapping = getVisitorItemColors();
                    const itemColor = colorMapping[item as keyof typeof colorMapping] || defaultColor;
                    return (
                      <label key={item} className={`flex items-center px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        visitorChartItems.includes(item) 
                          ? itemColor.label
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <input
                          type="checkbox"
                          checked={visitorChartItems.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setVisitorChartItems([...visitorChartItems, item]);
                            } else {
                              setVisitorChartItems(visitorChartItems.filter(i => i !== item));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium">{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border" style={{ height: '400px' }}>
                {(() => {
                  const chartData = getVisitorChartData();
                  return <Line data={chartData} options={getLineChartOptions(chartData)} />;
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 