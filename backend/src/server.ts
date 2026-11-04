import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import marketplaceRoutes from './routes/marketplace.routes';
import watchlistRoutes from './routes/watchlist.routes';
import comparisonRoutes from './routes/comparison.routes';
import analyticsRoutes from './routes/analytics.routes';
import financialRoutes from './routes/financial.routes';
import rentalRoutes from './routes/rental.routes';
import loanRoutes from './routes/loan.routes';
import transactionRoutes from './routes/transaction.routes';
import documentRoutes from './routes/document.routes';
import reportRoutes from './routes/report.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads (receipts, property documents, images)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check endpoints (Render / monitoring probes)
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ONLINE',
    platform: 'PropVest – Real Estate Investment & Property Portfolio Management Platform',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ONLINE', timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ONLINE',
    platform: 'PropVest – Real Estate Investment & Property Portfolio Management Platform',
    version: '1.0.0',
    currency: 'INR (₹)',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/financials', financialRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred.',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 PropVest Backend API is running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
});

export default app;
