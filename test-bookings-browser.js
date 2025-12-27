// BROWSER CONSOLE TEST - Copy and paste this entire script into your browser console
// while on http://localhost:3000

(async function testBookings() {
  console.log('🔍 Testing Bookings API from Browser...\n');
  
  try {
    // Get credentials from localStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
      console.error('❌ Not logged in! Please login first.');
      return;
    }
    
    console.log('✅ Logged in as:', user.email);
    console.log('👤 User ID:', user.id);
    console.log('🔑 Token:', token.substring(0, 20) + '...\n');
    
    const API_BASE_URL = 'https://lucis-api.onrender.com/api/v1';
    const endpoint = `${API_BASE_URL}/bookings/users/${user.id}`;
    
    console.log(`📡 Fetching: ${endpoint}\n`);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📊 Status: ${response.status} ${response.statusText}\n`);
    
    const data = await response.json();
    console.log('📦 Full Response:');
    console.log(data);
    console.log('\n');
    
    if (response.ok) {
      console.log('✅ API Request Successful!\n');
      
      if (data.data) {
        if (Array.isArray(data.data)) {
          console.log(`📝 Found ${data.data.length} booking(s):\n`);
          data.data.forEach((booking, index) => {
            console.log(`Booking ${index + 1}:`);
            console.log('  ID:', booking.id);
            console.log('  Professional:', booking.professionalId);
            console.log('  Package:', booking.packageId || booking.packageTitle);
            console.log('  Date:', booking.date);
            console.log('  Time:', booking.startTime, '-', booking.endTime);
            console.log('  Status:', booking.status);
            console.log('  Total:', '$' + booking.totalAmount);
            console.log('  Created:', new Date(booking.createdAt).toLocaleString());
            console.log('---');
          });
        } else {
          console.log('📝 Single Booking Data:');
          console.log(data.data);
        }
      } else {
        console.log('⚠️  Response structure:', data);
      }
    } else {
      console.log('❌ API Request Failed!\n');
      console.log('Error:', data.message || 'Unknown error');
      console.log('Full error response:', data);
    }
    
  } catch (error) {
    console.error('\n💥 Error occurred:');
    console.error(error);
  }
})();

console.log('\n' + '='.repeat(60));
console.log('Test complete! Check the output above ☝️');
console.log('='.repeat(60));
