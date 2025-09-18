export const prerender = false

import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function POST({ request }: { request: Request }) {
  const formData = await request.formData();

  const name = formData.get('name')?.toString() ?? '';
  const email = formData.get('email')?.toString() ?? '';
  const message = formData.get('message')?.toString() ?? '';
  const file = formData.get('attachment') as File;

  if (!name || !email || !message || !file) {
    return new Response('Missing fields', { status: 400 });
  }

  // Validate file size (max 1MB)
  if (file.size > 1_000_000) {
    return new Response('File must be under 1MB', { status: 400 });
  }

  // Validate file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    return new Response('Invalid file type', { status: 400 });
  }

  // Read file into a Uint8Array (required for Resend)
  const arrayBuffer = await file.arrayBuffer();
 const buffer = Buffer.from(arrayBuffer);


  try {
    const { error } = await resend.emails.send({
      from: 'Your Site <scott@spinline.xyz>',
      to: ['scott@spinline.xyz'],
      subject: `New contact form submission from ${name}`,
      replyTo: email,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
      attachments: [
        {
          filename: file.name,
          content: buffer,
        },
      ],
    });

    if (error) {
      console.error(error);
      return new Response('Email failed to send', { status: 500 });
    }

    return new Response('Email sent successfully', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
}
