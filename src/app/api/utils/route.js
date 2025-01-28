import { NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  if (action === 'templates') {
    return NextResponse.json({ templates: Object.keys(DOCUMENT_TEMPLATES) });
  }

  return NextResponse.json(
    { error: 'Invalid action' },
    { status: 400 }
  );
}