"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const property_routes_1 = __importDefault(require("./routes/property.routes"));
const marketplace_routes_1 = __importDefault(require("./routes/marketplace.routes"));
const watchlist_routes_1 = __importDefault(require("./routes/watchlist.routes"));
const comparison_routes_1 = __importDefault(require("./routes/comparison.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const financial_routes_1 = __importDefault(require("./routes/financial.routes"));
const rental_routes_1 = __importDefault(require("./routes/rental.routes"));
const loan_routes_1 = __importDefault(require("./routes/loan.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const document_routes_1 = __importDefault(require("./routes/document.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Enable CORS
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
// Body parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static uploads (receipts, property documents, images)
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        status: 'ONLINE',
        platform: 'PropVest – Real Estate Investment & Property Portfolio Management Platform',
        version: '1.0.0',
        currency: 'INR (₹)',
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/properties', property_routes_1.default);
app.use('/api/marketplace', marketplace_routes_1.default);
app.use('/api/watchlist', watchlist_routes_1.default);
app.use('/api/comparison', comparison_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/financials', financial_routes_1.default);
app.use('/api/rentals', rental_routes_1.default);
app.use('/api/loans', loan_routes_1.default);
app.use('/api/transactions', transaction_routes_1.default);
app.use('/api/documents', document_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// Global Error Handler
app.use((err, _req, res, _next) => {
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
exports.default = app;
