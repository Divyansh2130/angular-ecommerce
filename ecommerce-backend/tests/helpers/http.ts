import { vi } from 'vitest';

export const createMockReq = (overrides: any = {}) => ({
  params: {},
  query: {},
  body: {},
  headers: {},
  cookies: {},
  ...overrides,
});

export const createMockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
};

export const createMockNext = () => vi.fn();
