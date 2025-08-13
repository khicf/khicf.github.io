const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const dataDir = path.join(process.cwd(), 'data');

  // Migrate Events
  try {
    const eventsData = JSON.parse(await fs.readFile(path.join(dataDir, 'events.json'), 'utf8'));
    for (const event of eventsData) {
      await prisma.event.create({
        data: {
          title: event.title,
          date: event.date,
          time: event.time,
          description: event.description,
          location: event.location,
          contact: event.contact,
          fullDescription: event.fullDescription,
        },
      });
    }
    console.log('Events migrated successfully.');
  } catch (error) {
    console.error('Error migrating events:', error);
  }

  // Migrate Prayers and Comments
  try {
    const prayersData = JSON.parse(await fs.readFile(path.join(dataDir, 'prayers.json'), 'utf8'));
    for (const prayer of prayersData) {
      const createdPrayer = await prisma.prayer.create({
        data: {
          request: prayer.request,
          author: prayer.author,
          date: prayer.date,
        },
      });

      if (prayer.comments && prayer.comments.length > 0) {
        for (const comment of prayer.comments) {
          await prisma.comment.create({
            data: {
              text: comment.text,
              author: comment.author,
              date: comment.date,
              prayerId: createdPrayer.id,
            },
          });
        }
      }
    }
    console.log('Prayers and Comments migrated successfully.');
  } catch (error) {
    console.error('Error migrating prayers and comments:', error);
  }

  // Migrate Scriptures
  try {
    const scripturesData = JSON.parse(await fs.readFile(path.join(dataDir, 'scriptures.json'), 'utf8'));
    for (const scripture of scripturesData) {
      await prisma.scripture.create({
        data: {
          passage: scripture.passage,
          reference: scripture.reference,
          author: scripture.author,
          date: scripture.date,
        },
      });
    }
    console.log('Scriptures migrated successfully.');
  } catch (error) {
    console.error('Error migrating scriptures:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
