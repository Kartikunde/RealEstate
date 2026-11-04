import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';

export class NotificationController {
  /**
   * Get all notifications for current user
   */
  static async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const notifications = await prisma.notification.findMany({
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
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
    }
  }

  /**
   * Mark single notification as read
   */
  static async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      await prisma.notification.updateMany({
        where: { id, userId: req.user.id },
        data: { isRead: true },
      });

      res.status(200).json({ success: true, message: 'Notification marked as read.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update notification.' });
    }
  }

  /**
   * Mark all as read
   */
  static async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      await prisma.notification.updateMany({
        where: { userId: req.user.id },
        data: { isRead: true },
      });

      res.status(200).json({ success: true, message: 'All notifications marked as read.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update notifications.' });
    }
  }
}
