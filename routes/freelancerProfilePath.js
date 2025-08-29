import express from 'express';
import {
    createOrUpdateFreelancerProfile,
    getFreelancerProfile,
    getFreelancerProfileByUserId,
    getMyFreelancerProfile,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    addReview,
    searchFreelancers
} from '../controllers/freelancerProfileController.js';
import { tokenVerification } from '../middlewares/tokenVerfication.js';
import { roleIdentification } from '../middlewares/roleIdentification.js';

const router = express.Router();

// All routes require token verification
router.use(tokenVerification);

// Create or update freelancer profile (only for freelancers)
router.post('/profile', roleIdentification(['freelancer']), createOrUpdateFreelancerProfile);
router.put('/profile', roleIdentification(['freelancer']), createOrUpdateFreelancerProfile);

// Get profile routes
router.get('/profile/me', roleIdentification(['freelancer']), getMyFreelancerProfile);
router.get('/profile/:profileId', getFreelancerProfile);
router.get('/profile/user/:userId', getFreelancerProfileByUserId);

// Portfolio management (only for freelancers)
router.post('/portfolio', roleIdentification(['freelancer']), addPortfolioItem);
router.put('/portfolio/:itemId', roleIdentification(['freelancer']), updatePortfolioItem);
router.delete('/portfolio/:itemId', roleIdentification(['freelancer']), deletePortfolioItem);

// Add review to freelancer profile
router.post('/profile/:profileId/review', addReview);

// Search freelancers (public route, but requires token)
router.get('/search', searchFreelancers);

export default router;
