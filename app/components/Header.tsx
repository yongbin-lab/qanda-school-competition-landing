'use client';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-orange-600">
                🎓 스터디코치
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#diagnosis" className="text-gray-800 hover:text-orange-600 px-3 py-2 text-sm font-semibold transition-colors">
              학습 진단
            </a>
            <a href="#about" className="text-gray-800 hover:text-orange-600 px-3 py-2 text-sm font-semibold transition-colors">
              서비스 소개
            </a>
            <a href="#experts" className="text-gray-800 hover:text-orange-600 px-3 py-2 text-sm font-semibold transition-colors">
              전문가 상담
            </a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center">
            <button className="bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-orange-700 transition-colors">
              무료 진단 시작
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}