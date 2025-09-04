import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Check if user has admin privileges (CORE or ADMIN role)
async function checkAdminAccess(session) {
  if (!session) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true, approved: true }
  });

  return user && user.approved && (user.role === 'CORE' || user.role === 'ADMIN');
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !(await checkAdminAccess(session))) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, message } = await request.json();

    if (!id || !message) {
      return NextResponse.json({ message: 'ID and message are required' }, { status: 400 });
    }

    const updatedAppreciation = await prisma.appreciation.update({
      where: { id: parseInt(id) },
      data: { message },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ message: 'Appreciation updated successfully', appreciation: updatedAppreciation });
  } catch (error) {
    console.error('Error updating appreciation:', error);
    return NextResponse.json({ message: 'Error updating appreciation', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !(await checkAdminAccess(session))) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    await prisma.appreciation.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Appreciation deleted successfully' });
  } catch (error) {
    console.error('Error deleting appreciation:', error);
    return NextResponse.json({ message: 'Error deleting appreciation', error: error.message }, { status: 500 });
  }
}