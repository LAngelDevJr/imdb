import mongoose from 'mongoose';
let initialized = false;

export const connect = async () => {
  mongoose.set('strictQuery', true);

  // Verificar si la conexión ya está inicializada
  if (initialized) {
    console.log('MongoDB already connected');
    return;
  }

  // Verificar si la URI de conexión está configurada
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in environment variables');
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'next-imdb-clerk', // Nombre de la base de datos
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    initialized = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; // Re-lanzar el error para que sea registrado en los logs
  }
};
