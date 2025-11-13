// Rate limiting configuration
export const RATE_LIMITS = {
  daily: 50,    // 50 AI generations per day per user
  hourly: 10,   // 10 per hour
  burst: 3      // 3 per minute
};

// OpenAI configuration
export const OPENAI_CONFIG = {
  model: 'gpt-4o-mini', // Start with the most cost-effective model
  temperature: 0.3,     // Lower temperature for more consistent results
  max_tokens: 1000,     // Reasonable limit for our use case
  timeout: 30000        // 30 second timeout
};
