'use client';

import { useState } from 'react';
import { schoolRankings } from '../data/quizData';

interface SchoolSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (name: string, school: string) => void;
}

export default function SchoolSelectionModal({ isOpen, onClose, onStart }: SchoolSelectionModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [customSchool, setCustomSchool] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    const finalSchool = showCustomInput ? customSchool.trim() : selectedSchool;
    if (!finalSchool) {
      alert('학교를 선택하거나 입력해주세요.');
      return;
    }

    onStart(playerName.trim(), finalSchool);
  };

  const handleSchoolChange = (school: string) => {
    if (school === 'custom') {
      setShowCustomInput(true);
      setSelectedSchool('');
    } else {
      setShowCustomInput(false);
      setSelectedSchool(school);
      setCustomSchool('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">퀴즈 도전하기</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* 이름 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="홍길동"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0041C2] text-gray-900 placeholder-gray-500 bg-white"
            />
          </div>

          {/* 학교 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              학교 선택 <span className="text-red-500">*</span>
            </label>
            
            {/* 인기 학교 리스트 */}
            <div className="space-y-2 mb-4">
              {schoolRankings.slice(0, 6).map((school, index) => (
                <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="school"
                    value={school.name}
                    checked={selectedSchool === school.name}
                    onChange={(e) => handleSchoolChange(e.target.value)}
                    className="text-[#0041C2]"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{school.name}</div>
                    <div className="text-sm text-gray-500">
                      {school.region} • 평균 {school.averageScore}점 • {school.participantCount}명 참여
                    </div>
                  </div>
                  <div className="text-sm font-medium text-[#0041C2]">
                    #{index + 1}위
                  </div>
                </label>
              ))}
              
              {/* 기타 학교 옵션 */}
              <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="school"
                  value="custom"
                  checked={showCustomInput}
                  onChange={(e) => handleSchoolChange(e.target.value)}
                  className="text-[#0041C2]"
                />
                <span className="text-gray-700">기타 학교 (직접 입력)</span>
              </label>
            </div>

            {/* 커스텀 학교 입력 */}
            {showCustomInput && (
              <input
                type="text"
                placeholder="우리 학교 이름을 입력하세요"
                value={customSchool}
                onChange={(e) => setCustomSchool(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0041C2] text-gray-900 placeholder-gray-500 bg-white"
              />
            )}
          </div>

          {/* 주의사항 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">📝 퀴즈 규칙</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 총 5문제, 각 문제당 60초 제한</li>
              <li>• 빠르게 정답을 맞출수록 높은 점수</li>
              <li>• 시간 초과시 자동으로 다음 문제</li>
              <li>• 한 번 선택하면 변경 불가</li>
            </ul>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#0041C2] text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            🚀 퀴즈 시작하기
          </button>
        </form>
      </div>
    </div>
  );
}
