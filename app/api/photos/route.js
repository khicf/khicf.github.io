import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ message: 'Error fetching photos' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const file = data.get('file');
    const caption = data.get('caption');

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(path, buffer);

    const newPhoto = await prisma.photo.create({
      data: {
        imageUrl: `/uploads/${filename}`,
        caption,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: 'Photo uploaded successfully!', photo: newPhoto });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ message: 'Error uploading photo' }, { status: 500 });
  }
}
