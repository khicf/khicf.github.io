import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
  const { id } = params;
  try {
    const { text, author } = await request.json();

    const updatedPrayer = await prisma.prayer.update({
      where: {
        id: parseInt(id),
      },
      data: {
        comments: {
          create: {
            text: text,
            author: author || 'Anonymous',
            date: new Date().toISOString().split('T')[0],
          },
        },
      },
      include: {
        comments: true,
      },
    });

    return NextResponse.json({ message: "Comment added successfully!", prayer: updatedPrayer });
  } catch (error) {
    console.error(`Error adding comment to prayer ${id}:`, error);
    return NextResponse.json({ message: 'Error adding comment' }, { status: 500 });
  }
}