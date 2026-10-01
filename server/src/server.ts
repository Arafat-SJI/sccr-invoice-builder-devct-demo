import './types/express';
import app from './app';
import { config } from './config/env';
import './database/supabase';

const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Supabase client initialized');
});
