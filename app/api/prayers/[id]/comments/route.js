import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
  const { id } = await params;
  try {
    const { text, author } = await request.json();
    
    const session = await getServerSession(authOptions);
    let userId = null;
    
    if (session) {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });
      if (user) {
        userId = user.id;
      }
    }

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
            userId: userId,
          },
        },
      },
      include: {
        comments: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ message: "Comment added successfully!", prayer: updatedPrayer });
  } catch (error) {
    console.error(`Error adding comment to prayer ${id}:`, error);
    return NextResponse.json({ message: 'Error adding comment' }, { status: 500 });
  }
}