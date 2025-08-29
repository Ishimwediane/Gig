# Profile Management API Documentation

This document describes the new profile management endpoints added to the Gig backend application.

## Overview

The profile system consists of two main profile types:
- **Freelancer Profile**: For users with the "freelancer" role
- **Client Profile**: For users with the "client" role

## Base URLs

- **Freelancer Routes**: `/freelancer/*`
- **Client Routes**: `/client/*`

## Authentication

All profile endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Freelancer Profile Endpoints

### 1. Create/Update Freelancer Profile
- **POST/PUT** `/freelancer/profile`
- **Role Required**: `freelancer`
- **Description**: Creates or updates a freelancer profile
- **Body**: Complete freelancer profile data structure

**Example Request Body:**
```json
{
  "personalInfo": {
    "profilePhoto": "url_to_photo",
    "location": "City, Region, Country",
    "bio": "Short description about freelancer",
    "languages": ["English", "Kinyarwanda"],
    "verificationBadge": "ID verified"
  },
  "skills": {
    "primarySkills": ["Wedding Photography", "Videography"],
    "secondarySkills": ["Editing", "Drone"],
    "categories": ["Photography", "Videography"],
    "yearsOfExperience": 3
  },
  "pricing": {
    "hourlyRate": 50,
    "perJobRate": 200,
    "currency": "USD",
    "negotiable": true
  }
}
```

### 2. Get My Freelancer Profile
- **GET** `/freelancer/profile/me`
- **Role Required**: `freelancer`
- **Description**: Retrieves the current user's freelancer profile

### 3. Get Freelancer Profile by ID
- **GET** `/freelancer/profile/:profileId`
- **Description**: Retrieves a specific freelancer profile by profile ID

### 4. Get Freelancer Profile by User ID
- **GET** `/freelancer/profile/user/:userId`
- **Description**: Retrieves a freelancer profile by user ID

### 5. Portfolio Management

#### Add Portfolio Item
- **POST** `/freelancer/portfolio`
- **Role Required**: `freelancer`
- **Description**: Adds a new portfolio item

#### Update Portfolio Item
- **PUT** `/freelancer/portfolio/:itemId`
- **Role Required**: `freelancer`
- **Description**: Updates an existing portfolio item

#### Delete Portfolio Item
- **DELETE** `/freelancer/portfolio/:itemId`
- **Role Required**: `freelancer`
- **Description**: Deletes a portfolio item

### 6. Add Review
- **POST** `/freelancer/profile/:profileId/review`
- **Description**: Adds a review to a freelancer profile

### 7. Search Freelancers
- **GET** `/freelancer/search`
- **Query Parameters**:
  - `skills`: Comma-separated list of skills
  - `location`: Location to search in
  - `minRate`: Minimum hourly rate
  - `maxRate`: Maximum hourly rate
  - `category`: Comma-separated list of categories

## Client Profile Endpoints

### 1. Create/Update Client Profile
- **POST/PUT** `/client/profile`
- **Description**: Creates or updates a client profile
- **Body**: Complete client profile data structure

**Example Request Body:**
```json
{
  "personalInfo": {
    "profilePhoto": "url_to_photo",
    "name": "Alice",
    "location": "City, Region, Country",
    "bio": "Optional short description",
    "verificationBadge": "Verified"
  }
}
```

### 2. Get My Client Profile
- **GET** `/client/profile/me`
- **Description**: Retrieves the current user's client profile

### 3. Get Client Profile by ID
- **GET** `/client/profile/:profileId`
- **Description**: Retrieves a specific client profile by profile ID

### 4. Get Client Profile by User ID
- **GET** `/client/profile/user/:userId`
- **Description**: Retrieves a client profile by user ID

### 5. Job Management

#### Add Active Job
- **POST** `/client/jobs/active`
- **Description**: Adds a new active job to the client's profile

#### Update Job Status
- **PUT** `/client/jobs/:jobId/status`
- **Description**: Updates the status of an active job

### 6. Saved Freelancers Management

#### Add Saved Freelancer
- **POST** `/client/saved-freelancers`
- **Description**: Adds a freelancer to the saved list

#### Remove Saved Freelancer
- **DELETE** `/client/saved-freelancers/:freelancerName`
- **Description**: Removes a freelancer from the saved list

### 7. Add Review for Freelancer
- **POST** `/client/reviews`
- **Description**: Adds a review for a freelancer

### 8. Payment Management

#### Add Payment Method
- **POST** `/client/payment/methods`
- **Description**: Adds a new payment method

#### Add Payment History
- **POST** `/client/payment/history`
- **Description**: Adds a payment record to history

## Data Models

### Freelancer Profile Schema
```javascript
{
  userId: ObjectId (ref: 'user'),
  personalInfo: {
    profilePhoto: String,
    location: String,
    bio: String,
    languages: [String],
    verificationBadge: String (enum: ["ID verified", "skill verified", "unverified"])
  },
  skills: {
    primarySkills: [String],
    secondarySkills: [String],
    categories: [String],
    yearsOfExperience: Number
  },
  portfolio: [{
    title: String,
    mediaType: String (enum: ["image", "video"]),
    url: String,
    tags: [String]
  }],
  pricing: {
    hourlyRate: Number,
    perJobRate: Number,
    currency: String,
    negotiable: Boolean
  },
  availability: {
    calendar: [Date],
    status: String (enum: ["Available", "Busy", "Unavailable"]),
    maxJobsPerDay: Number
  },
  reviews: [{
    clientName: String,
    rating: Number (1-5),
    comment: String,
    date: Date
  }],
  contact: {
    messageEnabled: Boolean,
    hireEnabled: Boolean,
    socialLinks: {
      instagram: String,
      linkedin: String
    }
  },
  additionalInfo: {
    equipment: [String],
    specializations: [String],
    certifications: [String]
  },
  settings: {
    privacy: { showContactInfo: Boolean },
    notifications: {
      bookingRequests: Boolean,
      messages: Boolean
    }
  },
  optionalExtras: {
    introVideo: String,
    urgentAvailability: Boolean,
    badges: [String]
  }
}
```

### Client Profile Schema
```javascript
{
  userId: ObjectId (ref: 'user'),
  personalInfo: {
    profilePhoto: String,
    name: String,
    location: String,
    bio: String,
    verificationBadge: String (enum: ["Verified", "Unverified"])
  },
  jobManagement: {
    activeJobs: [{
      title: String,
      freelancer: String,
      date: Date,
      status: String (enum: ["In Progress", "Completed", "Cancelled"])
    }],
    pastJobs: [{
      title: String,
      freelancer: String,
      status: String (enum: ["Completed", "Cancelled"]),
      date: Date
    }]
  },
  savedFreelancers: [String],
  reviews: [{
    freelancerName: String,
    rating: Number (1-5),
    comment: String,
    date: Date
  }],
  payment: {
    methods: [String],
    history: [{
      job: String,
      amount: Number,
      date: Date
    }]
  },
  contact: {
    messageEnabled: Boolean,
    postJobEnabled: Boolean
  },
  settings: {
    privacy: { showContactInfo: Boolean },
    notifications: {
      jobUpdates: Boolean,
      messages: Boolean
    }
  }
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error responses include a message and optional error details:
```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Usage Examples

### Creating a Freelancer Profile
```bash
curl -X POST http://localhost:3000/freelancer/profile \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "personalInfo": {
      "location": "Kigali, Rwanda",
      "bio": "Professional wedding photographer with 5 years experience"
    },
    "skills": {
      "primarySkills": ["Wedding Photography"],
      "yearsOfExperience": 5
    }
  }'
```

### Searching for Freelancers
```bash
curl -X GET "http://localhost:3000/freelancer/search?skills=Photography&location=Kigali&minRate=30" \
  -H "Authorization: Bearer <your_token>"
```

### Adding a Portfolio Item
```bash
curl -X POST http://localhost:3000/freelancer/portfolio \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful Wedding Ceremony",
    "mediaType": "image",
    "url": "https://example.com/wedding-photo.jpg",
    "tags": ["Wedding", "Ceremony", "Outdoor"]
  }'
```

## Notes

1. **Role-based Access**: Freelancer endpoints require the user to have the "freelancer" role
2. **Token Verification**: All endpoints require valid JWT tokens
3. **Profile Creation**: Profiles are created automatically when first accessed
4. **Data Validation**: All input data is validated against the schema
5. **Populated References**: User information is populated when retrieving profiles
