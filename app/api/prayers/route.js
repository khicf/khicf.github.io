import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const isPublic = searchParams.get('public');

  try {
    let prayers;
    if (isPublic === 'true') {
      prayers = await prisma.prayer.findMany({
        where: {
          isPublic: true,
        },
        include: {
          comments: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    } else {
      prayers = await prisma.prayer.findMany({
        include: {
          comments: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    }
    return NextResponse.json({ prayers });
  } catch (error) {
    console.error('Error fetching prayers:', error);
    return NextResponse.json({ message: 'Error fetching prayers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { request: prayerRequest, author, isPublic } = await request.json();
    const newPrayer = await prisma.prayer.create({
      data: {
        request: prayerRequest,
        author: author || 'Anonymous',
        date: new Date().toISOString().split('T')[0],
        isPublic: isPublic,
      },
    });
    return NextResponse.json({ message: "Prayer request submitted successfully!", prayer: newPrayer });
  } catch (error) {
    console.error('Error submitting prayer:', error);
    return NextResponse.json({ message: 'Error submitting prayer' }, { status: 500 });
  }
}