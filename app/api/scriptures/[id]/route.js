import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const scripture = await prisma.scripture.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!scripture) {
      return NextResponse.json({ message: 'Scripture not found' }, { status: 404 });
    }
    return NextResponse.json(scripture);
  } catch (error) {
    console.error('Error fetching scripture:', error);
    return NextResponse.json({ message: 'Error fetching scripture' }, { status: 500 });
  }
}
