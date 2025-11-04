import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail } from '../../../lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { firstName, lastName, email, phone, rentalDates, message } = body;
    
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: first name, last name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      );
    }

    const contactData = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      phone: phone?.trim() || undefined,
      message: message.trim(),
      subject: rentalDates ? `Rental Inquiry - ${rentalDates}` : 'Contact Form Inquiry',
    };

    // Send email notification
    const emailResult = await sendContactFormEmail(contactData);
    
    if (!emailResult.success) {
      console.error('Failed to send contact form email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again or contact us directly.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your message! We\'ll get back to you within 2 hours.',
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
