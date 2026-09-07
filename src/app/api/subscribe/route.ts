import { NextRequest } from 'next/server';
import { addBlogSubscriber, getBlogSubscribers } from '@/lib/subscribers';

export async function GET() {
  try {
    const subscribers = await getBlogSubscribers();
    return Response.json({ count: subscribers.length });
  } catch {
    return Response.json({ count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const subscribers = await addBlogSubscriber(email);
    return Response.json({ success: true, count: subscribers.length });
  } catch (error) {
    console.error('[subscribe] Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
