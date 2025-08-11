'use client';

import { useState } from 'react';
import Quiz, { QuizResult } from './components/Quiz';
import QuizResultComponent from './components/QuizResult';
import SchoolSelectionModal from './components/SchoolSelectionModal';

// 웨이팅 리스트 모달 컴포넌트
function WaitingListModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        // 3초 후 모달 닫기
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setName('');
          setEmail('');
        }, 3000);
      } else {
        alert(result.error || '등록 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('웨이팅 리스트 등록 오류:', error);
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        {isSuccess ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">웨이팅 리스트 등록 완료!</h3>
            <p className="text-gray-600 mb-6">출시되면 가장 먼저 알려드릴게요.</p>
            <div className="bg-[#0041C2] text-white px-6 py-3 rounded-lg font-medium inline-block">
              콴다 앱 다운로드
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">학교 대표로 도전하기</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                <input
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0041C2] text-gray-900 placeholder-gray-500 bg-white"
                />
                </div>
              
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0041C2] text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FFD60A] text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '등록 중...' : '등록하기'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

type AppState = 'landing' | 'quiz' | 'quiz-result';

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<{ name: string; school: string } | null>(null);

  const openWaitlistModal = () => setIsWaitlistModalOpen(true);
  const closeWaitlistModal = () => setIsWaitlistModalOpen(false);
  
  const openSchoolModal = () => setIsSchoolModalOpen(true);
  const closeSchoolModal = () => setIsSchoolModalOpen(false);

  const handleQuizStart = (name: string, school: string) => {
    setCurrentPlayer({ name, school });
    setCurrentState('quiz');
    closeSchoolModal();
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setCurrentState('quiz-result');
  };

  const handlePlayAgain = () => {
    setQuizResult(null);
    setCurrentState('quiz');
  };

  const handleGoHome = () => {
    setCurrentState('landing');
    setQuizResult(null);
    setCurrentPlayer(null);
  };

  // 현재 상태에 따른 렌더링
  if (currentState === 'quiz' && currentPlayer) {
    return (
      <Quiz
        playerName={currentPlayer.name}
        playerSchool={currentPlayer.school}
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  if (currentState === 'quiz-result' && quizResult) {
    return (
      <QuizResultComponent
        result={quizResult}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
    );
  }

  // 기본: 랜딩페이지
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="min-h-screen bg-gradient-to-br from-[#0041C2] via-[#0041C2] to-[#003399] relative overflow-hidden">
        {/* 네온 옐로우 패턴 배경 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFD60A] rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#FFD60A] rounded-full"></div>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-[#FFD60A] rounded-full"></div>
        </div>
        
        {/* 헤더 */}
        <header className="relative z-10 px-6 py-4">
          <div className="flex items-center">
            <div className="text-white text-2xl font-bold">QANDA</div>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="relative z-10 container mx-auto px-6 py-20 flex items-center min-h-[80vh]">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full">
            {/* 좌측 텍스트 */}
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                전국 학교대항<br />
                퀴즈 리그,<br />
                <span className="text-[#FFD60A]">너희 학교가 1등일까?</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                실시간 퀴즈로 전국 학교와 겨루고,<br />
                치킨 300마리를 쟁취하라!
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={openSchoolModal}
                  className="w-full bg-[#FFD60A] text-black text-xl font-bold px-8 py-4 rounded-2xl hover:bg-yellow-400 transition-colors shadow-lg hover:shadow-xl"
                >
                  학교 대표로 도전하기 🚀
                </button>
                
                <button 
                  onClick={openWaitlistModal}
                  className="w-full bg-white bg-opacity-20 text-white text-lg font-medium px-8 py-3 rounded-2xl hover:bg-opacity-30 transition-colors border border-white border-opacity-30"
                >
                  정식 출시 알림 받기 📧
                </button>
              </div>
            </div>
            
            {/* 우측 일러스트 */}
            <div className="text-center">
              <div className="bg-white bg-opacity-10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="text-8xl mb-4">🏆</div>
                <div className="text-6xl mb-4">🍗</div>
                <div className="text-4xl">📚 👨‍🎓 👩‍🎓</div>
                <p className="text-white mt-4 text-lg">학교 대항전의 승리를 쟁취하세요!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 개요 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            콴다 학교대항전이 뭐예요?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* 카드 1 */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">실시간 퀴즈</h3>
              <p className="text-gray-600">1분 만에 즐기는<br />교육 퀴즈</p>
            </div>
            
            {/* 카드 2 */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">학교별 랭킹</h3>
              <p className="text-gray-600">반·학년·학교 순위<br />실시간 업데이트</p>
            </div>
            
            {/* 카드 3 */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">🍗</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">대규모 보상</h3>
              <p className="text-gray-600">상위 N개 학교<br />치킨 300마리 증정</p>
            </div>
          </div>
        </div>
      </section>

      {/* 사용 시나리오 섹션 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            이렇게 진행됩니다
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* 프로세스 1 */}
            <div className="text-center">
              <div className="bg-[#0041C2] rounded-2xl p-8 mb-6 text-white">
                <div className="text-6xl mb-4">👆</div>
                <h3 className="text-xl font-bold">참여하기 버튼 클릭</h3>
                <p className="mt-2">"OO고등학교" 선택</p>
              </div>
            </div>
            
            {/* 프로세스 2 */}
            <div className="text-center">
              <div className="bg-[#FFD60A] rounded-2xl p-8 mb-6 text-black">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-xl font-bold">퀴즈 도전</h3>
                <p className="mt-2">5문제 중 최대한 빠르게 정답</p>
              </div>
            </div>
            
            {/* 프로세스 3 */}
            <div className="text-center">
              <div className="bg-green-500 rounded-2xl p-8 mb-6 text-white">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-bold">실시간 랭킹 확인</h3>
                <p className="mt-2">현재 학교 순위 & 반 순위 표시</p>
              </div>
            </div>
                </div>
          
          <p className="text-center text-gray-600 bg-gray-100 p-4 rounded-lg">
            <em>실제 게임은 출시 시 제공됩니다. 지금은 체험 영상만 제공돼요.</em>
          </p>
                </div>
      </section>

      {/* 보상 및 혜택 섹션 */}
      <section className="py-20 bg-[#FFD60A]">
        <div className="container mx-auto px-6 text-center">
          <div className="text-9xl mb-8">🍗🍗🍗</div>
          <h2 className="text-5xl font-bold text-black mb-8">
            상위 N개 학교, 치킨 300마리 쏩니다!
          </h2>
          <p className="text-2xl text-gray-800">
            한 학교당 전교생이 함께 즐길 수 있는 치킨 파티
          </p>
        </div>
      </section>

      {/* 참가 방법 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            참가하는 방법
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* 단계 1 */}
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-6xl mb-4">👆</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">버튼 클릭</h3>
                <p className="text-gray-600">참여 신청</p>
              </div>
            </div>
            
            {/* 단계 2 */}
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-6xl mb-4">⌨️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">폼 작성</h3>
                <p className="text-gray-600">이름 & 이메일 입력</p>
              </div>
            </div>
            
            {/* 단계 3 */}
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">완료 메시지</h3>
                <p className="text-gray-600">출시 알림 대기</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-[#0041C2] text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            지금 바로 참여하고 치킨을 쟁취하세요! 🍗
          </h2>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={openSchoolModal}
              className="bg-[#FFD60A] text-black text-2xl font-bold px-12 py-6 rounded-2xl hover:bg-yellow-400 transition-colors shadow-lg hover:shadow-xl"
            >
              학교 대표로 도전하기 🚀
            </button>
            
            <button
              onClick={openWaitlistModal}
              className="bg-white bg-opacity-20 text-white text-xl font-medium px-8 py-4 rounded-2xl hover:bg-opacity-30 transition-colors border border-white border-opacity-30"
            >
              정식 출시 알림 받기 📧
            </button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-4">QANDA</div>
          <p className="text-gray-400 mb-4">© 2024 콴다. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-white">개인정보 처리방침</a>
            <a href="#" className="hover:text-white">문의</a>
          </div>
        </div>
      </footer>

      {/* 모달들 */}
      <WaitingListModal isOpen={isWaitlistModalOpen} onClose={closeWaitlistModal} />
      <SchoolSelectionModal 
        isOpen={isSchoolModalOpen} 
        onClose={closeSchoolModal}
        onStart={handleQuizStart}
      />
    </div>
  );
}