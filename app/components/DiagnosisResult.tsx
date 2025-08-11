'use client';

import { StudyDiagnosisData, AIDiagnosisResult } from '../types';

interface DiagnosisResultProps {
  diagnosisData: StudyDiagnosisData;
  result: AIDiagnosisResult;
  onRequestExpertConsultation: () => void;
  onStartOver: () => void;
}

export default function DiagnosisResult({ 
  diagnosisData, 
  result, 
  onRequestExpertConsultation, 
  onStartOver 
}: DiagnosisResultProps) {
  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'high': return '⚠️';
      case 'medium': return '📊';
      case 'low': return '✅';
      default: return '📋';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🎓</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {diagnosisData.studentName}님의 학습 진단 결과
        </h1>
        <div className={`inline-flex items-center px-4 py-2 rounded-full border-2 ${getUrgencyColor(result.urgencyLevel)}`}>
          <span className="text-lg mr-2">{getUrgencyIcon(result.urgencyLevel)}</span>
          <span className="font-semibold">
            {result.urgencyLevel === 'high' ? '즉시 개선 필요' :
             result.urgencyLevel === 'medium' ? '단계적 개선 필요' : '현상 유지 및 향상'}
          </span>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-orange-900 mb-4 flex items-center">
          <span className="text-2xl mr-3">🎯</span>
          종합 진단
        </h2>
        <p className="text-orange-900 leading-relaxed font-medium">{result.overallAssessment}</p>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
            <span className="text-xl mr-2">⭐</span>
            강점
          </h3>
          <ul className="space-y-2">
            {result.strengthsAndWeaknesses.strengths.map((strength, index) => (
              <li key={index} className="flex items-start text-green-900 font-medium">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center">
            <span className="text-xl mr-2">📈</span>
            개선점
          </h3>
          <ul className="space-y-2">
            {result.strengthsAndWeaknesses.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start text-orange-900 font-medium">
                <span className="text-orange-500 mr-2 mt-1">!</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-2xl mr-3">✨</span>
          맞춤 솔루션
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-3 flex items-center">
              <span className="text-lg mr-2">🚀</span>
              즉시 실행 (오늘)
            </h4>
            <ul className="space-y-2">
              {result.recommendations.immediate.map((rec, index) => (
                <li key={index} className="text-sm text-red-900 font-medium flex items-start">
                  <span className="text-red-500 mr-2 mt-1 text-xs">●</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
              <span className="text-lg mr-2">📋</span>
              단기 계획 (1-2개월)
            </h4>
            <ul className="space-y-2">
              {result.recommendations.shortTerm.map((rec, index) => (
                <li key={index} className="text-sm text-yellow-900 font-medium flex items-start">
                  <span className="text-yellow-500 mr-2 mt-1 text-xs">●</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center">
              <span className="text-lg mr-2">🏆</span>
              장기 목표 (3-6개월)
            </h4>
            <ul className="space-y-2">
              {result.recommendations.longTerm.map((rec, index) => (
                <li key={index} className="text-sm text-green-900 font-medium flex items-start">
                  <span className="text-green-500 mr-2 mt-1 text-xs">●</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Study Plan */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
          <span className="text-2xl mr-3">📖</span>
          맞춤 학습 계획
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">일일 계획</h4>
            <p className="text-sm text-purple-900 font-medium">{result.studyPlan.daily}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">주별 계획</h4>
            <p className="text-sm text-purple-900 font-medium">{result.studyPlan.weekly}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">월별 계획</h4>
            <p className="text-sm text-purple-900 font-medium">{result.studyPlan.monthly}</p>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
          <span className="text-2xl mr-3">📚</span>
          추천 자료 및 도구
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {result.additionalResources.map((resource, index) => (
            <div key={index} className="bg-white rounded-lg p-4 flex items-start">
              <span className="text-indigo-500 mr-3 mt-1">📍</span>
              <span className="text-indigo-900 font-medium">{resource}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Actions */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
          더 자세한 도움이 필요하신가요?
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={onRequestExpertConsultation}
            className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center"
          >
            <span className="text-xl mr-2">👩‍🎓</span>
            전문가 1:1 상담 예약하기
          </button>
          
          <button
            onClick={onStartOver}
            className="bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center"
          >
            <span className="text-xl mr-2">🔄</span>
            다시 진단받기
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-800 font-medium">
            전문가 상담은 더 심층적인 분석과 맞춤형 솔루션을 제공합니다
          </p>
        </div>
      </div>
    </div>
  );
}