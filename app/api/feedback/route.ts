import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * To configure email sending, add these environment variables to your .env file:
 * 
 * SMTP_HOST=smtp.example.com
 * SMTP_PORT=587
 * SMTP_USER=user@example.com
 * SMTP_PASS=your_password_here
 * ADMIN_EMAIL=admin@example.com
 * 
 * For example, for Gmail:
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_USER=your.email@gmail.com
 * SMTP_PASS=your_app_password (Not your Gmail password, but an App Password)
 * ADMIN_EMAIL=admin@yourdomain.com
 */

// Email configuration - these should come from environment variables in a real app
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.example.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || 'user@example.com';
const SMTP_PASS = process.env.SMTP_PASS || 'password';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { name, email, message, rating, source } = body;

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Set up email data
    const mailOptions = {
      from: `"Website Feedback" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Feedback from ${source || 'Website'}`,
      html: `
        <h1>New Feedback Submission</h1>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Rating:</strong> ${rating} / 5</p>
        <p><strong>Source:</strong> ${source || 'Website'}</p>
        <p><strong>Message:</strong></p>
        <div style="padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          ${message.replace(/\n/g, '<br/>')}
        </div>
        <p style="color: #666; margin-top: 20px; font-size: 12px;">
          This email was sent automatically from your website feedback form.
        </p>
      `,
    };

    // In development mode, log the email instead of sending it
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - Email would be sent:', mailOptions);
    } else {
      // Send email
      await transporter.sendMail(mailOptions);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Feedback received successfully',
    });
  } catch (error: unknown) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 