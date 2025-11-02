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