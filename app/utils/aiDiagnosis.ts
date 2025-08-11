import { StudyDiagnosisData, AIDiagnosisResult } from '../types';

export async function generateAIDiagnosis(data: StudyDiagnosisData): Promise<AIDiagnosisResult> {
  try {
    const response = await fetch('/api/ai-diagnosis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const result: AIDiagnosisResult = await response.json();
    return result;

  } catch (error) {
    console.error('AI 진단 API 호출 오류:', error);
    
    // API 호출 실패 시 기본 진단 제공
    return generateFallbackDiagnosis(data);
  }
}

// API 실패 시 기본 진단 함수
function generateFallbackDiagnosis(data: StudyDiagnosisData): AIDiagnosisResult {
  // 성적대별 기본 평가
  const gradeAssessments = {
    top: "현재 상위권을 유지하고 있어 기본 실력은 우수합니다.",
    upper: "중상위권으로 상위권 도약 가능성이 높습니다.",
    middle: "중위권으로 체계적인 학습으로 상당한 향상이 가능합니다.",
    lower: "기초부터 차근차근 다져나가면 분명히 성과를 볼 수 있습니다."
  };

  // 학습시간별 평가
  const timeAssessments = {
    low: "현재 학습시간이 부족합니다.",
    moderate: "적절한 학습시간을 유지하고 있습니다.",
    high: "충분한 학습시간을 투자하고 있습니다."
  };

  const studyTimeCategory = data.dailyStudyHours <= 2 ? 'low' : 
                           data.dailyStudyHours <= 6 ? 'moderate' : 'high';

  // 강점 분석
  const strengths: string[] = [];
  if (data.strongSubjects && data.strongSubjects.length > 0) {
    strengths.push(`${data.strongSubjects.map(s => getSubjectName(s)).join(', ')} 과목에서 좋은 실력을 보유하고 있습니다`);
  }
  if (data.dailyStudyHours >= 4) {
    strengths.push("충분한 학습시간을 확보하고 있어 성실성이 돋보입니다");
  }
  if (data.goals && data.goals.length > 0) {
    strengths.push("명확한 목표를 가지고 있어 동기부여가 잘 되어 있습니다");
  }
  if (strengths.length === 0) {
    strengths.push("진단을 통해 현재 상황을 객관적으로 파악하려는 의지가 있습니다");
  }

  // 약점 분석
  const weaknesses: string[] = [];
  if (data.weakSubjects && data.weakSubjects.length > 0) {
    weaknesses.push(`${data.weakSubjects.map(s => getSubjectName(s)).join(', ')} 과목에서 어려움을 겪고 있습니다`);
  }
  if (data.mainConcerns) {
    data.mainConcerns.forEach(concern => {
      switch (concern) {
        case 'motivation':
          weaknesses.push("학습 동기부여에 어려움이 있습니다");
          break;
        case 'time_management':
          weaknesses.push("효율적인 시간 관리가 필요합니다");
          break;
        case 'study_method':
          weaknesses.push("본인에게 맞는 학습법을 찾지 못했습니다");
          break;
        case 'concentration':
          weaknesses.push("집중력 향상이 필요합니다");
          break;
        case 'grades':
          weaknesses.push("성적 향상을 위한 체계적 접근이 필요합니다");
          break;
      }
    });
  }

  // 즉시 실행 가능한 추천사항
  const immediate: string[] = [
    "오늘부터 하루 30분씩 약한 과목 기초 복습하기",
    "스마트폰 사용 시간을 30분 줄이고 학습에 집중하기",
    "학습 환경 정리하고 집중할 수 있는 공간 만들기"
  ];

  if (data.studyStyle === 'visual') {
    immediate.push("컬러펜과 도표를 활용한 시각적 정리법 시작하기");
  } else if (data.studyStyle === 'auditory') {
    immediate.push("중요 내용을 소리내어 읽고 녹음해서 반복 듣기");
  }

  // 단기 계획
  const shortTerm: string[] = [
    "약한 과목 전용 오답노트 만들어 주 2회 복습하기",
    "학습 계획표 작성하고 매일 실행 여부 체크하기",
    "월 1회 모의고사 풀고 분석하는 습관 만들기"
  ];

  if (data.currentGradeLevel === 'lower' || data.currentGradeLevel === 'middle') {
    shortTerm.push("기초 개념부터 차근차근 다시 정리하기");
  }

  // 장기 목표
  const longTerm: string[] = [
    "체계적인 학습 습관을 통해 꾸준한 성적 향상 달성하기",
    "자기주도 학습 능력을 기르고 스스로 학습 계획 수립하기",
    "목표 대학이나 진로에 맞는 구체적인 로드맵 완성하기"
  ];

  // 학습 계획
  const studyPlan = {
    daily: `매일 ${Math.min(data.dailyStudyHours + 1, 8)}시간 학습, 약한 과목 1시간 필수 포함`,
    weekly: "주 5일 정규 학습, 주말에 복습 및 모의고사 풀이",
    monthly: "월말 성과 점검, 학습 방법 개선점 찾기, 다음 달 목표 설정"
  };

  // 추천 자료
  const additionalResources: string[] = [
    "약한 과목 기초 문제집 및 개념서",
    "학습 계획 및 시간 관리 앱 (Forest, 스터디플래너 등)",
    "온라인 강의 플랫폼 (강점 과목은 심화, 약점 과목은 기초)",
    "학습법 관련 도서 (효율적인 공부법, 시간 관리 등)"
  ];

  // 긴급도 결정
  let urgencyLevel: 'low' | 'medium' | 'high' = 'low';
  if (data.currentGradeLevel === 'lower' || 
      (data.mainConcerns && data.mainConcerns.includes('grades')) ||
      data.grade === '3') {
    urgencyLevel = 'high';
  } else if (data.currentGradeLevel === 'middle' || 
             (data.mainConcerns && data.mainConcerns.length >= 3)) {
    urgencyLevel = 'medium';
  }

  return {
    overallAssessment: `${gradeAssessments[data.currentGradeLevel]} ${timeAssessments[studyTimeCategory]} 현재 가장 중요한 것은 체계적인 학습 계획 수립과 약한 과목에 대한 집중적인 보완입니다. ${data.specificConcern ? '특히 언급하신 고민에 대해서는 단계적인 접근이 필요합니다.' : ''}`,
    strengthsAndWeaknesses: {
      strengths,
      weaknesses: weaknesses.length > 0 ? weaknesses : ["현재 특별한 약점은 발견되지 않았으나, 더 체계적인 학습으로 향상 가능합니다"]
    },
    recommendations: {
      immediate,
      shortTerm,
      longTerm
    },
    studyPlan,
    additionalResources,
    urgencyLevel
  };
}

function getSubjectName(subject: string): string {
  const subjectNames: { [key: string]: string } = {
    korean: '국어',
    english: '영어',
    math: '수학',
    science: '과학',
    social: '사회',
    other: '기타'
  };
  return subjectNames[subject] || subject;
}