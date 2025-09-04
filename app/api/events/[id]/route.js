import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (event) {
      return NextResponse.json({ event });
    } else {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    return NextResponse.json({ message: 'Error fetching event' }, { status: 500 });
  }
}