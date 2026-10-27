import { signToken } from '../utils/token.js';
import { User } from '../models/user.model.js';

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const buildAuthResponse = (user) => {
  const token = signToken({ id: user._id, role: user.role });
  const sanitizedUser = user.toJSON();

  return { token, user: sanitizedUser };
};

export const register = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create(req.body);
    const { token, user: sanitizedUser } = buildAuthResponse(user);

    res.cookie('token', token, AUTH_COOKIE_OPTIONS);
    res.status(201).json({ token, user: sanitizedUser });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordValid = await user.comparePassword(req.body.password);

    if (!passwordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { token, user: sanitizedUser } = buildAuthResponse(user);

    res.cookie('token', token, AUTH_COOKIE_OPTIONS);
    res.json({ token, user: sanitizedUser });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  res.json({ user: req.user });
};

export const logout = (_req, res) => {
  res.clearCookie('token');
  res.status(204).send();
};
