import User from '../models/user.model';
import { connect } from '../mongodb/mongoose';

export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses
) => {
  try {
    // Conectar a MongoDB
    await connect();

    // Validar email_addresses
    if (!email_addresses || email_addresses.length === 0) {
      throw new Error('email_addresses is empty or invalid');
    }

    const email = email_addresses[0]?.email_address;

    if (!email) {
      throw new Error('No valid email address found');
    }

    // Crear o actualizar el usuario
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email,
        },
      },
      { upsert: true, new: true }
    );

    console.log('User Created or Updated:', user);

    return user;
  } catch (error) {
    console.error('Error: Could not create or update user:', error);
    throw error; // Re-lanzar el error para que el webhook registre el fallo
  }
};
