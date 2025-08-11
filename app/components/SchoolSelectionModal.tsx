'use client';

import { useState, useRef, useEffect } from 'react';
import { schoolRankings } from '../data/quizData';

interface SchoolSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (name: string, school: string) => void;
}

export default function SchoolSelectionModal({ isOpen, onClose, onStart }: SchoolSelectionModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolSearchTerm, setSchoolSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 학교 검색 필터링
  const filteredSchools = schoolRankings.filter(school =>
    school.name.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
    school.region.toLowerCase().includes(schoolSearchTerm.toLowerCase())
  );

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (!selectedSchool.trim()) {
      alert('학교를 선택해주세요.');
      return;
    }

    onStart(playerName.trim(), selectedSchool.trim());
  };

  const handleSchoolInputChange = (value: string) => {
    setSchoolSearchTerm(value);
    setSelectedSchool(value);
    setShowDropdown(true);
    setHighlightedIndex(-1);
  };

  const handleSchoolSelect = (school: { name: string; region: string }) => {
    setSelectedSchool(school.name);
    setSchoolSearchTerm(school.name);
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSchools.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredSchools.length) {
          handleSchoolSelect(filteredSchools[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // 모달이 닫힐 때 상태 리셋
  useEffect(() => {
    if (!isOpen) {
      setPlayerName('');
      setSelectedSchool('');
      setSchoolSearchTerm('');
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

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

          {/* 학교 선택 (검색 가능한 드롭다운) */}
          <div className="mb-6" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              학교 선택 <span className="text-red-500">*</span>
            </label>
            
            {/* 검색 입력 필드 */}
            <div className="relative">
              <input
                type="text"
                placeholder="학교 이름을 검색하세요 (예: 서울고, 부산국제고)"
                value={schoolSearchTerm}
                onChange={(e) => handleSchoolInputChange(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0041C2] text-gray-900 placeholder-gray-500 bg-white"
                autoComplete="off"
              />
              
              {/* 드롭다운 화살표 */}
              <div 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {showDropdown ? '▲' : '▼'}
              </div>

              {/* 드롭다운 리스트 */}
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredSchools.length > 0 ? (
                    filteredSchools.map((school, index) => {
                      const schoolRank = schoolRankings.findIndex(s => s.name === school.name) + 1;
                      return (
                        <div
                          key={index}
                          onClick={() => handleSchoolSelect(school)}
                          className={`px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 ${
                            index === highlightedIndex ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-gray-900">{school.name}</div>
                              <div className="text-sm text-gray-500">{school.region}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-[#0041C2]">#{schoolRank}위</div>
                              <div className="text-xs text-gray-500">{school.averageScore}점</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <div className="mb-2">🔍</div>
                      <div>검색 결과가 없습니다</div>
                      <div className="text-xs mt-1">직접 입력하신 학교명으로 진행됩니다</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">📝 퀴즈 규칙</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 총 5문제 (수학, 영어, 국어, 과학, 사회)</li>
              <li>• 각 문제당 60초 제한</li>
              <li>• 빠르게 정답을 맞출수록 높은 점수</li>
              <li>• 시간 초과시 자동으로 다음 문제로 이동</li>
              <li>• 학교 이름은 검색으로 쉽게 찾을 수 있어요</li>
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
