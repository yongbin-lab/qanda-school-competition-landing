import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { StudyDiagnosisData, AIDiagnosisResult } from '../../types';

// OpenAI 클라이언트 초기화 (API 키가 없어도 에러 발생하지 않도록)
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const data: StudyDiagnosisData = await request.json();
    
    // OpenAI API 키가 없으면 즉시 기본 진단 반환
    if (!openai) {
      console.log('OpenAI API 키가 없습니다. 기본 진단을 제공합니다.');
      return NextResponse.json(generateFallbackDiagnosis(data));
    }
    
    // AI 진단 프롬프트 생성
    const prompt = generateDiagnosisPrompt(data);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 경험이 풍부한 학습 전문가이자 교육 컨설턴트입니다. 
          학생들의 학습 현황을 분석하고 맞춤형 솔루션을 제공하는 것이 전문 분야입니다.
          한국의 고등학교 교육 시스템과 대학 입시에 대해 깊이 알고 있으며,
          학생 개개인의 특성에 맞는 구체적이고 실행 가능한 조언을 제공합니다.
          
          응답은 반드시 다음 JSON 형식으로만 제공하세요:
          {
            "overallAssessment": "전체적인 진단 (250자 이내)",
            "strengthsAndWeaknesses": {
              "strengths": ["강점1", "강점2", "강점3"],
              "weaknesses": ["약점1", "약점2", "약점3"]
            },
            "recommendations": {
              "immediate": ["즉시실행1", "즉시실행2", "즉시실행3"],
              "shortTerm": ["단기계획1", "단기계획2", "단기계획3"],
              "longTerm": ["장기목표1", "장기목표2", "장기목표3"]
            },
            "studyPlan": {
              "daily": "일일 학습 계획",
              "weekly": "주별 학습 계획", 
              "monthly": "월별 학습 계획"
            },
            "additionalResources": ["추천자료1", "추천자료2", "추천자료3", "추천자료4"],
            "urgencyLevel": "low|medium|high"
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('AI 응답을 받을 수 없습니다.');
    }

    try {
      const result: AIDiagnosisResult = JSON.parse(aiResponse);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error('AI 응답 JSON 파싱 오류:', parseError);
      // 파싱 실패 시 기본 응답 제공
      return NextResponse.json(generateFallbackDiagnosis(data));
    }

  } catch (error) {
    console.error('AI 진단 오류:', error);
    
    // 오류 발생 시 기본 진단 결과 제공
    const fallbackResult = generateFallbackDiagnosis(await request.json());
    return NextResponse.json(fallbackResult);
  }
}

function generateDiagnosisPrompt(data: StudyDiagnosisData): string {
  const weakSubjectsKr = data.weakSubjects.map(s => getSubjectName(s)).join(', ');
  const strongSubjectsKr = data.strongSubjects.map(s => getSubjectName(s)).join(', ');
  const goalsKr = data.goals.map(g => getGoalName(g)).join(', ');
  const concernsKr = data.mainConcerns.map(c => getConcernName(c)).join(', ');
  
  return `
다음은 고등학교 ${data.grade}학년 학생 "${data.studentName}"님의 학습 진단 정보입니다.

【기본 정보】
- 현재 성적대: ${getGradeLevelName(data.currentGradeLevel)}
- 일일 학습시간: ${data.dailyStudyHours}시간
- 학습 스타일: ${getStudyStyleName(data.studyStyle)}

【과목별 현황】
- 어려워하는 과목: ${weakSubjectsKr || '없음'}
- 잘하는 과목: ${strongSubjectsKr || '없음'}

【목표 및 고민】
- 주요 목표: ${goalsKr || '없음'}
- 주요 고민: ${concernsKr || '없음'}

【상세 상황】
- 현재 학습 상황: ${data.currentSituation || '정보 없음'}
- 이전 노력: ${data.previousEfforts || '정보 없음'}
- 구체적 고민: ${data.specificConcern || '정보 없음'}

이 학생의 현재 상황을 종합적으로 분석하여 맞춤형 학습 진단을 제공해주세요.
특히 다음 사항을 고려해주세요:
1. 학생의 현재 성적대와 목표 간의 격차
2. 약한 과목에 대한 구체적인 학습 전략
3. 학습 시간과 효율성의 균형
4. 고3이라면 입시까지의 시간적 긴박성
5. 학생이 직접 언급한 구체적인 고민사항

실행 가능하고 구체적인 조언을 중심으로 진단해주세요.
`;
}

function generateFallbackDiagnosis(data: StudyDiagnosisData): AIDiagnosisResult {
  // AI API 실패 시 기본 진단 제공
  return {
    overallAssessment: `${data.studentName}님의 현재 상황을 분석한 결과, 체계적인 학습 계획과 약한 과목에 대한 집중적인 보완이 필요합니다. 현재 ${data.dailyStudyHours}시간의 학습시간을 더욱 효율적으로 활용할 수 있는 방법을 찾아보세요.`,
    strengthsAndWeaknesses: {
      strengths: [
        "진단을 통해 자신의 현재 상황을 파악하려는 의지가 있습니다",
        "꾸준한 학습 시간을 확보하고 있습니다",
        "명확한 목표 의식을 가지고 있습니다"
      ],
      weaknesses: [
        "약한 과목에 대한 체계적인 접근이 필요합니다",
        "학습 방법의 효율성을 높여야 합니다",
        "시간 관리와 집중력 향상이 필요합니다"
      ]
    },
    recommendations: {
      immediate: [
        "오늘부터 약한 과목 30분 기초 복습 시작하기",
        "스마트폰 사용 시간 줄이고 학습 환경 정리하기",
        "하루 학습 계획표 작성하고 실행하기"
      ],
      shortTerm: [
        "약한 과목 전용 오답노트 만들어 주 2회 복습하기",
        "월 1회 모의고사 풀고 분석하는 습관 만들기",
        "학습 방법 개선을 위한 시행착오 과정 거치기"
      ],
      longTerm: [
        "체계적인 학습 습관으로 꾸준한 성적 향상 달성하기",
        "자기주도 학습 능력 기르고 스스로 계획 수립하기",
        "목표 대학 진학을 위한 구체적인 로드맵 완성하기"
      ]
    },
    studyPlan: {
      daily: `매일 ${Math.min(data.dailyStudyHours + 1, 8)}시간 학습, 약한 과목 1시간 필수 포함`,
      weekly: "주 5일 정규 학습, 주말에 복습 및 모의고사 풀이",
      monthly: "월말 성과 점검, 학습 방법 개선점 찾기, 다음 달 목표 설정"
    },
    additionalResources: [
      "약한 과목 기초 문제집 및 개념서",
      "학습 계획 및 시간 관리 앱 (Forest, 스터디플래너 등)",
      "온라인 강의 플랫폼 (EBS, 메가스터디 등)",
      "학습법 관련 도서 (효율적인 공부법, 시간 관리 등)"
    ],
    urgencyLevel: data.currentGradeLevel === 'lower' || data.grade === '3' ? 'high' : 
                 data.currentGradeLevel === 'middle' ? 'medium' : 'low'
  };
}

// 헬퍼 함수들
function getSubjectName(subject: string): string {
  const names: { [key: string]: string } = {
    korean: '국어', english: '영어', math: '수학', 
    science: '과학', social: '사회', other: '기타'
  };
  return names[subject] || subject;
}

function getGradeLevelName(level: string): string {
  const names: { [key: string]: string } = {
    top: '상위권 (1-2등급)', upper: '중상위권 (3-4등급)',
    middle: '중위권 (5-6등급)', lower: '하위권 (7-9등급)'
  };
  return names[level] || level;
}

function getStudyStyleName(style: string): string {
  const names: { [key: string]: string } = {
    visual: '시각적 학습', auditory: '청각적 학습',
    kinesthetic: '체험적 학습', reading: '읽기/쓰기 학습'
  };
  return names[style] || style;
}

function getGoalName(goal: string): string {
  const names: { [key: string]: string } = {
    university: '대학 진학', grade_improvement: '성적 향상',
    habit_building: '학습 습관 형성', exam_prep: '시험 대비'
  };
  return names[goal] || goal;
}

function getConcernName(concern: string): string {
  const names: { [key: string]: string } = {
    motivation: '공부 의욕 부족', time_management: '시간 관리 문제',
    study_method: '공부 방법 모름', concentration: '집중력 부족',
    grades: '성적이 오르지 않음', career: '진로 고민'
  };
  return names[concern] || concern;
}