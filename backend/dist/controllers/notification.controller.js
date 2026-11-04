"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const db_1 = require("../config/db");
class NotificationController {
    /**
     * Get all notifications for current user
     */
    static async getNotifications(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const notifications = await db_1.prisma.notification.findMany({
                where: { userId: req.user.id },
                orderBy: { createdAt: 'desc' },
            });
            const unreadCount = notifications.filter((n) => !n.isRead).length;
            res.status(200).json({
                success: true,
                data: {
                    notifications,
                    unreadCount,
                },
            });
        }
        catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
        }
    }
    /**
     * Mark single notification as read
     */
    static async markAsRead(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            await db_1.prisma.notification.updateMany({
                where: { id, userId: req.user.id },
                data: { isRead: true },
            });
            res.status(200).json({ success: true, message: 'Notification marked as read.' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to update notification.' });
        }
    }
    /**
     * Mark all as read
     */
    static async markAllAsRead(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            await db_1.prisma.notification.updateMany({
                where: { userId: req.user.id },
                data: { isRead: true },
            });
            res.status(200).json({ success: true, message: 'All notifications marked as read.' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to update notifications.' });
        }
    }
}
exports.NotificationController = NotificationController;
