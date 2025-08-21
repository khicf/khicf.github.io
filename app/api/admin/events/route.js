import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { title, date, time, description, location, contact, fullDescription, isPublic } = await request.json();

    const newEvent = await prisma.event.create({
      data: {
        title,
        date,
        time,
        description,
        location,
        contact,
        fullDescription,
        isPublic,
      },
    });

    return NextResponse.json({ message: "Event added successfully!", event: newEvent });
  } catch (error) {
    console.error('Error adding event:', error);
    return NextResponse.json({ message: 'Error adding event' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, title, date, time, description, location, contact, fullDescription, isPublic } = await request.json();

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        date,
        time,
        description,
        location,
        contact,
        fullDescription,
        isPublic,
      },
    });

    return NextResponse.json({ message: "Event updated successfully!", event: updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ message: 'Error updating event' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ message: 'Error deleting event' }, { status: 500 });
  }
}