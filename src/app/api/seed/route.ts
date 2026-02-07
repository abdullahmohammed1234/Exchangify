import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Listing from '@/models/Listing';
import bcrypt from 'bcryptjs';

const demoUsers = [
  { name: 'Alex Chen', email: 'alex.chen@student.ubc.ca' },
  { name: 'Sarah Johnson', email: 'sarah.j@student.ubc.ca' },
  { name: 'Mike Williams', email: 'mike.w@student.ubc.ca' },
  { name: 'Emma Davis', email: 'emma.d@student.ubc.ca' },
];

const demoListings = [
  {
    title: 'Mini Fridge - Perfect Condition',
    description: 'Used for 1 year, works perfectly. Selling because I got a new apartment with a bigger fridge.',
    price: 45,
    category: 'Appliances',
    location: 'Gage',
    availableDate: new Date('2024-04-15'),
    imageUrl: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800',
    isMoveOutBundle: true,
  },
  {
    title: 'Desk Lamp with USB Port',
    description: 'LED desk lamp with 3 brightness levels and USB charging port. Great for late night study sessions.',
    price: 15,
    category: 'Dorm',
    location: 'Totem',
    availableDate: new Date('2024-04-10'),
    imageUrl: 'https://images.unsplash.com/photo-1507473888900-52a11b0363d9?w=800',
    isMoveOutBundle: false,
  },
  {
    title: 'Calculus Textbook - 8th Edition',
    description: 'Like new condition. No highlighting or notes. Includes access code (unused).',
    price: 65,
    category: 'Textbooks',
    location: 'Vanier',
    availableDate: new Date('2024-04-20'),
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
    isMoveOutBundle: false,
  },
  {
    title: 'FREE: Moving Boxes (10)',
    description: 'Moving out and dont need these boxes anymore. Medium size, sturdy. First come first served!',
    price: 0,
    isFree: true,
    category: 'Other',
    location: 'Orchard',
    availableDate: new Date('2024-04-12'),
    imageUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800',
    isMoveOutBundle: true,
  },
  {
    title: 'Study Desk - IKEA',
    description: 'White IKEA desk, good condition. Some minor scratches on surface. Easy to assemble/disassemble.',
    price: 35,
    category: 'Furniture',
    location: 'Kitsilano',
    availableDate: new Date('2024-04-18'),
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
    isMoveOutBundle: true,
  },
  {
    title: 'Bluetooth Headphones - Sony WH-1000XM4',
    description: 'Excellent noise cancelling headphones. Comes with case and cables. Battery life still great!',
    price: 120,
    category: 'Electronics',
    location: 'Marine',
    availableDate: new Date('2024-04-14'),
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
    isMoveOutBundle: false,
  },
  {
    title: 'Winter Coat - North Face',
    description: 'Mens medium. Warm and waterproof. Used for 2 winters.',
    price: 50,
    category: 'Clothing',
    location: 'Thunderbird',
    availableDate: new Date('2024-04-16'),
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    isMoveOutBundle: true,
  },
  {
    title: 'Coffee Maker',
    description: 'Simple drip coffee maker. Perfect for mornings before class.',
    price: 20,
    category: 'Appliances',
    location: 'Gage',
    availableDate: new Date('2024-04-11'),
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    isMoveOutBundle: false,
  },
  {
    title: 'Chemistry Lab Coat',
    description: 'Size small, barely used. Need to sell before graduation!',
    price: 15,
    category: 'Other',
    location: 'Totem',
    availableDate: new Date('2024-04-22'),
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    isMoveOutBundle: true,
  },
  {
    title: 'Gaming Monitor 24"',
    description: '144Hz refresh rate, 1ms response time. Great for gaming and productivity.',
    price: 150,
    category: 'Electronics',
    location: 'Vanier',
    availableDate: new Date('2024-04-19'),
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
    isMoveOutBundle: false,
  },
  {
    title: 'FREE: Dorm Essentials Bundle',
    description: 'Includes: shower caddy, laundry bag, desk organizer, bulletin board. Take all!',
    price: 0,
    isFree: true,
    category: 'Dorm',
    location: 'Orchard',
    availableDate: new Date('2024-04-13'),
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
    isMoveOutBundle: true,
  },
  {
    title: 'University Physics Volume 1 & 2',
    description: 'Both volumes needed for first year physics. Good condition.',
    price: 40,
    category: 'Textbooks',
    location: 'Kitsilano',
    availableDate: new Date('2024-04-21'),
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
    isMoveOutBundle: false,
  },
];

export async function GET() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});

    // Create demo users
    const users = [];
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      users.push(user);
    }

    // Create demo listings
    const listings = [];
    for (let i = 0; i < demoListings.length; i++) {
      const listing = await Listing.create({
        ...demoListings[i],
        userId: users[i % users.length]._id,
      });
      listings.push(listing);
    }

    return NextResponse.json({
      message: 'Database seeded successfully!',
      users: users.map((u) => ({ email: u.email, password: 'password123' })),
      listingsCount: listings.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();

    // Clear all demo data
    const usersDeleted = await User.deleteMany({});
    const listingsDeleted = await Listing.deleteMany({});

    return NextResponse.json({
      message: 'Demo data cleared successfully!',
      usersDeleted: usersDeleted.deletedCount,
      listingsDeleted: listingsDeleted.deletedCount,
    });
  } catch (error) {
    console.error('Clear demo data error:', error);
    return NextResponse.json({ error: 'Failed to clear demo data' }, { status: 500 });
  }
}
