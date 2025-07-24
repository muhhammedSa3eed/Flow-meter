import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  try {
    const { tags, secret } = await req.json();

    if (secret !== process.env.REVALIDATE_SECRET) {
      return new Response('Invalid secret', { status: 401 });
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return new Response('Missing or invalid "tags" array', { status: 400 });
    }

    for (const tag of tags) {
      await revalidateTag(tag);
      console.log(`✅ Revalidated tag: ${tag}`);
    }

    return new Response(`Revalidated tags: ${tags.join(', ')}`, {
      status: 200,
    });
  } catch (err) {
    console.error('❌ Revalidation error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
