import mongoose from "mongoose";

const { model, Schema } = mongoose;

const clientProfileSchema = Schema({
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
        name: {
            type: String,
            required: true
        },
        location: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            default: ""
        },
        verificationBadge: {
            type: String,
            enum: ["Verified", "Unverified"],
            default: "Unverified"
        }
    },
    jobManagement: {
        activeJobs: [{
            title: {
                type: String,
                required: true
            },
            freelancer: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            status: {
                type: String,
                enum: ["In Progress", "Completed", "Cancelled"],
                default: "In Progress"
            }
        }],
        pastJobs: [{
            title: {
                type: String,
                required: true
            },
            freelancer: {
                type: String,
                required: true
            },
            status: {
                type: String,
                enum: ["Completed", "Cancelled"],
                default: "Completed"
            },
            date: {
                type: Date,
                default: Date.now
            }
        }]
    },
    savedFreelancers: [{
        type: String
    }],
    reviews: [{
        freelancerName: {
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
    payment: {
        methods: [{
            type: String
        }],
        history: [{
            job: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }]
    },
    contact: {
        messageEnabled: {
            type: Boolean,
            default: true
        },
        postJobEnabled: {
            type: Boolean,
            default: true
        }
    },
    settings: {
        privacy: {
            showContactInfo: {
                type: Boolean,
                default: true
            }
        },
        notifications: {
            jobUpdates: {
                type: Boolean,
                default: true
            },
            messages: {
                type: Boolean,
                default: true
            }
        }
    }
}, {
    timestamps: true
});

const ClientProfile = model("clientProfile", clientProfileSchema);
export default ClientProfile;
