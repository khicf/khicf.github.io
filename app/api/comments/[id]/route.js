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
    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        prayer: true,
      },
    });

    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ comment });
  } catch (error) {
    console.error(`Error fetching comment ${id}:`, error);
    return NextResponse.json({ message: 'Error fetching comment' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { text } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ message: 'Comment text is required' }, { status: 400 });
    }

    const existingComment = await prisma.comment.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: true,
      },
    });

    if (!existingComment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (existingComment.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden - can only edit your own comments' }, { status: 403 });
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: parseInt(id),
      },
      data: {
        text: text.trim(),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ message: "Comment updated successfully!", comment: updatedComment });
  } catch (error) {
    console.error(`Error updating comment ${id}:`, error);
    return NextResponse.json({ message: 'Error updating comment' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existingComment = await prisma.comment.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: true,
      },
    });

    if (!existingComment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (existingComment.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden - can only delete your own comments' }, { status: 403 });
    }

    await prisma.comment.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: "Comment deleted successfully!" });
  } catch (error) {
    console.error(`Error deleting comment ${id}:`, error);
    return NextResponse.json({ message: 'Error deleting comment' }, { status: 500 });
  }
}