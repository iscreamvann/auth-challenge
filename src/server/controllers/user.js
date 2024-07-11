import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'mysecret';

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        res.status(201).json({ data: createdUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const foundUser = await prisma.user.findUnique({
            where: { username },
        });

        if (!foundUser) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const passwordsMatch = await bcrypt.compare(password, foundUser.password);

        if (!passwordsMatch) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const token = jwt.sign({ username: foundUser.username }, jwtSecret, { expiresIn: '1h' });

        res.json({ data: token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export {
    register,
    login,
};
