import FreelancerProfile from "../models/freelancerProfileModel.js";
import User from "../models/signupModel.js";

// Create or update freelancer profile
export const createOrUpdateFreelancerProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From token verification middleware
        const profileData = req.body;

        // Check if user exists and is a freelancer
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.Role !== "freelancer") {
            return res.status(403).json({ message: "Only freelancers can create/update freelancer profiles" });
        }

        // Check if profile already exists
        let profile = await FreelancerProfile.findOne({ userId });

        if (profile) {
            // Update existing profile
            profile = await FreelancerProfile.findOneAndUpdate(
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
            profile = new FreelancerProfile({
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
        console.error("Error in createOrUpdateFreelancerProfile:", error);
        res.status(500).json({
            message: "Failed to create/update profile",
            error: error.message
        });
    }
};

// Get freelancer profile by ID
export const getFreelancerProfile = async (req, res) => {
    try {
        const { profileId } = req.params;
        
        const profile = await FreelancerProfile.findById(profileId)
            .populate('userId', 'Name Email Role');

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error("Error in getFreelancerProfile:", error);
        res.status(500).json({
            message: "Failed to get profile",
            error: error.message
        });
    }
};

// Get freelancer profile by user ID
export const getFreelancerProfileByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const profile = await FreelancerProfile.findOne({ userId })
            .populate('userId', 'Name Email Role');

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error("Error in getFreelancerProfileByUserId:", error);
        res.status(500).json({
            message: "Failed to get profile",
            error: error.message
        });
    }
};

// Get current user's freelancer profile
export const getMyFreelancerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const profile = await FreelancerProfile.findOne({ userId })
            .populate('userId', 'Name Email Role');

        if (!profile) {
            return res.status(404).json({ message: "Profile not found. Please create your profile first." });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error("Error in getMyFreelancerProfile:", error);
        res.status(500).json({
            message: "Failed to get profile",
            error: error.message
        });
    }
};

// Add portfolio item
export const addPortfolioItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const portfolioItem = req.body;

        const profile = await FreelancerProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found. Please create your profile first." });
        }

        profile.portfolio.push(portfolioItem);
        await profile.save();

        res.status(200).json({
            message: "Portfolio item added successfully",
            portfolio: profile.portfolio
        });
    } catch (error) {
        console.error("Error in addPortfolioItem:", error);
        res.status(500).json({
            message: "Failed to add portfolio item",
            error: error.message
        });
    }
};

// Update portfolio item
export const updatePortfolioItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const updates = req.body;

        const profile = await FreelancerProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const portfolioItem = profile.portfolio.id(itemId);
        if (!portfolioItem) {
            return res.status(404).json({ message: "Portfolio item not found" });
        }

        Object.assign(portfolioItem, updates);
        await profile.save();

        res.status(200).json({
            message: "Portfolio item updated successfully",
            portfolio: profile.portfolio
        });
    } catch (error) {
        console.error("Error in updatePortfolioItem:", error);
        res.status(500).json({
            message: "Failed to update portfolio item",
            error: error.message
        });
    }
};

// Delete portfolio item
export const deletePortfolioItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        const profile = await FreelancerProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        profile.portfolio = profile.portfolio.filter(item => item._id.toString() !== itemId);
        await profile.save();

        res.status(200).json({
            message: "Portfolio item deleted successfully",
            portfolio: profile.portfolio
        });
    } catch (error) {
        console.error("Error in deletePortfolioItem:", error);
        res.status(500).json({
            message: "Failed to delete portfolio item",
            error: error.message
        });
    }
};

// Add review
export const addReview = async (req, res) => {
    try {
        const { profileId } = req.params;
        const review = req.body;

        const profile = await FreelancerProfile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        profile.reviews.push(review);
        await profile.save();

        res.status(200).json({
            message: "Review added successfully",
            reviews: profile.reviews
        });
    } catch (error) {
        console.error("Error in addReview:", error);
        res.status(500).json({
            message: "Failed to add review",
            error: error.message
        });
    }
};

// Search freelancers
export const searchFreelancers = async (req, res) => {
    try {
        const { skills, location, minRate, maxRate, category } = req.query;
        
        let query = {};

        if (skills) {
            query['skills.primarySkills'] = { $in: skills.split(',') };
        }

        if (location) {
            query['personalInfo.location'] = { $regex: location, $options: 'i' };
        }

        if (minRate || maxRate) {
            query['pricing.hourlyRate'] = {};
            if (minRate) query['pricing.hourlyRate'].$gte = Number(minRate);
            if (maxRate) query['pricing.hourlyRate'].$lte = Number(maxRate);
        }

        if (category) {
            query['skills.categories'] = { $in: category.split(',') };
        }

        const profiles = await FreelancerProfile.find(query)
            .populate('userId', 'Name Email')
            .limit(20);

        res.status(200).json({ profiles });
    } catch (error) {
        console.error("Error in searchFreelancers:", error);
        res.status(500).json({
            message: "Failed to search freelancers",
            error: error.message
        });
    }
};
