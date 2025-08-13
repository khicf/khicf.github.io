import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const prayers = await prisma.prayer.findMany({
      include: {
        comments: true, // Include comments for each prayer
      },
      orderBy: {
        id: 'desc', // Order by ID descending for most recent first
      },
    });
    return NextResponse.json({ prayers });
  } catch (error) {
    console.error('Error fetching prayers:', error);
    return NextResponse.json({ message: 'Error fetching prayers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { request: prayerRequest, author } = await request.json();
    const newPrayer = await prisma.prayer.create({
      data: {
        request: prayerRequest,
        author: author || 'Anonymous',
        date: new Date().toISOString().split('T')[0],
      },
    });
    return NextResponse.json({ message: "Prayer request submitted successfully!", prayer: newPrayer });
  } catch (error) {
    console.error('Error submitting prayer:', error);
    return NextResponse.json({ message: 'Error submitting prayer' }, { status: 500 });
  }
}