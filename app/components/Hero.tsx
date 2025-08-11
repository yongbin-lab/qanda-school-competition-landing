interface HeroProps {
  onStartDiagnosis: () => void;
}

export default function Hero({ onStartDiagnosis }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-red-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            내 아이의 학습,
            <br />
            <span className="text-orange-600">정확한 진단</span>이 먼저입니다
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 font-medium mb-8 max-w-3xl mx-auto">
            현재 학습 상태를 정확히 파악하고, AI와 전문가가 제공하는 
            맞춤형 솔루션으로 학습 효과를 극대화하세요.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">전문 학습 진단</h3>
              <p className="text-gray-800 text-sm font-medium">현재 상황을 입력하면 즉시 맞춤형 분석 결과를 제공</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-3">👩‍🎓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">교육 전문가 컨설팅</h3>
              <p className="text-gray-800 text-sm font-medium">학습 전문가와 1:1 맞춤 상담으로 심층 분석</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">체계적 학습 솔루션</h3>
              <p className="text-gray-800 text-sm font-medium">단계별 학습 계획과 구체적인 실행 방법 제시</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartDiagnosis}
              className="bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
            >
              📖 무료 학습 진단 시작하기
            </button>
            <button className="bg-white text-orange-700 border-2 border-orange-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-50 transition-colors">
              🎯 전문가 상담 예약
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">⭐</span>
              <span>평균 만족도 4.9/5</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-1">✅</span>
              <span>1,000+ 학습 개선 사례</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-1">🎯</span>
              <span>평균 성적 향상 15%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}