import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const conversationWith = searchParams.get('with');

    let query: any = {
      $or: [
        { senderId: session.user.id },
        { receiverId: session.user.id },
      ],
    };

    if (conversationWith) {
      query.$and = [
        {
          $or: [
            { senderId: session.user.id, receiverId: conversationWith },
            { senderId: conversationWith, receiverId: session.user.id },
          ],
        },
      ];
    }

    const messages = await Message.find(query)
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .populate('listingId', 'title')
      .sort({ createdAt: 1 });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { receiverId, listingId, content } = await req.json();

    const message = await Message.create({
      senderId: session.user.id,
      receiverId,
      listingId,
      content,
    });

    await message.populate('senderId', 'name email');
    await message.populate('receiverId', 'name email');
    await message.populate('listingId', 'title');

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
