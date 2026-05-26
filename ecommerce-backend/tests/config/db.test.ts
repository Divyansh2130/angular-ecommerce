import mongoose from 'mongoose';
import connectDB from '../../src/config/db.js';

describe('connectDB', () => {
  it('connects successfully', async () => {
    const connectSpy = vi.spyOn(mongoose, 'connect').mockResolvedValue({} as any);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await connectDB();

    expect(connectSpy).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(logSpy).toHaveBeenCalledWith('MongoDB Connected');
  });

  it('logs and exits on error', async () => {
    const err = new Error('failed');
    vi.spyOn(mongoose, 'connect').mockRejectedValue(err);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as any);

    await connectDB();

    expect(errorSpy).toHaveBeenCalledWith('failed');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
