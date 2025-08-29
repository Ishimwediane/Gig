// Test file for Profile Management API
// This file contains examples of how to test the new profile endpoints

const BASE_URL = 'http://localhost:3000';
let authToken = ''; // Will store the JWT token after login

// Test data for freelancer profile
const freelancerProfileData = {
    "personalInfo": {
        "profilePhoto": "https://example.com/profile.jpg",
        "location": "Kigali, Rwanda",
        "bio": "Professional wedding photographer with 5 years of experience in capturing beautiful moments",
        "languages": ["English", "Kinyarwanda", "French"],
        "verificationBadge": "ID verified"
    },
    "skills": {
        "primarySkills": ["Wedding Photography", "Videography"],
        "secondarySkills": ["Photo Editing", "Drone Photography"],
        "categories": ["Photography", "Videography"],
        "yearsOfExperience": 5
    },
    "pricing": {
        "hourlyRate": 50,
        "perJobRate": 200,
        "currency": "USD",
        "negotiable": true
    },
    "availability": {
        "status": "Available",
        "maxJobsPerDay": 2
    },
    "contact": {
        "messageEnabled": true,
        "hireEnabled": true,
        "socialLinks": {
            "instagram": "https://instagram.com/jane_photographer",
            "linkedin": "https://linkedin.com/in/jane-photographer"
        }
    },
    "additionalInfo": {
        "equipment": ["Canon EOS R5", "Drone X200", "Professional Lighting"],
        "specializations": ["Weddings", "Birthdays", "Corporate Events"],
        "certifications": ["Photography Diploma", "Drone Pilot License"]
    }
};

// Test data for client profile
const clientProfileData = {
    "personalInfo": {
        "profilePhoto": "https://example.com/client.jpg",
        "name": "Alice Johnson",
        "location": "Nairobi, Kenya",
        "bio": "Event planner looking for talented photographers and videographers",
        "verificationBadge": "Verified"
    },
    "contact": {
        "messageEnabled": true,
        "postJobEnabled": true
    },
    "settings": {
        "privacy": {
            "showContactInfo": true
        },
        "notifications": {
            "jobUpdates": true,
            "messages": true
        }
    }
};

// Test data for portfolio item
const portfolioItem = {
    "title": "Beautiful Wedding Ceremony",
    "mediaType": "image",
    "url": "https://example.com/wedding-photo.jpg",
    "tags": ["Wedding", "Ceremony", "Outdoor", "Romantic"]
};

// Test data for review
const reviewData = {
    "clientName": "Alice Johnson",
    "rating": 5,
    "comment": "Amazing work! Jane captured our wedding perfectly. Highly recommended!"
};

// Test data for active job
const activeJobData = {
    "title": "Corporate Event Photography",
    "freelancer": "Jane Doe",
    "date": "2025-01-15",
    "status": "In Progress"
};

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken ? `Bearer ${authToken}` : '',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        console.error('Request failed:', error);
        return { status: 500, data: { error: error.message } };
    }
}

// Test functions
async function testFreelancerProfile() {
    console.log('\n=== Testing Freelancer Profile ===');
    
    // Create/Update freelancer profile
    console.log('1. Creating freelancer profile...');
    const createProfile = await makeRequest(`${BASE_URL}/freelancer/profile`, {
        method: 'POST',
        body: JSON.stringify(freelancerProfileData)
    });
    console.log('Create Profile Response:', createProfile);
    
    // Get my profile
    console.log('\n2. Getting my freelancer profile...');
    const getMyProfile = await makeRequest(`${BASE_URL}/freelancer/profile/me`);
    console.log('Get My Profile Response:', getMyProfile);
    
    // Add portfolio item
    console.log('\n3. Adding portfolio item...');
    const addPortfolio = await makeRequest(`${BASE_URL}/freelancer/portfolio`, {
        method: 'POST',
        body: JSON.stringify(portfolioItem)
    });
    console.log('Add Portfolio Response:', addPortfolio);
    
    // Search freelancers
    console.log('\n4. Searching for freelancers...');
    const searchFreelancers = await makeRequest(`${BASE_URL}/freelancer/search?skills=Photography&location=Kigali&minRate=30`);
    console.log('Search Response:', searchFreelancers);
}

async function testClientProfile() {
    console.log('\n=== Testing Client Profile ===');
    
    // Create/Update client profile
    console.log('1. Creating client profile...');
    const createProfile = await makeRequest(`${BASE_URL}/client/profile`, {
        method: 'POST',
        body: JSON.stringify(clientProfileData)
    });
    console.log('Create Profile Response:', createProfile);
    
    // Get my profile
    console.log('\n2. Getting my client profile...');
    const getMyProfile = await makeRequest(`${BASE_URL}/client/profile/me`);
    console.log('Get My Profile Response:', getMyProfile);
    
    // Add active job
    console.log('\n3. Adding active job...');
    const addJob = await makeRequest(`${BASE_URL}/client/jobs/active`, {
        method: 'POST',
        body: JSON.stringify(activeJobData)
    });
    console.log('Add Job Response:', addJob);
    
    // Add saved freelancer
    console.log('\n4. Adding saved freelancer...');
    const addSaved = await makeRequest(`${BASE_URL}/client/saved-freelancers`, {
        method: 'POST',
        body: JSON.stringify({ freelancerName: "Jane Doe" })
    });
    console.log('Add Saved Freelancer Response:', addSaved);
    
    // Add payment method
    console.log('\n5. Adding payment method...');
    const addPayment = await makeRequest(`${BASE_URL}/client/payment/methods`, {
        method: 'POST',
        body: JSON.stringify({ method: "Visa ****1234" })
    });
    console.log('Add Payment Method Response:', addPayment);
}

// Main test function
async function runTests() {
    console.log('Starting Profile Management API Tests...');
    console.log('Note: You need to set authToken variable with a valid JWT token');
    console.log('You can get this by logging in through the /user/login endpoint');
    
    if (!authToken) {
        console.log('\n⚠️  Warning: No auth token provided. Tests will fail with 401 errors.');
        console.log('Please set the authToken variable with a valid JWT token from login.');
        return;
    }
    
    try {
        await testFreelancerProfile();
        await testClientProfile();
        console.log('\n✅ All tests completed!');
    } catch (error) {
        console.error('\n❌ Tests failed:', error);
    }
}

// Export for use in other files or run directly
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runTests, makeRequest };
} else {
    // Run tests if this file is executed directly
    runTests();
}

// Instructions for manual testing:
console.log(`
=== Manual Testing Instructions ===

1. First, register a user with role "freelancer":
   POST /user/register
   {
     "Name": "Jane Doe",
     "Email": "jane@example.com",
     "Password": "password123",
     "Role": "freelancer"
   }

2. Register another user with role "client":
   POST /user/register
   {
     "Name": "Alice Johnson",
     "Email": "alice@example.com",
     "Password": "password123",
     "Role": "client"
   }

3. Login to get JWT tokens:
   POST /user/login
   {
     "Email": "jane@example.com",
     "Password": "password123"
   }

4. Use the returned accessToken in the Authorization header:
   Authorization: Bearer <accessToken>

5. Test the profile endpoints as shown in the test functions above.

=== Available Endpoints ===

Freelancer Routes:
- POST/PUT /freelancer/profile
- GET /freelancer/profile/me
- GET /freelancer/profile/:profileId
- GET /freelancer/profile/user/:userId
- POST /freelancer/portfolio
- PUT /freelancer/portfolio/:itemId
- DELETE /freelancer/portfolio/:itemId
- POST /freelancer/profile/:profileId/review
- GET /freelancer/search

Client Routes:
- POST/PUT /client/profile
- GET /client/profile/me
- GET /client/profile/:profileId
- GET /client/profile/user/:userId
- POST /client/jobs/active
- PUT /client/jobs/:jobId/status
- POST /client/saved-freelancers
- DELETE /client/saved-freelancers/:freelancerName
- POST /client/reviews
- POST /client/payment/methods
- POST /client/payment/history
`);
