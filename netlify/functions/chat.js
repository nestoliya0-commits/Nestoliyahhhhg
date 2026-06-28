const https = require('https');

function sendEmail(bookingData, resendKey) {
  return new Promise((resolve) => {
    const emailHtml = `
      <h2>🌿 New Booking Request!</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #ddd"><b>Guest Name</b></td><td style="padding:8px;border:1px solid #ddd">${bookingData.name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><b>Date</b></td><td style="padding:8px;border:1px solid #ddd">${bookingData.date}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><b>Time</b></td><td style="padding:8px;border:1px solid #ddd">${bookingData.time}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><b>Party Size</b></td><td style="padding:8px;border:1px solid #ddd">${bookingData.party} guests</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><b>Special Requests</b></td><td style="padding:8px;border:1px solid #ddd">${bookingData.special || 'None'}</td></tr>
      </table>
    `;

    const postData = JSON.stringify({
      from: 'YFYT Bot <onboarding@resend.dev>',
      to: ['royalwhale00@gmail.com'],
      subject: `New Booking - ${bookingData.name}`,
      html: emailHtml
    });

    const options = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + resendKey,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('Email response:', data);
        resolve(data);
      });
    });

    req.on('error', (e) => {
      console.log('Email error:', e.message);
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);

    // Send email if booking data present
    if (body.bookingData && process.env.RESEND_API_KEY) {
      await sendEmail(body.bookingData, process.env.RESEND_API_KEY);
    }

    const groqMessages = [
      { role: 'system', content: body.system },
      ...body.messages
    ];

    const postData = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: groqMessages
    });

    const text = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              resolve('Error: ' + parsed.error.message);
            } else {
              resolve(parsed.choices[0].message.content);
            }
          } catch(e) {
            resolve('Parse error: ' + data);
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.write(postData);
      req.end();
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: [{ type: 'text', text: text }]
      })
    };

  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: [{ type: 'text', text: 'Error: ' + err.message }]
      })
    };
  }
};
