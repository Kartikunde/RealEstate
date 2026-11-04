import { Router } from 'express';
import { WatchlistController } from '../controllers/watchlist.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJwt);

router.get('/', WatchlistController.getWatchlist);
router.post('/', WatchlistController.addToWatchlist);
router.delete('/:listingId', WatchlistController.removeFromWatchlist);

export default router;
