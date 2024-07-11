import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const jwtSecret = 'mysecret';

const createMovie = async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const { title, description, runtimeMins } = req.body;
    
    const createdMovie = await prisma.movie.create({
      data: {
        title,
        description,
        runtimeMins
      }
    });

    res.status(201).json({ data: createdMovie });
  } catch (error) {
    console.error('Error creating movie:', error.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export {
  createMovie
};
