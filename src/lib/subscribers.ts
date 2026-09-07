import { list, put } from '@vercel/blob';
import { blobOptions } from '@/lib/blob-client';
import { SUBSCRIBERS_BLOB_PATH } from '@/lib/blob-paths';

export type BlogSubscriber = {
  email: string;
  subscribedAt: string;
};

async function readSubscribersBlob(): Promise<BlogSubscriber[]> {
  const options = blobOptions();
  const { blobs } = await list({ prefix: SUBSCRIBERS_BLOB_PATH, ...options });
  if (!blobs.length) return [];

  const headers: HeadersInit = options.token
    ? { Authorization: `Bearer ${options.token}` }
    : {};

  const res = await fetch(blobs[0].url, { headers });

  if (!res.ok) return [];

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getBlogSubscribers(): Promise<BlogSubscriber[]> {
  const subscribers = await readSubscribersBlob();
  return subscribers.sort(
    (a, b) => Date.parse(b.subscribedAt) - Date.parse(a.subscribedAt),
  );
}

export async function addBlogSubscriber(email: string): Promise<BlogSubscriber[]> {
  const normalized = email.toLowerCase();
  const subscribers = await readSubscribersBlob();
  const exists = subscribers.some((s) => s.email.toLowerCase() === normalized);

  if (!exists) {
    subscribers.push({ email: normalized, subscribedAt: new Date().toISOString() });
    await put(SUBSCRIBERS_BLOB_PATH, JSON.stringify(subscribers), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      ...blobOptions(),
    });
  }

  return subscribers;
}

export async function deleteBlogSubscriber(email: string): Promise<void> {
  const normalized = email.toLowerCase();
  const subscribers = await readSubscribersBlob();
  const filtered = subscribers.filter((s) => s.email.toLowerCase() !== normalized);

  if (filtered.length === subscribers.length) {
    throw new Error('Subscriber not found');
  }

  await put(SUBSCRIBERS_BLOB_PATH, JSON.stringify(filtered), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    ...blobOptions(),
  });
}
