import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const appreciations = await prisma.appreciation.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json({ appreciations });
  } catch (error) {
    console.error('Error fetching appreciations:', error);
    return NextResponse.json({ message: 'Error fetching appreciations' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const newAppreciation = await prisma.appreciation.create({
      data: {
        message,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: 'Appreciation posted successfully!', appreciation: newAppreciation });
  } catch (error) {
    console.error('Error posting appreciation:', error);
    return NextResponse.json({ message: 'Error posting appreciation', error: error.message }, { status: 500 });
  }
}
