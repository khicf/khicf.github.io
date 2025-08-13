import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { request: prayerRequest, author } = await request.json();

    const newPrayer = await prisma.prayer.create({
      data: {
        request: prayerRequest,
        author: author || 'Anonymous',
        date: new Date().toISOString().split('T')[0],
      },
    });

    return NextResponse.json({ message: "Prayer added successfully!", prayer: newPrayer });
  } catch (error) {
    console.error('Error adding prayer:', error);
    return NextResponse.json({ message: 'Error adding prayer' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, request: prayerRequest, author } = await request.json();

    const updatedPrayer = await prisma.prayer.update({
      where: { id: parseInt(id) },
      data: {
        request: prayerRequest,
        author: author || 'Anonymous',
      },
    });

    return NextResponse.json({ message: "Prayer updated successfully!", prayer: updatedPrayer });
  } catch (error) {
    console.error('Error updating prayer:', error);
    return NextResponse.json({ message: 'Error updating prayer' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    // Delete associated comments first due to foreign key constraint
    await prisma.comment.deleteMany({
      where: { prayerId: parseInt(id) },
    });

    await prisma.prayer.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Prayer deleted successfully!" });
  } catch (error) {
    console.error('Error deleting prayer:', error);
    return NextResponse.json({ message: 'Error deleting prayer' }, { status: 500 });
  }
}
