import {
  signupService,
  loginService,
  logoutService,
  getUserByIdService
} from '../services/user.service.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const result = await signupService({ name, email, password, role });

    // Set JWT token in httpOnly cookie
    res.cookie('authToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        userId: result.userId,
        name: result.name,
        email: result.email,
        role: result.role
      },
      token: result.token
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Signup failed'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const result = await loginService({ email, password });

    // Set JWT token in httpOnly cookie
    res.cookie('authToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: {
        userId: result.userId,
        name: result.name,
        email: result.email,
        role: result.role
      },
      token: result.token
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear auth token cookie
    res.clearCookie('authToken');

    return res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // Assumed to be set by auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User ID not found'
      });
    }

    const user = await getUserByIdService(userId);

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch profile'
    });
  }
};
