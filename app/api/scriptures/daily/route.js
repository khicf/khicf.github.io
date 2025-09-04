import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get all scriptures from the database
    const allScriptures = await prisma.scripture.findMany();
    
    if (allScriptures.length === 0) {
      return NextResponse.json({ message: 'No scriptures found' }, { status: 404 });
    }
    
    // Use current date as seed for consistent daily selection
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Create a simple hash from the date string to use as seed
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use the hash to pick a scripture (same scripture for the entire day)
    const index = Math.abs(hash) % allScriptures.length;
    const dailyScripture = allScriptures[index];
    
    return NextResponse.json({ scripture: dailyScripture });
  } catch (error) {
    console.error('Error fetching daily scripture:', error);
    return NextResponse.json({ message: 'Error fetching daily scripture' }, { status: 500 });
  }
}