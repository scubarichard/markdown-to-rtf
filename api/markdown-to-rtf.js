export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { markdown } = req.body;

    if (!markdown) {
      return res.status(400).json({ error: 'Missing markdown in body' });
    }

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
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
