// 학습 퀴즈 데이터
export interface QuizQuestion {
  id: number;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    subject: '수학',
    question: '다음 중 2차 함수 f(x) = x² - 4x + 3의 최솟값은?',
    options: ['-1', '0', '1', '3'],
    correctAnswer: 0,
    explanation: '2차 함수의 최솟값은 x = -b/2a = 4/2 = 2일 때, f(2) = 4 - 8 + 3 = -1입니다.',
    difficulty: 'medium'
  },
  {
    id: 2,
    subject: '영어',
    question: '다음 문장에서 밑줄 친 부분의 올바른 형태는?\nI wish I _____ more time to study yesterday.',
    options: ['have', 'had', 'had had', 'would have'],
    correctAnswer: 2,
    explanation: '과거에 대한 가정을 나타내는 "I wish I had had"가 정답입니다.',
    difficulty: 'hard'
  },
  {
    id: 3,
    subject: '국어',
    question: '다음 중 맞춤법이 올바른 것은?',
    options: ['안 되다', '안되다', '않되다', '않 되다'],
    correctAnswer: 0,
    explanation: '"안 되다"는 "되다"의 부정형으로 띄어쓰기를 해야 합니다.',
    difficulty: 'easy'
  },
  {
    id: 4,
    subject: '과학',
    question: '물의 끓는점이 100°C가 되는 조건은?',
    options: ['1기압에서', '2기압에서', '0.5기압에서', '기압과 무관'],
    correctAnswer: 0,
    explanation: '물의 끓는점은 1기압(표준 대기압)에서 100°C입니다.',
    difficulty: 'easy'
  },
  {
    id: 5,
    subject: '사회',
    question: '다음 중 대한민국 헌법상 기본권이 아닌 것은?',
    options: ['자유권', '평등권', '사회권', '환경권'],
    correctAnswer: 3,
    explanation: '환경권은 헌법에 명시된 기본권이 아닙니다. 자유권, 평등권, 사회권이 대표적인 기본권입니다.',
    difficulty: 'hard'
  }
];

// 학교 더미 데이터
export interface School {
  name: string;
  region: string;
  averageScore: number;
  participantCount: number;
}

export const schoolRankings: School[] = [
  { name: '서울고등학교', region: '서울', averageScore: 95, participantCount: 248 },
  { name: '부산국제고등학교', region: '부산', averageScore: 94, participantCount: 189 },
  { name: '대전과학고등학교', region: '대전', averageScore: 93, participantCount: 156 },
  { name: '광주제일고등학교', region: '광주', averageScore: 92, participantCount: 203 },
  { name: '인천외국어고등학교', region: '인천', averageScore: 91, participantCount: 167 },
  { name: '울산중앙고등학교', region: '울산', averageScore: 90, participantCount: 145 },
  { name: '대구경북고등학교', region: '대구', averageScore: 89, participantCount: 178 },
  { name: '제주한라고등학교', region: '제주', averageScore: 88, participantCount: 134 },
];

// 개인 랭킹 더미 데이터  
export interface PlayerRanking {
  rank: number;
  name: string;
  school: string;
  score: number;
  time: number; // 초 단위
}

export const playerRankings: PlayerRanking[] = [
  { rank: 1, name: '김수학', school: '서울고등학교', score: 100, time: 45 },
  { rank: 2, name: '박영어', school: '부산국제고등학교', score: 100, time: 52 },
  { rank: 3, name: '이과학', school: '대전과학고등학교', score: 100, time: 58 },
  { rank: 4, name: '최국어', school: '광주제일고등학교', score: 80, time: 38 },
  { rank: 5, name: '정사회', school: '인천외국어고등학교', score: 80, time: 41 },
  { rank: 6, name: '윤수학', school: '울산중앙고등학교', score: 80, time: 44 },
  { rank: 7, name: '장영어', school: '대구경북고등학교', score: 80, time: 47 },
  { rank: 8, name: '오과학', school: '제주한라고등학교', score: 60, time: 35 },
];
