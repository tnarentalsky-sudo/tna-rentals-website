import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface ReviewNotificationData {
  customerName: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  vehicleType?: string;
  rentalDate?: string;
  submittedAt: Date;
}

export const sendReviewNotificationEmail = async (reviewData: ReviewNotificationData) => {
  if (!resend) {
    console.warn('Resend API key not configured. Skipping email notification.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'TNA Rentals <noreply@tnarentalsllc.com>',
      to: ['info@tnarentalsllc.com'],
      subject: `New Customer Review - ${reviewData.rating} Star${reviewData.rating !== 1 ? 's' : ''}`,
      html: generateReviewEmailHTML(reviewData),
    });

    if (error) {
      console.error('Error sending review notification email:', error);
      return { success: false, error };
    }

    console.log('Review notification email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send review notification email:', error);
    return { success: false, error };
  }
};

const generateReviewEmailHTML = (reviewData: ReviewNotificationData): string => {
  const starRating = '⭐'.repeat(reviewData.rating) + '☆'.repeat(5 - reviewData.rating);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Customer Review</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .rating { font-size: 24px; margin: 10px 0; }
        .review-text { background-color: white; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0; }
        .details { background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .detail-row { margin: 8px 0; }
        .label { font-weight: bold; color: #555; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Customer Review Received!</h1>
          <p>A customer has submitted a review for TNA Rentals LLC</p>
        </div>
        
        <div class="content">
          <div class="rating">
            <strong>Rating:</strong> ${starRating} (${reviewData.rating}/5 stars)
          </div>
          
          <div class="review-text">
            <h3>Customer Review:</h3>
            <p>"${reviewData.comment}"</p>
          </div>
          
          <div class="details">
            <h3>Customer Details:</h3>
            <div class="detail-row">
              <span class="label">Name:</span> ${reviewData.customerName}
            </div>
            ${reviewData.customerEmail ? `
            <div class="detail-row">
              <span class="label">Email:</span> ${reviewData.customerEmail}
            </div>
            ` : ''}
            ${reviewData.vehicleType ? `
            <div class="detail-row">
              <span class="label">Vehicle Rented:</span> ${reviewData.vehicleType}
            </div>
            ` : ''}
            ${reviewData.rentalDate ? `
            <div class="detail-row">
              <span class="label">Rental Date:</span> ${new Date(reviewData.rentalDate).toLocaleDateString()}
            </div>
            ` : ''}
            <div class="detail-row">
              <span class="label">Submitted:</span> ${reviewData.submittedAt.toLocaleString()}
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 6px;">
            <p><strong>Next Steps:</strong></p>
            <p>This review is awaiting approval. Log into your admin panel to review and approve it for display on your website.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendContactFormEmail = async (formData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}) => {
  if (!resend) {
    console.warn('Resend API key not configured. Skipping contact form email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'TNA Rentals <noreply@tnarentalsllc.com>',
      to: ['info@tnarentalsllc.com'],
      subject: `New Contact Form Submission${formData.subject ? ': ' + formData.subject : ''}`,
      html: generateContactEmailHTML(formData),
    });

    if (error) {
      console.error('Error sending contact form email:', error);
      return { success: false, error };
    }

    console.log('Contact form email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    return { success: false, error };
  }
};

const generateContactEmailHTML = (formData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .message-text { background-color: white; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0; }
        .details { background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .detail-row { margin: 8px 0; }
        .label { font-weight: bold; color: #555; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
          <p>Someone has contacted TNA Rentals LLC through your website</p>
        </div>
        
        <div class="content">
          ${formData.subject ? `<h3>Subject: ${formData.subject}</h3>` : ''}
          
          <div class="message-text">
            <h3>Message:</h3>
            <p>${formData.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div class="details">
            <h3>Contact Information:</h3>
            <div class="detail-row">
              <span class="label">Name:</span> ${formData.name}
            </div>
            <div class="detail-row">
              <span class="label">Email:</span> <a href="mailto:${formData.email}">${formData.email}</a>
            </div>
            ${formData.phone ? `
            <div class="detail-row">
              <span class="label">Phone:</span> <a href="tel:${formData.phone}">${formData.phone}</a>
            </div>
            ` : ''}
            <div class="detail-row">
              <span class="label">Submitted:</span> ${new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
