import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  
  try {
    const appreciation = await prisma.appreciation.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!appreciation) {
      return NextResponse.json({ message: 'Appreciation not found' }, { status: 404 });
    }

    return NextResponse.json({ appreciation });
  } catch (error) {
    console.error(`Error fetching appreciation ${id}:`, error);
    return NextResponse.json({ message: 'Error fetching appreciation' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    const existingAppreciation = await prisma.appreciation.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: true,
      },
    });

    if (!existingAppreciation) {
      return NextResponse.json({ message: 'Appreciation not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (existingAppreciation.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden - can only edit your own appreciations' }, { status: 403 });
    }

    const updatedAppreciation = await prisma.appreciation.update({
      where: {
        id: parseInt(id),
      },
      data: {
        message,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ message: "Appreciation updated successfully!", appreciation: updatedAppreciation });
  } catch (error) {
    console.error(`Error updating appreciation ${id}:`, error);
    return NextResponse.json({ message: 'Error updating appreciation' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existingAppreciation = await prisma.appreciation.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: true,
      },
    });

    if (!existingAppreciation) {
      return NextResponse.json({ message: 'Appreciation not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (existingAppreciation.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden - can only delete your own appreciations' }, { status: 403 });
    }

    await prisma.appreciation.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: "Appreciation deleted successfully!" });
  } catch (error) {
    console.error(`Error deleting appreciation ${id}:`, error);
    return NextResponse.json({ message: 'Error deleting appreciation' }, { status: 500 });
  }
}