import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createOrUpdateUser, deleteUser } from '../../lib/actions/users';

export async function POST(req) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.error('Error: SIGNING_SECRET is not defined');
    return new Response('Error: SIGNING_SECRET is not defined', { status: 400 });
  }

  const wh = new Webhook(SIGNING_SECRET);

  try {
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Error: Missing Svix headers');
      return new Response('Error: Missing Svix headers', { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    console.log('Webhook received:', payload);

    const evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });

    console.log('Webhook verified:', evt);

    const { id } = evt?.data;
    const eventType = evt?.type;

    if (!id || !eventType) {
      console.error('Error: Missing required event data');
      return new Response('Error: Missing required event data', { status: 400 });
    }

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { first_name, last_name, image_url, email_addresses } = evt?.data;

      if (!first_name || !last_name || !image_url || !email_addresses) {
        console.error('Error: Missing user data in payload');
        return new Response('Error: Missing user data in payload', { status: 400 });
      }

      try {
        const user = await createOrUpdateUser(
          id,
          first_name,
          last_name,
          image_url,
          email_addresses
        );
        console.log(`User ${eventType} processed successfully:`, user);
      } catch (error) {
        console.error('Error: Could not create or update user:', error);
        return new Response('Error: Could not create or update user', {
          status: 400,
        });
      }
    }

    if (eventType === 'user.deleted') {
      try {
        await deleteUser(id);
        console.log(`User deleted successfully: ${id}`);
      } catch (error) {
        console.error('Error: Could not delete user:', error);
        return new Response('Error: Could not delete user', { status: 400 });
      }
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(`Error: ${error.message}`, { status: 400 });
  }
}
