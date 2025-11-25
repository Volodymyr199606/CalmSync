import { PrismaClient } from "@prisma/client";
import { getAllContentItems } from "../lib/content-library";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Get all content items from the library
  const contentItems = getAllContentItems();

  console.log(`📦 Found ${contentItems.length} content items to seed`);

  // Clear existing content items (optional - use with caution in production)
  console.log("🧹 Clearing existing content items...");
  await prisma.contentItem.deleteMany({});

  // Seed content items
  console.log("🌾 Seeding content items...");
  let successCount = 0;

  for (const item of contentItems) {
    try {
      await prisma.contentItem.create({
        data: {
          id: item.id,
          type: item.type,
          title: item.title,
          url: item.url,
          content: item.content,
          description: item.description,
          feeling: item.feeling,
          tags: item.tags,
        },
      });
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to seed item ${item.id}:`, error);
    }
  }

  console.log(`✅ Successfully seeded ${successCount} content items`);
  console.log("🎉 Database seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

