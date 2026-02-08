import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const listing = await Listing.findById(params.id)
      .populate('userId', 'name email')
      .populate('bundleId', 'title');

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Check and update expiry status
    const now = new Date();
    if (!listing.isExpired && now > listing.expiryDate) {
      listing.isExpired = true;
      await listing.save();
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error('Get listing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const listing = await Listing.findById(params.id);

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Listing.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
