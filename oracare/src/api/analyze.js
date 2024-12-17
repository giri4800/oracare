import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    // Call Claude API for analysis
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Please analyze this oral cavity image for potential signs of oral cancer. Provide a detailed analysis including:\n1. A summary of findings\n2. Confidence score (0-100)\n3. Specific recommendations'
          },
          {
            type: 'image',
            source: {
              type: 'url',
              url: imageUrl
            }
          }
        ]
      }]
    });

    // Process Claude's response
    const analysis = message.content[0].text;
    
    // Parse the analysis to extract structured data
    const result = {
      summary: extractSummary(analysis),
      confidence: calculateConfidence(analysis),
      recommendations: extractRecommendations(analysis)
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ message: 'Failed to analyze image' });
  }
}

function extractSummary(analysis) {
  // Extract the summary from Claude's response
  // This is a simplified example - you might want to use more sophisticated parsing
  const summaryMatch = analysis.match(/Summary:?(.*?)(?=Confidence|$)/is);
  return summaryMatch ? summaryMatch[1].trim() : 'No summary available';
}

function calculateConfidence(analysis) {
  // Extract and normalize confidence score
  const confidenceMatch = analysis.match(/Confidence:?\s*(\d+)/i);
  return confidenceMatch ? Math.min(100, Math.max(0, parseInt(confidenceMatch[1]))) : 50;
}

function extractRecommendations(analysis) {
  // Extract recommendations from Claude's response
  const recommendationsMatch = analysis.match(/Recommendations:?(.*?)(?=$)/is);
  return recommendationsMatch ? recommendationsMatch[1].trim() : 'No specific recommendations available';
} 