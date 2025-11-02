import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import chatRoutes from './routes/chat';
import { ServiceContainer } from './container/ServiceContainer';

// Initialize DI container
const container = ServiceContainer.getInstance();
const config = container.config;

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const modelHealthy = await container.modelService.isHealthy();
  
  res.json({ 
    status: modelHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    service: 'simple-react-slm-backend',
    model: {
      available: modelHealthy,
      name: config.ollamaModel,
    },
  });
});

// Routes
app.use('/api', chatRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    success: false 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    success: false 
  });
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Model: ${config.ollamaModel}`);
  console.log(`Ollama URL: ${config.ollamaUrl}`);
});