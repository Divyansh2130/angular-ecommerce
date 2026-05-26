import * as userService from '../../src/services/user.service.js';
import { signup, login, logout, getProfile } from '../../src/controllers/user.controller.js';
import { createMockReq, createMockRes } from '../helpers/http.js';

describe('user controller', () => {
  it('signup validates and succeeds', async () => {
    const badRes = createMockRes();
    await signup(createMockReq({ body: {} }) as any, badRes as any);
    expect(badRes.status).toHaveBeenCalledWith(400);

    const mismatchRes = createMockRes();
    await signup(
      createMockReq({ body: { name: 'n', email: 'a@b.com', password: 'a', confirmPassword: 'b' } }) as any,
      mismatchRes as any
    );
    expect(mismatchRes.status).toHaveBeenCalledWith(400);

    vi.spyOn(userService, 'signupService').mockResolvedValue({
      userId: 'u1',
      name: 'n',
      email: 'a@b.com',
      role: 'admin',
      token: 't',
    });
    const okRes = createMockRes();
    await signup(
      createMockReq({ body: { name: 'n', email: 'a@b.com', password: 'abcdef', confirmPassword: 'abcdef', role: 'admin' } }) as any,
      okRes as any
    );
    expect(okRes.status).toHaveBeenCalledWith(201);
    expect(okRes.cookie).toHaveBeenCalled();
  });

  it('login validates, succeeds and handles error', async () => {
    const badRes = createMockRes();
    await login(createMockReq({ body: {} }) as any, badRes as any);
    expect(badRes.status).toHaveBeenCalledWith(400);

    vi.spyOn(userService, 'loginService').mockResolvedValue({
      userId: 'u1',
      name: 'n',
      email: 'a@b.com',
      role: 'user',
      token: 't',
    });
    const okRes = createMockRes();
    await login(createMockReq({ body: { email: 'a@b.com', password: 'abcdef' } }) as any, okRes as any);
    expect(okRes.status).toHaveBeenCalledWith(200);

    vi.spyOn(userService, 'loginService').mockRejectedValue(new Error('x'));
    const errRes = createMockRes();
    await login(createMockReq({ body: { email: 'a@b.com', password: 'abcdef' } }) as any, errRes as any);
    expect(errRes.status).toHaveBeenCalledWith(401);
  });

  it('logout clears cookie', async () => {
    const res = createMockRes();
    await logout(createMockReq() as any, res as any);
    expect(res.clearCookie).toHaveBeenCalledWith('authToken');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getProfile validates and handles service results', async () => {
    const badRes = createMockRes();
    await getProfile(createMockReq({ userId: undefined }) as any, badRes as any);
    expect(badRes.status).toHaveBeenCalledWith(401);

    vi.spyOn(userService, 'getUserByIdService').mockResolvedValue({ _id: 'u1' } as any);
    const okRes = createMockRes();
    await getProfile(createMockReq({ userId: 'u1' }) as any, okRes as any);
    expect(okRes.status).toHaveBeenCalledWith(200);

    vi.spyOn(userService, 'getUserByIdService').mockRejectedValue(new Error('x'));
    const errRes = createMockRes();
    await getProfile(createMockReq({ userId: 'u1' }) as any, errRes as any);
    expect(errRes.status).toHaveBeenCalledWith(500);
  });
});
