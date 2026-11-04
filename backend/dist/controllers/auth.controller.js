"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
class AuthController {
    /**
     * User Registration
     */
    static async register(req, res) {
        try {
            const { name, email, password, phone, role } = req.body;
            const existingUser = await db_1.prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
            });
            if (existingUser) {
                res.status(409).json({ success: false, message: 'An account with this email already exists.' });
                return;
            }
            const passwordHash = await bcryptjs_1.default.hash(password, 10);
            const user = await db_1.prisma.user.create({
                data: {
                    name,
                    email: email.toLowerCase().trim(),
                    passwordHash,
                    phone: phone || null,
                    role: role === 'ADMIN' ? 'ADMIN' : 'USER',
                    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=14213D&color=fff`,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    avatarUrl: true,
                    createdAt: true,
                },
            });
            const secret = process.env.JWT_SECRET || 'propvest_super_secret_jwt_key_2026_fintech_production';
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                data: { user, token },
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ success: false, message: 'Failed to register user.' });
        }
    }
    /**
     * User Login
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await db_1.prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
            });
            if (!user) {
                res.status(401).json({ success: false, message: 'Invalid email or password.' });
                return;
            }
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                res.status(401).json({ success: false, message: 'Invalid email or password.' });
                return;
            }
            const secret = process.env.JWT_SECRET || 'propvest_super_secret_jwt_key_2026_fintech_production';
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        phone: user.phone,
                        role: user.role,
                        avatarUrl: user.avatarUrl,
                        createdAt: user.createdAt,
                    },
                    token,
                },
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, message: 'An error occurred during sign in.' });
        }
    }
    /**
     * Current Authenticated User Profile
     */
    static async getMe(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const user = await db_1.prisma.user.findUnique({
                where: { id: req.user.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    avatarUrl: true,
                    createdAt: true,
                    _count: {
                        select: {
                            properties: true,
                            financials: true,
                            loans: true,
                            watchlist: true,
                        },
                    },
                },
            });
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
        }
    }
    /**
     * Update Profile
     */
    static async updateProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { name, phone, avatarUrl } = req.body;
            const updated = await db_1.prisma.user.update({
                where: { id: req.user.id },
                data: {
                    name: name || undefined,
                    phone: phone !== undefined ? phone : undefined,
                    avatarUrl: avatarUrl || undefined,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    avatarUrl: true,
                },
            });
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updated,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to update profile.' });
        }
    }
    /**
     * Change Password
     */
    static async changePassword(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { currentPassword, newPassword } = req.body;
            const user = await db_1.prisma.user.findUnique({
                where: { id: req.user.id },
            });
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            const isMatch = await bcryptjs_1.default.compare(currentPassword, user.passwordHash);
            if (!isMatch) {
                res.status(400).json({ success: false, message: 'Incorrect current password.' });
                return;
            }
            const newPasswordHash = await bcryptjs_1.default.hash(newPassword, 10);
            await db_1.prisma.user.update({
                where: { id: req.user.id },
                data: { passwordHash: newPasswordHash },
            });
            res.status(200).json({ success: true, message: 'Password updated successfully.' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to change password.' });
        }
    }
    /**
     * Forgot Password Workflow
     */
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await db_1.prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
            });
            // Always return a positive message for security
            res.status(200).json({
                success: true,
                message: user
                    ? 'Password reset instructions have been generated. (In demo environment: use Demo@123 or reset password).'
                    : 'If an account exists with this email, instructions have been sent.',
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to process request.' });
        }
    }
}
exports.AuthController = AuthController;
