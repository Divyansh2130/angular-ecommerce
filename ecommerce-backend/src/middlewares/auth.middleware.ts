import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

type RequestWithAuth = Request & {
  userId?: string;
  userRole?: string;
  cookies?: {
    authToken?: string;
  };
};

type AuthTokenPayload = JwtPayload & {
  userId?: string;
  role?: string;
};

const getTokenFromRequest = (req: RequestWithAuth): string => {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  return req.cookies?.authToken || '';
};

export const authenticate = (req: RequestWithAuth, res: Response, next: NextFunction) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload !== 'string') {
      const authPayload = payload as AuthTokenPayload;
      req.userId = authPayload.userId;
      req.userRole = authPayload.role;
    }
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const authorizeRoles = (...roles: string[]) => (req: RequestWithAuth, res: Response, next: NextFunction) => {
  if (!req.userRole || !roles.includes(req.userRole)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  return next();
};
