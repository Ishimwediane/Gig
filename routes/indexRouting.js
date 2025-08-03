// routes/indexRouting.js
import express from 'express';
import signupPath from './signupPath.js'; // Your signup routes
import signinPath from './signinpath.js'; // Your signin routes

const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.send('Index route working!');
});

// Mount user routes at /user path
router.use('/user', signupPath);  // This handles /user/register
router.use('/user', signinPath);  // This handles /user/login

export default router;