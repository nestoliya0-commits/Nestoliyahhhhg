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
    
    const groqMessages = [
      { role: 'system', content: body.system },
      ...body.messages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: groqMessages
      })
    });

    const responseText = await response.text();
    console.log('Groq response:', responseText);
    
    const data = JSON.parse(responseText);
    
    if (data.error) {
      console.log('Groq error:', data.error);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: [{ type: 'text', text: 'Error: ' + data.error.message }]
        })
      };
    }

    const text = data.choices[0].message.content;

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
    console.log('Error:', err.message);
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: [{ type: 'text', text: 'Error: ' + err.message }]
      })
    };
  }
};
