'use client';

import { useState } from 'react';
import { StudyDiagnosisData, UserType, Grade, GradeLevel, Subject, StudyStyle, GoalType, ConcernType } from '../types';

interface DiagnosisFormProps {
  onComplete: (data: StudyDiagnosisData) => void;
}

export default function DiagnosisForm({ onComplete }: DiagnosisFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<StudyDiagnosisData>>({
    weakSubjects: [],
    strongSubjects: [],
    goals: [],
    mainConcerns: []
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onComplete(formData as StudyDiagnosisData);
    }
  };

  const isFormValid = (): boolean => {
    return !!(
      formData.userType &&
      formData.studentName &&
      formData.grade &&
      formData.currentGradeLevel &&
      formData.dailyStudyHours !== undefined &&
      formData.studyStyle &&
      formData.currentSituation
    );
  };

  const updateFormData = (updates: Partial<StudyDiagnosisData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = <T,>(array: T[], item: T): T[] => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">기본 정보</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    누가 진단을 받나요?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {(['student', 'parent'] as UserType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => updateFormData({ userType: type })}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          formData.userType === type
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-300 hover:border-orange-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">
                          {type === 'student' ? '🎓' : '👨‍👩‍👧‍👦'}
                        </div>
                        <div className="font-medium">
                          {type === 'student' ? '학생 본인' : '학부모'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    {formData.userType === 'parent' ? '자녀분 이름' : '이름'}
                  </label>
                  <input
                    type="text"
                    value={formData.studentName || ''}
                    onChange={(e) => updateFormData({ studentName: e.target.value })}
                    placeholder="이름을 입력해주세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">현재 학년</label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['1', '2', '3'] as Grade[]).map((grade) => (
                      <button
                        key={grade}
                        onClick={() => updateFormData({ grade })}
                        className={`p-3 border-2 rounded-lg text-center transition-colors ${
                          formData.grade === grade
                            ? 'border-orange-500 bg-orange-50 text-orange-800 font-semibold'
                            : 'border-gray-300 hover:border-orange-300 text-gray-800 font-medium'
                        }`}
                      >
                        고등학교 {grade}학년
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">현재 성적대</label>
                  <div className="grid grid-cols-2 gap-4">
                    {([
                      { key: 'top', label: '상위권 (1~2등급)', emoji: '🏆' },
                      { key: 'upper', label: '중상위권 (3~4등급)', emoji: '📈' },
                      { key: 'middle', label: '중위권 (5~6등급)', emoji: '📊' },
                      { key: 'lower', label: '하위권 (7~9등급)', emoji: '📉' }
                    ]).map((level) => (
                      <button
                        key={level.key}
                        onClick={() => updateFormData({ currentGradeLevel: level.key as GradeLevel })}
                        className={`p-3 border-2 rounded-lg text-left transition-colors ${
                          formData.currentGradeLevel === level.key
                            ? 'border-orange-500 bg-orange-50 text-orange-800 font-semibold'
                            : 'border-gray-300 hover:border-orange-300 text-gray-800 font-medium'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{level.emoji}</span>
                          <span className="text-sm font-semibold">{level.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">과목별 현황</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                어려워하는 과목을 선택해주세요 (복수 선택 가능)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {([
                  { key: 'korean', label: '국어', emoji: '📝' },
                  { key: 'english', label: '영어', emoji: '🔤' },
                  { key: 'math', label: '수학', emoji: '➕' },
                  { key: 'science', label: '과학', emoji: '🧪' },
                  { key: 'social', label: '사회', emoji: '🏛️' },
                  { key: 'other', label: '기타', emoji: '📄' }
                ]).map((subject) => (
                  <button
                    key={subject.key}
                    onClick={() => updateFormData({ 
                      weakSubjects: toggleArrayItem(formData.weakSubjects || [], subject.key as Subject)
                    })}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      formData.weakSubjects?.includes(subject.key as Subject)
                        ? 'border-red-500 bg-red-50 text-red-800 font-semibold'
                        : 'border-gray-300 hover:border-red-300 text-gray-800 font-medium'
                    }`}
                  >
                    <div className="text-xl mb-1">{subject.emoji}</div>
                    <div className="text-sm font-semibold">{subject.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                잘하는 과목을 선택해주세요 (복수 선택 가능)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {([
                  { key: 'korean', label: '국어', emoji: '📝' },
                  { key: 'english', label: '영어', emoji: '🔤' },
                  { key: 'math', label: '수학', emoji: '➕' },
                  { key: 'science', label: '과학', emoji: '🧪' },
                  { key: 'social', label: '사회', emoji: '🏛️' },
                  { key: 'other', label: '기타', emoji: '📄' }
                ]).map((subject) => (
                  <button
                    key={subject.key}
                    onClick={() => updateFormData({ 
                      strongSubjects: toggleArrayItem(formData.strongSubjects || [], subject.key as Subject)
                    })}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      formData.strongSubjects?.includes(subject.key as Subject)
                        ? 'border-green-500 bg-green-50 text-green-800 font-semibold'
                        : 'border-gray-300 hover:border-green-300 text-gray-800 font-medium'
                    }`}
                  >
                    <div className="text-xl mb-1">{subject.emoji}</div>
                    <div className="text-sm font-semibold">{subject.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">학습 패턴</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                하루 평균 몇 시간 공부하나요?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 1, label: '1시간 이하' },
                  { value: 2, label: '1-2시간' },
                  { value: 4, label: '3-4시간' },
                  { value: 6, label: '5-6시간' },
                  { value: 8, label: '7-8시간' },
                  { value: 10, label: '9시간 이상' }
                ].map((hour) => (
                  <button
                    key={hour.value}
                    onClick={() => updateFormData({ dailyStudyHours: hour.value })}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      formData.dailyStudyHours === hour.value
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{hour.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                선호하는 학습 스타일은?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {([
                  { key: 'visual', label: '시각적 학습', desc: '그림, 도표, 색깔로 공부', emoji: '👀' },
                  { key: 'auditory', label: '청각적 학습', desc: '듣기, 말하기로 공부', emoji: '🎧' },
                  { key: 'kinesthetic', label: '체험적 학습', desc: '손으로 쓰고 만지며 공부', emoji: '✏️' },
                  { key: 'reading', label: '읽기/쓰기 학습', desc: '책 읽고 정리하며 공부', emoji: '📚' }
                ]).map((style) => (
                  <button
                    key={style.key}
                    onClick={() => updateFormData({ studyStyle: style.key as StudyStyle })}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.studyStyle === style.key
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{style.emoji}</span>
                      <div>
                        <div className="font-medium mb-1">{style.label}</div>
                        <div className="text-sm text-gray-600">{style.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">목표와 고민</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                주요 목표를 선택해주세요 (복수 선택 가능)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {([
                  { key: 'university', label: '원하는 대학 진학', emoji: '🏠' },
                  { key: 'grade_improvement', label: '성적 향상', emoji: '📊' },
                  { key: 'habit_building', label: '학습 습관 형성', emoji: '⌚' },
                  { key: 'exam_prep', label: '시험 대비', emoji: '📋' }
                ]).map((goal) => (
                  <button
                    key={goal.key}
                    onClick={() => updateFormData({ 
                      goals: toggleArrayItem(formData.goals || [], goal.key as GoalType)
                    })}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.goals?.includes(goal.key as GoalType)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{goal.emoji}</span>
                      <span className="font-medium">{goal.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                현재 가장 큰 고민은? (복수 선택 가능)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {([
                  { key: 'motivation', label: '공부 의욕 부족', emoji: '⚡' },
                  { key: 'time_management', label: '시간 관리 문제', emoji: '⏰' },
                  { key: 'study_method', label: '공부 방법 모름', emoji: '🔍' },
                  { key: 'concentration', label: '집중력 부족', emoji: '🧠' },
                  { key: 'grades', label: '성적이 오르지 않음', emoji: '📊' },
                  { key: 'career', label: '진로 고민', emoji: '🎯' }
                ]).map((concern) => (
                  <button
                    key={concern.key}
                    onClick={() => updateFormData({ 
                      mainConcerns: toggleArrayItem(formData.mainConcerns || [], concern.key as ConcernType)
                    })}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.mainConcerns?.includes(concern.key as ConcernType)
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{concern.emoji}</span>
                      <span className="font-medium">{concern.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">상세 상황</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                현재 학습 상황을 구체적으로 설명해주세요
              </label>
              <textarea
                value={formData.currentSituation || ''}
                onChange={(e) => updateFormData({ currentSituation: e.target.value })}
                placeholder="예: 수학 성적이 계속 3등급에서 머물러 있어서 고민입니다. 문제집을 많이 풀어도 시험에서는 실수가 많아요..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                이전에 시도해본 학습 방법이나 노력이 있다면 알려주세요
              </label>
              <textarea
                value={formData.previousEfforts || ''}
                onChange={(e) => updateFormData({ previousEfforts: e.target.value })}
                placeholder="예: 학원을 다녀봤지만 효과가 별로였고, 인터넷 강의도 들어봤는데 집중이 안 됐어요..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                가장 구체적인 고민이나 질문이 있다면?
              </label>
              <textarea
                value={formData.specificConcern || ''}
                onChange={(e) => updateFormData({ specificConcern: e.target.value })}
                placeholder="예: 수학 문제를 풀 때 어디서부터 접근해야 할지 모르겠어요. 어떤 순서로 공부해야 할까요?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">진단 완료 준비</h3>
            
            <div className="bg-orange-50 p-6 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-3">입력하신 정보 확인</h4>
              <div className="space-y-2 text-sm text-orange-900 font-medium">
                <p>• 사용자: {formData.userType === 'student' ? '학생 본인' : '학부모'}</p>
                <p>• 이름: {formData.studentName}</p>
                <p>• 학년: 고{formData.grade}학년</p>
                <p>• 성적대: {
                  formData.currentGradeLevel === 'top' ? '상위권' :
                  formData.currentGradeLevel === 'upper' ? '중상위권' :
                  formData.currentGradeLevel === 'middle' ? '중위권' : '하위권'
                }</p>
                <p>• 일일 학습시간: {formData.dailyStudyHours}시간</p>
                <p>• 어려운 과목: {formData.weakSubjects?.length || 0}개 선택</p>
                <p>• 주요 고민: {formData.mainConcerns?.length || 0}개 선택</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start">
                <span className="text-yellow-500 text-xl mr-3">✨</span>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">진단 결과 안내</h4>
                  <ul className="text-sm text-yellow-900 font-medium space-y-1">
                    <li>• <strong>무료 AI 진단:</strong> 즉시 맞춤형 학습 진단 결과를 받을 수 있습니다</li>
                    <li>• <strong>전문가 상담:</strong> 더 자세한 분석을 원하시면 전문가 상담을 예약하세요</li>
                    <li>• 모든 정보는 안전하게 보호되며, 진단 목적으로만 사용됩니다</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">학습 상태 진단</h2>
          <span className="text-sm text-gray-500">{currentStep} / {totalSteps}</span>
        </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold'
          }`}
        >
          이전
        </button>

        {currentStep === totalSteps ? (
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`px-8 py-3 rounded-lg font-bold transition-colors ${
              isFormValid()
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            AI 진단 받기
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}