import { Router } from 'express';
import { ModelService } from '../services/modelService';

const router = Router();
const modelService = new ModelService();

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string',
        success: false,
      });
    }

    // For now, we'll use a simple echo response
    // Later this will be replaced with actual model integration
    const response = await modelService.generateResponse(message);

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

export default router;