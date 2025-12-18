import { PrismaClient, UpdateType, UpdateStatus } from '@prisma/client';

export async function seedUpdates(prismaClient?: PrismaClient) {
  const prisma = prismaClient || new PrismaClient();
  
  console.log('📰 Seeding updates...');

  // Find the first admin user to be the author
  const adminUser = await prisma.user.findFirst({
    where: {
      userRoles: {
        some: {
          role: {
            name: 'admin',
          },
        },
      },
    },
  });

  if (!adminUser) {
    console.warn('⚠️  No admin user found - skipping update seeding');
    return;
  }

  const updates = [
    {
      type: UpdateType.NEWS,
      title: 'New Platform Features Released',
      description: 'We\'ve released several new features to improve your experience, including enhanced search and better mobile support.',
      content: `We're excited to announce the release of several new features designed to make your experience even better.

**What's New:**
- Enhanced search functionality with filters
- Improved mobile responsiveness
- Dark mode support
- Performance optimizations

These updates are available now to all users. Visit our documentation to learn more about each feature.`,
      status: UpdateStatus.PUBLISHED,
      featured: true,
      tags: ['features', 'release', 'product'],
      publishedAt: new Date(),
    },
    {
      type: UpdateType.CASE_STUDY,
      title: 'How Company X Improved Efficiency by 40%',
      description: 'Learn how Company X used our platform to streamline their workflow and achieve significant productivity gains.',
      content: `Company X was struggling with inefficient processes that were costing them time and money. After implementing our platform, they saw remarkable improvements.

**The Challenge:**
Company X had fragmented systems that made collaboration difficult and slowed down decision-making.

**The Solution:**
By consolidating their workflows on our platform, they were able to centralize information and improve team coordination.

**The Results:**
- 40% increase in operational efficiency
- 25% reduction in project delivery time
- Improved team satisfaction scores

Read the full case study to learn more about their journey and the strategies they used.`,
      status: UpdateStatus.PUBLISHED,
      featured: false,
      tags: ['case-study', 'success-story', 'efficiency'],
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
      type: UpdateType.DISCUSSION,
      title: 'Best Practices for Team Collaboration',
      description: 'Join the conversation about effective team collaboration strategies and share your experiences.',
      content: `We want to hear from our community about what works best for team collaboration.

**Discussion Topics:**
- What tools and processes do you use for team communication?
- How do you handle remote collaboration challenges?
- What are your tips for keeping teams aligned on goals?

Share your thoughts in the comments below. We'll compile the best insights into a future guide.

**Community Guidelines:**
Please keep discussions respectful and on-topic. We're here to learn from each other's experiences.`,
      status: UpdateStatus.PUBLISHED,
      featured: false,
      tags: ['discussion', 'collaboration', 'community'],
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      type: UpdateType.EVENT,
      title: 'Quarterly Product Webinar',
      description: 'Join us for our quarterly webinar where we\'ll showcase new features and answer your questions live.',
      content: `You're invited to our quarterly product webinar!

**Date:** ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
**Time:** 2:00 PM - 3:30 PM EST

**What to Expect:**
- Product roadmap updates
- Live demos of new features
- Q&A session with our product team
- Networking opportunity with other users

**Registration:**
Space is limited. Register early to secure your spot.

We look forward to seeing you there!`,
      status: UpdateStatus.PUBLISHED,
      featured: true,
      tags: ['event', 'webinar', 'product'],
      eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      publishedAt: new Date(),
    },
    {
      type: UpdateType.ANNOUNCEMENT,
      title: 'Scheduled Maintenance - December 25th',
      description: 'Our platform will undergo scheduled maintenance on December 25th from 2:00 AM to 4:00 AM EST.',
      content: `**Important Notice**

We will be performing scheduled maintenance to improve system performance and reliability.

**Maintenance Window:**
- Date: December 25, 2025
- Time: 2:00 AM - 4:00 AM EST
- Expected Duration: 2 hours

**What to Expect:**
- The platform will be temporarily unavailable during this window
- All data will be preserved
- No action is required on your part

**After Maintenance:**
You'll notice improved performance and stability. We apologize for any inconvenience and appreciate your patience.

If you have questions, please contact our support team.`,
      status: UpdateStatus.PUBLISHED,
      featured: false,
      tags: ['maintenance', 'announcement', 'system'],
      expiresAt: new Date('2025-12-26'), // Expires after maintenance is done
      publishedAt: new Date(),
    },
  ];

  // Create or update each update
  for (const updateData of updates) {
    // Check if update already exists
    const existing = await prisma.update.findFirst({
      where: {
        title: updateData.title,
        type: updateData.type,
      },
    });

    let update;
    if (existing) {
      // Update existing
      update = await prisma.update.update({
        where: { id: existing.id },
        data: {
          ...updateData,
          authorId: adminUser.id,
        },
      });
    } else {
      // Create new
      update = await prisma.update.create({
        data: {
          ...updateData,
          authorId: adminUser.id,
        },
      });
    }
    console.log(`  ✓ Update: ${update.type} - "${update.title}"`);
  }

  console.log(`✅ Created/updated ${updates.length} updates\n`);
}

// Allow running this file directly
if (require.main === module) {
  const prisma = new PrismaClient();
  
  seedUpdates(prisma)
    .then(() => {
      console.log('✅ Update seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error seeding updates:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
