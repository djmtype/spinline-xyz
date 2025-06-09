import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function POST({ request }: { request: Request }) {
  const formData = await request.formData();

  const name = formData.get('name')?.toString() ?? '';
  const email = formData.get('email')?.toString() ?? '';
  const message = formData.get('message')?.toString() ?? '';

  if (!name || !email || !message) {
    return new Response('Missing fields', { status: 400 });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Your Site <scott@spinline.xyz>', // Must be a verified domain in Resend
      to: ['scott@spinline.xyz'],
      subject: `New contact form submission from ${name}`,
      replyTo: email,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
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
