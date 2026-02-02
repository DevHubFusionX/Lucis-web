
async function testSearch() {
    const longitude = 3.3515;
    const latitude = 6.6018;
    const radius = 50;
    // Using the exact URL from the user's documentation
    const url = `https://lucis-api.onrender.com/api/v1/search/?longitude=${longitude}&latitude=${latitude}&radius=${radius}`;

    console.log(`Testing URL: ${url}`);

    try {
        const response = await fetch(url);
        const text = await response.text();

        console.log('--- Raw Response ---');
        console.log(text.substring(0, 1000)); // Print first 1000 chars
        console.log('--------------------');

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            return;
        }

        console.log('--- Parsed JSON ---');
        console.log(JSON.stringify(data, null, 2));
        console.log('--------------------');

        if (data.error) {
            console.warn('API returned an error:', data.message);
        }

        if (Array.isArray(data.data)) {
            console.log(`Found ${data.data.length} professionals.`);
            data.data.forEach((p, i) => {
                console.log(`${i + 1}: ${p.firstName} ${p.lastName} (ID: ${p.id})`);
            });
        } else {
            console.error('Data is not an array:', typeof data.data);
        }
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

testSearch();
