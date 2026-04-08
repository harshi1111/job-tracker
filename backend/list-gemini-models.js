const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.models) {
        console.log('✅ Available models for generateContent:');
        json.models.forEach(model => {
          if (model.supportedGenerationMethods?.includes('generateContent')) {
            console.log(`- ${model.name}`);
          }
        });
      } else {
        console.log('❌ Error:', json.error?.message || 'Unknown error');
      }
    } catch (e) {
      console.error('Failed to parse response:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Request error:', err.message);
});