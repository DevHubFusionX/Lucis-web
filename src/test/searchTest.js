// Test file for search API debugging
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || ''''

async function testSearchAPIs () {
  console.log('🔍 Testing Search APIs...\n')

  // Test 1: General search with minimal params
  console.log('1. Testing general search (/search/)')
  try {
    const response1 = await fetch(`${API_BASE_URL}/search/?limit=5`)
    if (!response1.ok) {
      throw new Error(`HTTP ${response1.status}: ${response1.statusText}`)
    }
    const data1 = await response1.json()
    console.log('Response status:', response1.status)
    console.log('Response data:', JSON.stringify(data1, null, 2))
  } catch (error) {
    console.error('Error:', error.message)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Test 2: Search with location params
  console.log('2. Testing search with location (/search/ with lat/lng)')
  try {
    const response2 = await fetch(
      `${API_BASE_URL}/search/?latitude=40.7128&longitude=-74.0060&limit=5`
    )
    const data2 = await response2.json()
    console.log('Response status:', response2.status)
    console.log('Response data:', JSON.stringify(data2, null, 2))
  } catch (error) {
    console.error('Error:', error.message)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Test 3: Nearby search
  console.log('3. Testing nearby search (/search/near-by/)')
  try {
    const response3 = await fetch(
      `${API_BASE_URL}/search/near-by/40.7128/-74.0060?limit=5`
    )
    const data3 = await response3.json()
    console.log('Response status:', response3.status)
    console.log('Response data:', JSON.stringify(data3, null, 2))
  } catch (error) {
    console.error('Error:', error.message)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Test 4: Search with all parameters
  console.log('4. Testing search with all params')
  try {
    const params = new URLSearchParams({
      latitude: '40.7128',
      longitude: '-74.0060',
      radius: '50',
      limit: '10'
    })
    const response4 = await fetch(
      `${API_BASE_URL}/search/?${params.toString()}`
    )
    const data4 = await response4.json()
    console.log('Response status:', response4.status)
    console.log('Response data:', JSON.stringify(data4, null, 2))
  } catch (error) {
    console.error('Error:', error.message)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Test 5: Different location (Lagos, Nigeria from API docs)
  console.log('5. Testing with API docs location (Lagos)')
  try {
    const response5 = await fetch(
      `${API_BASE_URL}/search/?latitude=6.6018&longitude=3.3515&radius=50&limit=5`
    )
    const data5 = await response5.json()
    console.log('Response status:', response5.status)
    console.log('Response data:', JSON.stringify(data5, null, 2))
  } catch (error) {
    console.error('Error:', error.message)
  }
}

// Run the tests
testSearchAPIs()
  .then(() => {
    console.log('\n✅ Search API tests completed')
  })
  .catch(error => {
    console.error('❌ Test failed:', error)
  })

export default testSearchAPIs
