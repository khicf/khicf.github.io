import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  const { id } = await params;
  
  try {
    const session = await getServerSession(authOptions);
    
    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (event) {
      // If event is private and user is not logged in, return 404
      if (!event.isPublic && !session) {
        return NextResponse.json({ message: 'Event not found' }, { status: 404 });
      }
      
      return NextResponse.json({ event });
    } else {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    return NextResponse.json({ message: 'Error fetching event' }, { status: 500 });
  }
}