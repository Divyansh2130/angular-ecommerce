import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/product.routes.js';
import brandRoutes from './routes/brand.routes.js';
import typeRoutes from './routes/type.routes.js';
import faqRoutes from './routes/faq.routes.js';
import blogRoutes from './routes/blog.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => {
  res.send('API is running');
});

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/blogs', blogRoutes);

export default app;