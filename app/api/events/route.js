import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const publicOnly = searchParams.get('public') === 'true';
  
  try {
    const session = await getServerSession(authOptions);
    
    // If user is logged in and publicOnly is not explicitly requested, show all events
    // If user is not logged in or publicOnly is requested, show only public events
    const events = await prisma.event.findMany({
      where: (session && !publicOnly) ? {} : { isPublic: true },
    });
    
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ message: 'Error fetching events' }, { status: 500 });
  }
}