import OpenAI from 'openai';

export class AIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  /**
   * Track usage for rate limiting
   */
  private async trackUsage(userId: string): Promise<void> {
    // TODO: Implement proper usage tracking with Redis
    // For development, we'll just log
    console.log(`Tracking AI usage for user: ${userId}`);
  }

  /**
   * Check if user has exceeded rate limits
   */
  private async checkRateLimit(userId: string): Promise<void> {
    // In a real implementation, this would check Redis or database
    // For now, we'll implement a simple in-memory check
    
    // TODO: Implement proper rate limiting with Redis
    // For development, we'll allow all requests
    console.log(`Rate limit check for user: ${userId}`);
  }

  private getSystemPrompt(outputType: string): string {
    const basePrompt = `You are an AI assistant that helps users by generating text based on their prompts. 
    Ensure that your responses are clear, concise, and relevant to the user's request. 
    Avoid any content that could be considered harmful or inappropriate.`;

    return `${basePrompt} The user has requested the output type: ${outputType}. Please tailor your response accordingly.`;
  }

  /**
   * Sanitize user input to prevent prompt injection
   */
  private sanitizeInput(input: string): string {
    return input
      .replace(/[{}]/g, '')     // Remove template markers
      .replace(/\n/g, ' ')      // Convert to single line
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim()                   // Remove leading/trailing space
      .substring(0, 200);       // Limit length
  }

  /**
   * Check if AI service is available
   */
  isAvailable(): boolean {
    return this.openai !== null;
  }

  /**
   * Generate text using OpenAI GPT-4o model
   */
  async generateText(prompt: string): Promise<string | null> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    return response.choices[0].message.content;
  }
}

export const aiService = new AIService(process.env.OPENAI_API_KEY || '');
