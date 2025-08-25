'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type TestState = 'idle' | 'recording' | 'playing' | 'success' | 'error';

export default function DeviceCheckPage() {
  const [testState, setTestState] = useState<TestState>('idle');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const testScript = "안녕하세요. 수업 전 테스트 중입니다.";

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Waveform 시각화 함수
  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyser.getByteFrequencyData(dataArray);

    // 평균 오디오 레벨 계산
    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    setAudioLevel(average);

    // 캔버스 클리어
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Waveform 그리기
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255.0) * canvas.height;
      
      const hue = (i / bufferLength) * 60; // 파란색에서 초록색으로
      ctx.fillStyle = `hsl(${200 + hue}, 70%, 50%)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }

    if (testState === 'recording') {
      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    }
  };

  // 녹음 시작
  const startRecording = async () => {
    try {
      setPermissionDenied(false);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // AudioContext 설정
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // MediaRecorder 설정
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        
        // 자동 재생
        setTimeout(() => {
          playRecording(blob);
        }, 500);
      };

      setTestState('recording');
      mediaRecorder.start();
      drawWaveform();

      // 5초 후 자동 정지
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 5000);

    } catch (error) {
      console.error('마이크 접근 오류:', error);
      setPermissionDenied(true);
      setTestState('error');
    }
  };

  // 녹음 정지
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setTestState('idle');
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  // 녹음된 오디오 재생
  const playRecording = (blob?: Blob) => {
    const audioBlob = blob || recordedBlob;
    if (!audioBlob) return;

    setTestState('playing');
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      setTestState('success');
      URL.revokeObjectURL(audioUrl);
    };
    
    audio.onerror = () => {
      setTestState('error');
      URL.revokeObjectURL(audioUrl);
    };
    
    audio.play();
  };

  // 테스트 재시작
  const resetTest = () => {
    setTestState('idle');
    setRecordedBlob(null);
    setAudioLevel(0);
    setPermissionDenied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        
        {/* 헤더 영역 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mr-4">
              ← 홈으로
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">기기 상태 점검</h1>
          </div>
          <p className="text-xl text-gray-700 mb-4">내 목소리가 잘 들리는지 확인해보세요</p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            마이크로 말한 내용이 내 스피커로 들리면 수업에 적합한 상태예요.
          </p>
        </div>

        {/* 마이크 테스트 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          
          {/* 음성 안내 */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🎙️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">아래 문장을 읽어보세요:</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-lg font-medium text-blue-900">"{testScript}"</p>
            </div>
          </div>

          {/* 녹음 버튼 및 상태 */}
          <div className="text-center mb-8">
            {testState === 'idle' && (
              <button
                onClick={startRecording}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl px-12 py-6 rounded-2xl transition-all shadow-lg hover:shadow-xl"
              >
                🎙️ 녹음 시작하기
              </button>
            )}

            {testState === 'recording' && (
              <div>
                <button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold text-xl px-12 py-6 rounded-2xl transition-all shadow-lg animate-pulse"
                >
                  🔴 녹음 중... (클릭해서 정지)
                </button>
                <p className="text-sm text-gray-600 mt-4">5초 후 자동으로 정지됩니다</p>
              </div>
            )}

            {testState === 'playing' && (
              <div className="text-center">
                <div className="text-4xl mb-4 animate-pulse">🔊</div>
                <p className="text-xl font-bold text-blue-600">녹음된 음성을 재생 중...</p>
              </div>
            )}

            {testState === 'success' && (
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-2xl font-bold text-green-600 mb-4">잘 들렸어요!</p>
                <button
                  onClick={() => playRecording()}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg mr-4"
                >
                  🔊 다시 듣기
                </button>
                <button
                  onClick={resetTest}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg"
                >
                  🔁 다시 테스트
                </button>
              </div>
            )}

            {testState === 'error' && (
              <div className="text-center">
                <div className="text-6xl mb-4">❗</div>
                <p className="text-2xl font-bold text-red-600 mb-4">음성이 들리지 않아요</p>
                <button
                  onClick={resetTest}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg"
                >
                  🔁 다시 테스트하기
                </button>
              </div>
            )}
          </div>

          {/* Waveform 시각화 */}
          {(testState === 'recording' || audioLevel > 0) && (
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-900 text-center mb-4">📊 음성 입력 상태</h4>
              <div className="bg-gray-100 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={100}
                  className="w-full h-24 rounded-lg"
                />
                <div className="text-center mt-2">
                  <span className="text-sm text-gray-600">
                    음성 레벨: {Math.round(audioLevel)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 오류 시 도움말 토글 영역 */}
        {(testState === 'error' || permissionDenied) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-xl font-bold text-gray-900">문제가 생겼나요?</h3>
              <span className="text-2xl">{showHelp ? '▼' : '▶'}</span>
            </button>
            
            {showHelp && (
              <div className="mt-6 space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold text-gray-900">마이크 허용 팝업이 안 떠요</h4>
                  <p className="text-gray-700">브라우저 주소창 왼쪽의 🔒 아이콘을 클릭해서 마이크 권한을 허용해주세요.</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-bold text-gray-900">내 소리가 안 들려요</h4>
                  <p className="text-gray-700">이어폰이나 헤드셋 연결 상태를 확인하거나, 스피커 소리 크기를 확인해주세요.</p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-bold text-gray-900">여전히 문제가 있어요</h4>
                  <p className="text-gray-700">
                    기술 지원이 필요하시면{' '}
                    <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                      support@example.com
                    </a>
                    {' '}으로 문의해주세요.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 하단 요약 및 다음 단계 */}
        <div className="text-center space-y-4">
          {testState === 'success' ? (
            <div className="space-y-4">
              <Link href="/quiz" className="inline-block">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-12 py-6 rounded-2xl transition-all shadow-lg hover:shadow-xl">
                  ✅ 기기 상태 정상, 수업 시작하기
                </button>
              </Link>
              <div>
                <button
                  onClick={resetTest}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-8 py-4 rounded-lg"
                >
                  🔁 다시 테스트하기
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">
              <p>테스트를 완료하면 다음 단계로 진행할 수 있어요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
