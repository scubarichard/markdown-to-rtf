import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

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
              data: {},
            },
          ],
          data: {},
        },
      ],
    };

    return res.status(200).json({ 'en-US': richText });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
