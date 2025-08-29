import mongoose from "mongoose";

const { model, Schema } = mongoose;

const freelancerProfileSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    personalInfo: {
        profilePhoto: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            default: ""
        },
        languages: [{
            type: String
        }],
        verificationBadge: {
            type: String,
            enum: ["ID verified", "skill verified", "unverified"],
            default: "unverified"
        }
    },
    skills: {
        primarySkills: [{
            type: String
        }],
        secondarySkills: [{
            type: String
        }],
        categories: [{
            type: String
        }],
        yearsOfExperience: {
            type: Number,
            default: 0
        }
    },
    portfolio: [{
        title: {
            type: String,
            required: true
        },
        mediaType: {
            type: String,
            enum: ["image", "video"],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        tags: [{
            type: String
        }]
    }],
    pricing: {
        hourlyRate: {
            type: Number,
            default: 0
        },
        perJobRate: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: "USD"
        },
        negotiable: {
            type: Boolean,
            default: true
        }
    },
    availability: {
        calendar: [{
            type: Date
        }],
        status: {
            type: String,
            enum: ["Available", "Busy", "Unavailable"],
            default: "Available"
        },
        maxJobsPerDay: {
            type: Number,
            default: 1
        }
    },
    reviews: [{
        clientName: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    contact: {
        messageEnabled: {
            type: Boolean,
            default: true
        },
        hireEnabled: {
            type: Boolean,
            default: true
        },
        socialLinks: {
            instagram: {
                type: String,
                default: ""
            },
            linkedin: {
                type: String,
                default: ""
            }
        }
    },
    additionalInfo: {
        equipment: [{
            type: String
        }],
        specializations: [{
            type: String
        }],
        certifications: [{
            type: String
        }]
    },
    settings: {
        privacy: {
            showContactInfo: {
                type: Boolean,
                default: true
            }
        },
        notifications: {
            bookingRequests: {
                type: Boolean,
                default: true
            },
            messages: {
                type: Boolean,
                default: true
            }
        }
    },
    optionalExtras: {
        introVideo: {
            type: String,
            default: ""
        },
        urgentAvailability: {
            type: Boolean,
            default: false
        },
        badges: [{
            type: String
        }]
    }
}, {
    timestamps: true
});

const FreelancerProfile = model("freelancerProfile", freelancerProfileSchema);
export default FreelancerProfile;
