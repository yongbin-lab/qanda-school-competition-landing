import { NextRequest, NextResponse } from 'next/server';

// 웨이팅 리스트 데이터 타입
interface WaitlistData {
  name: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: WaitlistData = await request.json();
    
    // 기본 검증
    if (!data.name || !data.email) {
      return NextResponse.json(
        { success: false, error: '이름과 이메일을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 노션 API 연동 (환경 변수가 설정되어 있을 때만)
    if (process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID) {
      try {
        await submitToNotion(data);
        console.log('노션에 웨이팅 리스트 등록 성공:', data.email);
      } catch (notionError) {
        console.error('노션 등록 실패:', notionError);
        // 노션 실패해도 성공으로 반환 (사용자에게는 알리지 않음)
      }
    } else {
      // 개발 환경에서는 콘솔에 로그만 출력
      console.log('웨이팅 리스트 등록 (개발 모드):', data);
    }

    return NextResponse.json({ 
      success: true, 
      message: '웨이팅 리스트 등록이 완료되었습니다!' 
    });

  } catch (error) {
    console.error('웨이팅 리스트 등록 오류:', error);
    return NextResponse.json(
      { success: false, error: '등록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 노션 API에 데이터 제출
async function submitToNotion(data: WaitlistData) {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = process.env.NOTION_DATABASE_ID;

  if (!NOTION_TOKEN || !DATABASE_ID) {
    throw new Error('노션 API 설정이 없습니다.');
  }

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: DATABASE_ID },
      properties: {
        '이름': {
          title: [
            {
              text: {
                content: data.name,
              },
            },
          ],
        },
        '이메일': {
          email: data.email,
        },
        '등록일시': {
          date: {
            start: new Date().toISOString(),
          },
        },
        '상태': {
          select: {
            name: '대기중',
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`노션 API 오류: ${response.status} - ${errorData}`);
  }

  return await response.json();
}
