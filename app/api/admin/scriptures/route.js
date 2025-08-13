import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { passage, reference, author } = await request.json();

    const newScripture = await prisma.scripture.create({
      data: {
        passage,
        reference,
        author,
        date: new Date().toISOString().split('T')[0],
      },
    });

    return NextResponse.json({ message: "Scripture added successfully!", scripture: newScripture });
  } catch (error) {
    console.error('Error adding scripture:', error);
    return NextResponse.json({ message: 'Error adding scripture' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, passage, reference, author } = await request.json();

    const updatedScripture = await prisma.scripture.update({
      where: { id: parseInt(id) },
      data: {
        passage,
        reference,
        author,
      },
    });

    return NextResponse.json({ message: "Scripture updated successfully!", scripture: updatedScripture });
  } catch (error) {
    console.error('Error updating scripture:', error);
    return NextResponse.json({ message: 'Error updating scripture' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    await prisma.scripture.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Scripture deleted successfully!" });
  } catch (error) {
    console.error('Error deleting scripture:', error);
    return NextResponse.json({ message: 'Error deleting scripture' }, { status: 500 });
  }
}
