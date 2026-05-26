import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../src/models/user.model.js';
import { signupService, loginService, logoutService, getUserByIdService } from '../../src/services/user.service.js';

describe('user service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('signupService creates user and returns token', async () => {
    vi.spyOn(User, 'findOne').mockResolvedValue(null as any);
    vi.spyOn(bcryptjs, 'hash').mockResolvedValue('hashed' as any);
    vi.spyOn(jwt, 'sign').mockReturnValue('token' as any);

    const save = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(User.prototype as any, 'save').mockImplementation(save);

    const result = await signupService({ name: 'N', email: 'A@B.com', password: 'pass123', role: 'admin' });

    expect(result.email).toBe('a@b.com');
    expect(result.role).toBe('admin');
    expect(result.token).toBe('token');
  });

  it('signupService throws when user already exists', async () => {
    vi.spyOn(User, 'findOne').mockResolvedValue({ _id: 'u1' } as any);

    await expect(signupService({ name: 'N', email: 'a@b.com', password: 'pass123' })).rejects.toThrow(
      'User already exists with this email'
    );
  });

  it('loginService throws when user missing', async () => {
    vi.spyOn(User, 'findOne').mockResolvedValue(null as any);

    await expect(loginService({ email: 'a@b.com', password: 'pass123' })).rejects.toThrow('Invalid email or password');
  });

  it('loginService throws when user inactive', async () => {
    vi.spyOn(User, 'findOne').mockResolvedValue({ isActive: false } as any);

    await expect(loginService({ email: 'a@b.com', password: 'pass123' })).rejects.toThrow('User account is inactive');
  });

  it('loginService throws when password invalid', async () => {
    vi.spyOn(User, 'findOne').mockResolvedValue({ isActive: true, password: 'h' } as any);
    vi.spyOn(bcryptjs, 'compare').mockResolvedValue(false as any);

    await expect(loginService({ email: 'a@b.com', password: 'pass123' })).rejects.toThrow('Invalid email or password');
  });

  it('loginService returns token when valid', async () => {
    vi.spyOn(User, 'findOne').mockResolvedValue({ _id: 'u1', isActive: true, password: 'h', name: 'N', email: 'a@b.com', role: 'user' } as any);
    vi.spyOn(bcryptjs, 'compare').mockResolvedValue(true as any);
    vi.spyOn(jwt, 'sign').mockReturnValue('token' as any);

    const result = await loginService({ email: 'a@b.com', password: 'pass123' });

    expect(result.token).toBe('token');
  });

  it('logoutService returns message', async () => {
    await expect(logoutService()).resolves.toEqual({ message: 'User logged out successfully' });
  });

  it('getUserByIdService returns user and throws for missing', async () => {
    vi.spyOn(User, 'findById').mockReturnValue({ select: vi.fn().mockResolvedValue({ _id: 'u1' }) } as any);
    await expect(getUserByIdService('u1')).resolves.toEqual({ _id: 'u1' });

    vi.spyOn(User, 'findById').mockReturnValue({ select: vi.fn().mockResolvedValue(null) } as any);
    await expect(getUserByIdService('u2')).rejects.toThrow('User not found');
  });
});
