import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';
const JWT_EXPIRE = (process.env.JWT_EXPIRE || '7d') as jwt.SignOptions['expiresIn'];

type SignupInput = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthResult = {
  userId: unknown;
  name: string;
  email: string;
  role: string;
  token: string;
};

export const signupService = async ({ name, email, password, role = 'user' }: SignupInput): Promise<AuthResult> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user (enforce role to be 'admin' or 'user' only)
  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role === 'admin' ? 'admin' : 'user', // Ensure only admin or user
    isActive: true
  });

  await newUser.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: newUser._id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );

  return {
    userId: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token
  };
};

export const loginService = async ({ email, password }: LoginInput): Promise<AuthResult> => {
  // Check if user exists
  const user = await User.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error('User account is inactive');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );

  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  };
};

export const logoutService = async () => {
  // Logout logic (token invalidation happens on client by removing token)
  // Can be extended to add token to blacklist if needed
  return { message: 'User logged out successfully' };
};

export const getUserByIdService = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
