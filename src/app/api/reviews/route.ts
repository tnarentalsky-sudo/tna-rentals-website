import { NextRequest, NextResponse } from 'next/server';
import { submitReview, getApprovedReviews } from '../../../lib/firebase/firebaseUtils';
import { sendReviewNotificationEmail } from '../../../lib/email';
import { Review } from '../../../types/global';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { rating, comment, customerName, customerEmail, vehicleType, rentalDate } = body;
    
    if (!rating || !comment || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields: rating, comment, and customerName are required' },
        { status: 400 }
      );
    }

    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate comment length
    if (comment.length < 10 || comment.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be between 10 and 1000 characters' },
        { status: 400 }
      );
    }

    const reviewData: Omit<Review, 'id' | 'createdAt' | 'approved'> = {
      rating: Number(rating),
      comment: comment.trim(),
      customerName: customerName.trim(),
      customerEmail: customerEmail?.trim() || undefined,
      vehicleType: vehicleType?.trim() || undefined,
      rentalDate: rentalDate || undefined,
    };

    // Save review to Firebase
    const result = await submitReview(reviewData);
    
    // Send email notification (don't fail the request if email fails)
    try {
      await sendReviewNotificationEmail({
        ...reviewData,
        submittedAt: new Date(),
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue with success response even if email fails
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Review submitted successfully! It will be reviewed and published soon.',
      reviewId: result.id 
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reviews = await getApprovedReviews();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
