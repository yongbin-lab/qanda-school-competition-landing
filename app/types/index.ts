// 사용자 타입
export type UserType = 'student' | 'parent';

// 학년
export type Grade = '1' | '2' | '3';

// 성적대
export type GradeLevel = 'top' | 'upper' | 'middle' | 'lower';

// 과목
export type Subject = 'korean' | 'english' | 'math' | 'science' | 'social' | 'other';

// 학습 스타일
export type StudyStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading';

// 목표 유형
export type GoalType = 'university' | 'grade_improvement' | 'habit_building' | 'exam_prep';

// 주요 고민
export type ConcernType = 'motivation' | 'time_management' | 'study_method' | 'concentration' | 'grades' | 'career';

// 학습 진단 설문 데이터
export interface StudyDiagnosisData {
  // 기본 정보
  userType: UserType;
  studentName: string;
  grade: Grade;
  currentGradeLevel: GradeLevel;
  
  // 학습 현황
  weakSubjects: Subject[];
  strongSubjects: Subject[];
  dailyStudyHours: number;
  studyStyle: StudyStyle;
  
  // 목표 및 고민
  goals: GoalType[];
  mainConcerns: ConcernType[];
  specificConcern: string; // 구체적인 고민 서술
  
  // 현재 상황
  currentSituation: string; // 현재 학습 상황 서술
  previousEfforts: string; // 이전에 시도했던 방법들
  
  // 연락처 (전문가 상담용)
  contactInfo?: {
    phone: string;
    email: string;
    preferredTime: string;
  };
}

// AI 진단 결과
export interface AIDiagnosisResult {
  overallAssessment: string; // 전체적인 진단
  strengthsAndWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  recommendations: {
    immediate: string[]; // 즉시 실행 가능한 해결책
    shortTerm: string[]; // 단기 계획 (1-2개월)
    longTerm: string[]; // 장기 계획 (3-6개월)
  };
  studyPlan: {
    daily: string;
    weekly: string;
    monthly: string;
  };
  additionalResources: string[]; // 추천 자료/도구
  urgencyLevel: 'low' | 'medium' | 'high'; // 긴급도
}

// 전문가 상담 예약
export interface ExpertConsultation {
  id: string;
  diagnosisData: StudyDiagnosisData;
  requestedDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  consultantName?: string;
  scheduledTime?: string;
  notes?: string;
}