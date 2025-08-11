'use client';

import { QuizResult } from './Quiz';
import { schoolRankings, playerRankings, School, PlayerRanking } from '../data/quizData';

interface QuizResultProps {
  result: QuizResult;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export default function QuizResultComponent({ result, onPlayAgain, onGoHome }: QuizResultProps) {
  // 현재 플레이어의 학교 랭킹 찾기
  const schoolRank = schoolRankings.findIndex(school => 
    school.name === result.playerSchool
  ) + 1;

  // 현재 플레이어를 랭킹에 추가 (시뮬레이션)
  const currentPlayerRank = playerRankings.length + 1;
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🏆';
    if (score >= 80) return '🥈';
    if (score >= 60) return '🥉';
    return '💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0041C2] to-[#003399] p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* 결과 헤더 */}
        <div className="text-center text-white mb-12 pt-8">
          <div className="text-8xl mb-4">{getScoreEmoji(result.totalScore)}</div>
          <h1 className="text-4xl font-bold mb-4">퀴즈 완료!</h1>
          <p className="text-xl text-blue-200">
            {result.playerName}님의 결과를 확인해보세요
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* 왼쪽: 개인 결과 */}
          <div className="space-y-6">
            
            {/* 점수 카드 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">내 점수</h3>
              
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.totalScore)}`}>
                  {result.totalScore}점
                </div>
                <p className="text-gray-600">
                  {result.correctAnswers}/{result.totalQuestions} 문제 정답
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">⏱️</div>
                  <div className="text-lg font-medium text-gray-700">
                    {formatTime(result.totalTime)}
                  </div>
                  <div className="text-sm text-gray-500">소요 시간</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">🎯</div>
                  <div className="text-lg font-medium text-gray-700">
                    {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500">정답률</div>
                </div>
              </div>
            </div>

            {/* 개인 랭킹 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">개인 랭킹</h3>
              
              <div className="bg-[#FFD60A] rounded-xl p-4 mb-4 text-center">
                <div className="text-2xl font-bold text-black">#{currentPlayerRank}</div>
                <div className="text-sm text-gray-800">현재 순위</div>
              </div>

              <div className="space-y-2">
                {playerRankings.slice(0, 5).map((player, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-gray-900">#{player.rank}</span>
                      <span className="text-gray-700">{player.name}</span>
                      <span className="text-sm text-gray-500">{player.school}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{player.score}점</div>
                      <div className="text-sm text-gray-500">{formatTime(player.time)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 학교 랭킹 */}
          <div className="space-y-6">
            
            {/* 학교 순위 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">학교 랭킹</h3>
              
              <div className="bg-blue-50 rounded-xl p-4 mb-4 text-center">
                <div className="text-xl font-bold text-[#0041C2]">🏫 {result.playerSchool}</div>
                <div className="text-lg font-medium text-gray-700">#{schoolRank}위</div>
                <div className="text-sm text-gray-600">전국 순위</div>
              </div>

              <div className="space-y-3">
                {schoolRankings.slice(0, 6).map((school, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center py-3 px-4 rounded-lg ${
                      school.name === result.playerSchool ? 'bg-blue-50 border border-[#0041C2]' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-gray-900">#{index + 1}</span>
                      <div>
                        <div className="font-medium text-gray-900">{school.name}</div>
                        <div className="text-sm text-gray-500">{school.region}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{school.averageScore}점</div>
                      <div className="text-sm text-gray-500">{school.participantCount}명 참여</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 상세 분석 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">문제별 결과</h3>
              
              <div className="space-y-3">
                {result.answers.map((answer, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <span className={`text-2xl ${answer.isCorrect ? '✅' : '❌'}`}></span>
                      <span className="font-medium">문제 {index + 1}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {formatTime(answer.timeSpent)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="text-center mt-12 space-y-4">
          <div className="space-x-4">
            <button
              onClick={onPlayAgain}
              className="bg-[#FFD60A] text-black font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors text-lg"
            >
              🔄 다시 도전하기
            </button>
            
            <button
              onClick={onGoHome}
              className="bg-white text-[#0041C2] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors text-lg"
            >
              🏠 홈으로 돌아가기
            </button>
          </div>
          
          <p className="text-white text-sm">
            실제 대회에서는 더 많은 문제와 실시간 랭킹이 제공됩니다!
          </p>
        </div>
      </div>
    </div>
  );
}
