import express from 'express';
import {
    createOrUpdateClientProfile,
    getClientProfile,
    getClientProfileByUserId,
    getMyClientProfile,
    addActiveJob,
    updateJobStatus,
    addSavedFreelancer,
    removeSavedFreelancer,
    addFreelancerReview,
    addPaymentMethod,
    addPaymentHistory
} from '../controllers/clientProfileController.js';
import { tokenVerification } from '../middlewares/tokenVerfication.js';

const router = express.Router();

// All routes require token verification
router.use(tokenVerification);

// Create or update client profile
router.post('/profile', createOrUpdateClientProfile);
router.put('/profile', createOrUpdateClientProfile);

// Get profile routes
router.get('/profile/me', getMyClientProfile);
router.get('/profile/:profileId', getClientProfile);
router.get('/profile/user/:userId', getClientProfileByUserId);

// Job management
router.post('/jobs/active', addActiveJob);
router.put('/jobs/:jobId/status', updateJobStatus);

// Saved freelancers management
router.post('/saved-freelancers', addSavedFreelancer);
router.delete('/saved-freelancers/:freelancerName', removeSavedFreelancer);

// Add review for freelancer
router.post('/reviews', addFreelancerReview);

// Payment management
router.post('/payment/methods', addPaymentMethod);
router.post('/payment/history', addPaymentHistory);

export default router;
