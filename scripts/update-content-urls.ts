/**
 * Script to update all content item URLs in database to match content library
 * Run with: npx tsx scripts/update-content-urls.ts
 */

import { prisma } from '../lib/prisma';
import { contentLibrary } from '../lib/content-library';

async function updateContentUrls() {
  console.log('🔄 Updating content item URLs in database...\n');

  // Get all content from library
  const allContent = [
    ...contentLibrary.natureVideos,
    ...contentLibrary.music,
    ...contentLibrary.natureSounds,
    ...contentLibrary.images,
  ];

  let updated = 0;
  let created = 0;
  let errors = 0;

  for (const contentItem of allContent) {
    try {
      // Find existing content item
      const existing = await prisma.contentItem.findFirst({
        where: {
          title: contentItem.title,
          type: contentItem.type,
        },
      });

      if (existing) {
        // Update existing item
        await prisma.contentItem.update({
          where: { id: existing.id },
          data: {
            url: contentItem.url || null,
            description: contentItem.description || null,
            tags: contentItem.tags,
            feeling: contentItem.feeling,
          },
        });
        console.log(`✅ Updated: ${contentItem.title} -> ${contentItem.url}`);
        updated++;
      } else {
        // Create new item
        await prisma.contentItem.create({
          data: {
            type: contentItem.type,
            title: contentItem.title,
            url: contentItem.url || null,
            content: contentItem.content || null,
            description: contentItem.description || null,
            feeling: contentItem.feeling,
            tags: contentItem.tags,
          },
        });
        console.log(`✨ Created: ${contentItem.title} -> ${contentItem.url}`);
        created++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${contentItem.title}:`, error);
      errors++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Created: ${created}`);
  console.log(`   Errors: ${errors}`);
  console.log(`\n✨ Done! All content items now use URLs from content library.`);
}

updateContentUrls()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

