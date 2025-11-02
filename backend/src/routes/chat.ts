import { Router } from 'express';
import { ServiceContainer } from '../container/ServiceContainer';

const router = Router();
const container = ServiceContainer.getInstance();
const modelService = container.modelService;

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string',
        success: false,
      });
    }

    // Optional language parameter for bilingual support
    const lang = language && typeof language === 'string' ? language : undefined;

    // Generate response using the model
    const response = await modelService.generateResponse(message, lang);

    res.json({
      message: response,
      success: true,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      success: false,
    });
  }
});

// Streaming chat endpoint
router.post('/chat/stream', async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string',
        success: false,
      });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // Optional language parameter for bilingual support
    const lang = language && typeof language === 'string' ? language : undefined;

    // Generate streaming response
    const stream = await modelService.generateResponseStream(message, lang);
    const reader = stream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          res.write('data: [DONE]\n\n');
          res.end();
          break;
        }

        // Send chunk as SSE
        res.write(`data: ${JSON.stringify({ chunk: value })}\n\n`);
      }
    } catch (streamError) {
      console.error('Streaming error:', streamError);
      res.write(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`);
      res.end();
    }
  } catch (error) {
    console.error('Chat streaming error:', error);
    res.status(500).json({
      error: 'Failed to process streaming message',
      success: false,
    });
  }
});

// Model info endpoint (new!)
router.get('/model/info', async (req, res) => {
  try {
    const info = await modelService.getModelInfo();
    res.json({
      data: info,
      success: true,
    });
  } catch (error) {
    console.error('Model info error:', error);
    res.status(500).json({
      error: 'Failed to get model information',
      success: false,
    });
  }
});

export default router;