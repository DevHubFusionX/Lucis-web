// Test script to check bookings API
// Run with: node test-bookings-api.js

const API_BASE_URL = 'https://lucis-api.onrender.com/api/v1';

// Get your auth token from browser localStorage or cookies
const AUTH_TOKEN = 'YOUR_TOKEN_HERE'; // Replace with actual token

// Get your user ID from browser localStorage
const USER_ID = 'YOUR_USER_ID_HERE'; // Replace with actual user ID

async function testBookingsAPI() {
  console.log('🔍 Testing Bookings API...\n');
  
  try {
    // Test 1: Fetch all bookings for the user
    console.log(`📡 Fetching bookings for user: ${USER_ID}`);
    console.log(`📍 Endpoint: GET ${API_BASE_URL}/bookings/users/${USER_ID}\n`);
    
    const response = await fetch(`${API_BASE_URL}/bookings/users/${USER_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    console.log('\n📦 Response Data:');
    console.log(JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ API call successful!');
      
      if (data.data && Array.isArray(data.data)) {
        console.log(`\n📝 Found ${data.data.length} booking(s):`);
        data.data.forEach((booking, index) => {
          console.log(`\nBooking ${index + 1}:`);
          console.log(`  - ID: ${booking.id}`);
          console.log(`  - Professional: ${booking.professionalId || 'N/A'}`);
          console.log(`  - Package: ${booking.packageId || 'N/A'}`);
          console.log(`  - Date: ${booking.date || 'N/A'}`);
          console.log(`  - Status: ${booking.status || 'N/A'}`);
          console.log(`  - Total: $${booking.totalAmount || 'N/A'}`);
        });
      } else if (data.data) {
        console.log('\n📝 Booking Data:', data.data);
      } else {
        console.log('\n⚠️ No bookings found in response');
      }
    } else {
      console.log('\n❌ API call failed!');
      console.log(`Error: ${data.message || 'Unknown error'}`);
    }

  } catch (error) {
    console.log('\n💥 Error occurred:');
    console.log(error.message);
    console.log(error.stack);
  }
}

// Instructions to get your credentials
console.log('='.repeat(60));
console.log('📋 HOW TO USE THIS SCRIPT:');
console.log('='.repeat(60));
console.log('\n1. Open your browser and go to http://localhost:3000');
console.log('2. Open DevTools (F12) and go to Console tab');
console.log('3. Run these commands to get your credentials:\n');
console.log('   // Get your auth token:');
console.log('   console.log(localStorage.getItem("token"));\n');
console.log('   // Get your user data (including ID):');
console.log('   console.log(JSON.parse(localStorage.getItem("user")));\n');
console.log('4. Copy the token and user ID');
console.log('5. Update AUTH_TOKEN and USER_ID in this file');
console.log('6. Run: node test-bookings-api.js\n');
console.log('='.repeat(60));
console.log('\nWaiting for credentials to be added...\n');

// Check if credentials are set
if (AUTH_TOKEN === 'YOUR_TOKEN_HERE' || USER_ID === 'YOUR_USER_ID_HERE') {
  console.log('⚠️  Please update AUTH_TOKEN and USER_ID in the script first!');
  console.log('See instructions above.\n');
} else {
  testBookingsAPI();
}
