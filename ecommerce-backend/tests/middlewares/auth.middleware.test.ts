import jwt from 'jsonwebtoken';
import { authenticate, authorizeRoles } from '../../src/middlewares/auth.middleware.js';
import { createMockReq, createMockRes, createMockNext } from '../helpers/http.js';

describe('auth middleware', () => {
  it('authenticate rejects when token missing', () => {
    const req = createMockReq();
    const res = createMockRes();
    const next = createMockNext();

    authenticate(req as any, res as any, next as any);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('authenticate accepts bearer token and sets user data', () => {
    const req = createMockReq({ headers: { authorization: 'Bearer abc' } });
    const res = createMockRes();
    const next = createMockNext();
    vi.spyOn(jwt, 'verify').mockReturnValue({ userId: 'u1', role: 'admin' } as any);

    authenticate(req as any, res as any, next as any);

    expect(req.userId).toBe('u1');
    expect(req.userRole).toBe('admin');
    expect(next).toHaveBeenCalled();
  });

  it('authenticate accepts cookie token', () => {
    const req = createMockReq({ cookies: { authToken: 'cookie-token' } });
    const res = createMockRes();
    const next = createMockNext();
    vi.spyOn(jwt, 'verify').mockReturnValue({ userId: 'u2', role: 'user' } as any);

    authenticate(req as any, res as any, next as any);

    expect(next).toHaveBeenCalled();
  });

  it('authenticate rejects invalid token', () => {
    const req = createMockReq({ headers: { authorization: 'Bearer bad' } });
    const res = createMockRes();
    const next = createMockNext();
    vi.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('bad');
    });

    authenticate(req as any, res as any, next as any);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('authorizeRoles allows matching role', () => {
    const req = createMockReq({ userRole: 'admin' });
    const res = createMockRes();
    const next = createMockNext();

    authorizeRoles('admin')(req as any, res as any, next as any);

    expect(next).toHaveBeenCalled();
  });

  it('authorizeRoles rejects non matching role', () => {
    const req = createMockReq({ userRole: 'user' });
    const res = createMockRes();
    const next = createMockNext();

    authorizeRoles('admin')(req as any, res as any, next as any);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
