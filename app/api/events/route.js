import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get('show') === 'all';

  try {
    const events = await prisma.event.findMany({
      where: showAll ? {} : { isPublic: true },
    });
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ message: 'Error fetching events' }, { status: 500 });
  }
}