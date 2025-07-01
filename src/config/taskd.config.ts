import { registerAs } from '@nestjs/config';

export default registerAs('taskd', () => ({
  // Example config values; extend as needed
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  aiProvider: process.env.AI_PROVIDER || 'googleai',
  // Add more TaskD-specific config here
}));
