import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const scriptures = await prisma.scripture.findMany({
      orderBy: {
        id: 'desc', // Order by ID descending for most recent first
      },
    });
    return NextResponse.json({ scriptures });
  } catch (error) {
    console.error('Error fetching scriptures:', error);
    return NextResponse.json({ message: 'Error fetching scriptures' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { passage, reference, author } = await request.json();
    const newScripture = await prisma.scripture.create({
      data: {
        passage,
        reference,
        author,
        date: new Date().toISOString().split('T')[0],
      },
    });
    return NextResponse.json({ message: "Scripture shared successfully!", scripture: newScripture });
  } catch (error) {
    console.error('Error sharing scripture:', error);
    return NextResponse.json({ message: 'Error sharing scripture' }, { status: 500 });
  }
}