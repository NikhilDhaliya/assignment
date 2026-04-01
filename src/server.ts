import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`\nFinance Backend API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base URL: http://localhost:${PORT}/api/v1`);
  console.log(`Environment: ${env.NODE_ENV}\n`);
});
