import jwt from 'jsonwebtoken';

const generateToken = (userId, expiresIn = '7d') =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn });

export default generateToken;
