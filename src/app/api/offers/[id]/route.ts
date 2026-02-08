import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Offer from '@/models/Offer';
import Listing from '@/models/Listing';

// GET single offer
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const offer = await Offer.findById(params.id)
      .populate('listingId', 'title price imageUrl imageUrls')
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email');

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Check if user is buyer or seller
    if (
      offer.buyerId._id.toString() !== session.user.id &&
      offer.sellerId._id.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ offer });
  } catch (error) {
    console.error('Get offer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update offer status (accept, reject, counter, withdraw)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, counterPrice } = await req.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const validStatuses = ['accepted', 'rejected', 'countered', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectDB();

    const offer = await Offer.findById(params.id);

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Check permissions
    if (status === 'withdrawn') {
      // Only buyer can withdraw
      if (offer.buyerId.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Only the buyer can withdraw an offer' }, { status: 403 });
      }
    } else if (status === 'accepted' || status === 'countered') {
      // Only seller can accept or counter
      if (offer.sellerId.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Only the seller can accept or counter an offer' }, { status: 403 });
      }
    } else if (status === 'rejected') {
      // Both buyer and seller can reject
      if (
        offer.buyerId.toString() !== session.user.id &&
        offer.sellerId.toString() !== session.user.id
      ) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Update offer
    offer.status = status;
    if (status === 'countered' && counterPrice !== undefined) {
      offer.counterPrice = counterPrice;
    }

    await offer.save();

    // If offer is accepted, mark listing as expired
    if (status === 'accepted') {
      await Listing.findByIdAndUpdate(offer.listingId, { isExpired: true });
    }

    return NextResponse.json({ offer, message: `Offer ${status} successfully` });
  } catch (error) {
    console.error('Update offer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete an offer (only if pending)
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

    const offer = await Offer.findById(params.id);

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Only buyer can delete their pending offer
    if (offer.buyerId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (offer.status !== 'pending') {
      return NextResponse.json({ error: 'Cannot delete a processed offer' }, { status: 400 });
    }

    await Offer.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Delete offer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
