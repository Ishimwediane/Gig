import ClientProfile from "../models/clientProfileModel.js";
import User from "../models/signupModel.js";

// Create or update client profile
export const createOrUpdateClientProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From token verification middleware
        const profileData = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if profile already exists
        let profile = await ClientProfile.findOne({ userId });

        if (profile) {
            // Update existing profile
            profile = await ClientProfile.findOneAndUpdate(
                { userId },
                profileData,
                { new: true, runValidators: true }
            );
            return res.status(200).json({
                message: "Profile updated successfully",
                profile
            });
        } else {
            // Create new profile
            profile = new ClientProfile({
                userId,
                ...profileData
            });
            await profile.save();

            return res.status(201).json({
                message: "Profile created successfully",
                profile
            });
        }
    } catch (error) {
        console.error("Error in createOrUpdateClientProfile:", error);
        res.status(500).json({
            message: "Failed to create/update profile",
            error: error.message
        });
    }
};

// Get client profile by ID
export const getClientProfile = async (req, res) => {
    try {
        const { profileId } = req.params;
        
        const profile = await ClientProfile.findById(profileId)
            .populate('userId', 'Name Email Role');

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error("Error in getClientProfile:", error);
        res.status(500).json({
            message: "Failed to get profile",
            error: error.message
        });
    }
};

// Get client profile by user ID
export const getClientProfileByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const profile = await ClientProfile.findOne({ userId })
            .populate('userId', 'Name Email Role');

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error("Error in getClientProfileByUserId:", error);
        res.status(500).json({
            message: "Failed to get profile",
            error: error.message
        });
    }
};

// Get current user's client profile
export const getMyClientProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const profile = await ClientProfile.findOne({ userId })
            .populate('userId', 'Name Email Role');

        if (!profile) {
            return res.status(404).json({ message: "Profile not found. Please create your profile first." });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error("Error in getMyClientProfile:", error);
        res.status(500).json({
            message: "Failed to get profile",
            error: error.message
        });
    }
};

// Add active job
export const addActiveJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobData = req.body;

        const profile = await ClientProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found. Please create your profile first." });
        }

        profile.jobManagement.activeJobs.push(jobData);
        await profile.save();

        res.status(200).json({
            message: "Active job added successfully",
            activeJobs: profile.jobManagement.activeJobs
        });
    } catch (error) {
        console.error("Error in addActiveJob:", error);
        res.status(500).json({
            message: "Failed to add active job",
            error: error.message
        });
    }
};

// Update job status
export const updateJobStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobId } = req.params;
        const { status } = req.body;

        const profile = await ClientProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const job = profile.jobManagement.activeJobs.id(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        job.status = status;
        
        // If job is completed, move it to past jobs
        if (status === "Completed") {
            profile.jobManagement.pastJobs.push({
                title: job.title,
                freelancer: job.freelancer,
                status: "Completed",
                date: new Date()
            });
            profile.jobManagement.activeJobs = profile.jobManagement.activeJobs.filter(
                j => j._id.toString() !== jobId
            );
        }

        await profile.save();

        res.status(200).json({
            message: "Job status updated successfully",
            activeJobs: profile.jobManagement.activeJobs,
            pastJobs: profile.jobManagement.pastJobs
        });
    } catch (error) {
        console.error("Error in updateJobStatus:", error);
        res.status(500).json({
            message: "Failed to update job status",
            error: error.message
        });
    }
};

// Add saved freelancer
export const addSavedFreelancer = async (req, res) => {
    try {
        const userId = req.user.id;
        const { freelancerName } = req.body;

        const profile = await ClientProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found. Please create your profile first." });
        }

        if (!profile.savedFreelancers.includes(freelancerName)) {
            profile.savedFreelancers.push(freelancerName);
            await profile.save();
        }

        res.status(200).json({
            message: "Freelancer saved successfully",
            savedFreelancers: profile.savedFreelancers
        });
    } catch (error) {
        console.error("Error in addSavedFreelancer:", error);
        res.status(500).json({
            message: "Failed to save freelancer",
            error: error.message
        });
    }
};

// Remove saved freelancer
export const removeSavedFreelancer = async (req, res) => {
    try {
        const userId = req.user.id;
        const { freelancerName } = req.params;

        const profile = await ClientProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        profile.savedFreelancers = profile.savedFreelancers.filter(
            name => name !== freelancerName
        );
        await profile.save();

        res.status(200).json({
            message: "Freelancer removed from saved list",
            savedFreelancers: profile.savedFreelancers
        });
    } catch (error) {
        console.error("Error in removeSavedFreelancer:", error);
        res.status(500).json({
            message: "Failed to remove freelancer",
            error: error.message
        });
    }
};

// Add review for freelancer
export const addFreelancerReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const review = req.body;

        const profile = await ClientProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found. Please create your profile first." });
        }

        profile.reviews.push(review);
        await profile.save();

        res.status(200).json({
            message: "Review added successfully",
            reviews: profile.reviews
        });
    } catch (error) {
        console.error("Error in addFreelancerReview:", error);
        res.status(500).json({
            message: "Failed to add review",
            error: error.message
        });
    }
};

// Add payment method
export const addPaymentMethod = async (req, res) => {
    try {
        const userId = req.user.id;
        const { method } = req.body;

        const profile = await ClientProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found. Please create your profile first." });
        }

        if (!profile.payment.methods.includes(method)) {
            profile.payment.methods.push(method);
            await profile.save();
        }

        res.status(200).json({
            message: "Payment method added successfully",
            paymentMethods: profile.payment.methods
        });
    } catch (error) {
        console.error("Error in addPaymentMethod:", error);
        res.status(500).json({
            message: "Failed to add payment method",
            error: error.message
        });
    }
};

// Add payment history
export const addPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const paymentData = req.body;

        const profile = await ClientProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found. Please create your profile first." });
        }

        profile.payment.history.push(paymentData);
        await profile.save();

        res.status(200).json({
            message: "Payment history added successfully",
            paymentHistory: profile.payment.history
        });
    } catch (error) {
        console.error("Error in addPaymentHistory:", error);
        res.status(500).json({
            message: "Failed to add payment history",
            error: error.message
        });
    }
};
