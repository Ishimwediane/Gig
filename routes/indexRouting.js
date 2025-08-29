// routes/indexRouting.js
import express from 'express';
import signupPath from './signupPath.js'; // Your signup routes
import signinPath from './signinpath.js'; // Your signin routes
import freelancerProfilePath from './freelancerProfilePath.js'; // Freelancer profile routes
import clientProfilePath from './clientProfilePath.js'; // Client profile routes

const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.send('Index route working!');
});

// Mount user routes at /user path
router.use('/user', signupPath);  // This handles /user/register
router.use('/user', signinPath);  // This handles /user/login

// Mount profile routes
router.use('/freelancer', freelancerProfilePath);  // This handles /freelancer/* routes
router.use('/client', clientProfilePath);  // This handles /client/* routes

export default router;