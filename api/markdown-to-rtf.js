export default async function handler(req, res) {
  // Ensure method is POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse JSON body explicitly (Vercel doesn't always parse automatically)
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid JSON in request body', details: parseError.message });
    }

    // Validate body and markdown field
    if (!body || typeof body !== 'object' || !body.markdown) {
      return res.status(400).json({ error: 'Missing or invalid markdown in body' });
    }

    const { markdown } = body;

    // Optional: Add markdown length validation to prevent abuse
    if (typeof markdown !== 'string' || markdown.length > 10000) {
      return res.status(400).json({ error: 'Markdown is invalid or too long' });
    }

    // Create rich text structure
    const richText = {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value: markdown,
              marks: [],
              data: {}
            }
          ],
          data: {}
        }
      ]
    };

    return res.status(200).json({ 'en-US': richText });
  } catch (err) {
    // Log error for debugging (Vercel logs will capture this)
    console.error('Error in handler:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

// Vercel configuration to ensure JSON parsing
export const config = {
  api: {
    bodyParser: true // Enable body parsing (default in Vercel, but explicit for clarity)
  }
};
