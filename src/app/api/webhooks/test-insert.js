import { connect } from '../../lib/mongodb/mongoose';
import User from '../../lib/models/user.model';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connect();

      // Inserta un usuario de prueba
      const newUser = await User.create({
        clerkId: 'test123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://via.placeholder.com/150',
        favs: [
          {
            movieId: '123',
            title: 'Movie 1',
            description: 'Description 1',
            dateReleased: new Date(),
            rating: 5,
            image: 'https://via.placeholder.com/150',
          },
        ],
      });

      res.status(200).json({ user: newUser });
    } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ error: 'Error inserting user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
