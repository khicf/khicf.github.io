import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { newUsername } = await req.json();

  if (!newUsername || !newUsername.trim()) {
    return new Response(JSON.stringify({ message: 'Username cannot be empty' }), { status: 400 });
  }

  const trimmedUsername = newUsername.trim();

  // Check if username length is reasonable
  if (trimmedUsername.length < 1 || trimmedUsername.length > 50) {
    return new Response(JSON.stringify({ message: 'Username must be between 1 and 50 characters' }), { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
  }

  // Check if the new username is the same as the current one
  if (user.name === trimmedUsername) {
    return new Response(JSON.stringify({ message: 'New username is the same as current username' }), { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { name: trimmedUsername },
    });

    return new Response(JSON.stringify({ message: 'Username updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating username:', error);
    return new Response(JSON.stringify({ message: 'Failed to update username' }), { status: 500 });
  }
}