import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = await params;
  
  try {
    const prayer = await prisma.prayer.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        comments: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!prayer) {
      return NextResponse.json({ message: 'Prayer not found' }, { status: 404 });
    }

    return NextResponse.json({ prayer });
  } catch (error) {
    console.error(`Error fetching prayer ${id}:`, error);
    return NextResponse.json({ message: 'Error fetching prayer' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { request: prayerRequest, isPublic } = await request.json();

    const existingPrayer = await prisma.prayer.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: true,
      },
    });

    if (!existingPrayer) {
      return NextResponse.json({ message: 'Prayer not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (existingPrayer.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden - can only edit your own prayers' }, { status: 403 });
    }

    const updatedPrayer = await prisma.prayer.update({
      where: {
        id: parseInt(id),
      },
      data: {
        request: prayerRequest,
        isPublic: isPublic,
      },
      include: {
        comments: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ message: "Prayer updated successfully!", prayer: updatedPrayer });
  } catch (error) {
    console.error(`Error updating prayer ${id}:`, error);
    return NextResponse.json({ message: 'Error updating prayer' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existingPrayer = await prisma.prayer.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: true,
      },
    });

    if (!existingPrayer) {
      return NextResponse.json({ message: 'Prayer not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (existingPrayer.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden - can only delete your own prayers' }, { status: 403 });
    }

    await prisma.prayer.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: "Prayer deleted successfully!" });
  } catch (error) {
    console.error(`Error deleting prayer ${id}:`, error);
    return NextResponse.json({ message: 'Error deleting prayer' }, { status: 500 });
  }
}