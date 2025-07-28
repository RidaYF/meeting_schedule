import { GoogleGenerativeAI } from '@google/generative-ai';
import type { CalendarEvent } from '../types/index.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function suggestMeetingTimes(events: CalendarEvent[], userPrompt: string): Promise<string> {
  const eventDetails = events.map(e =>
    `${e.summary} from ${e.start?.dateTime || e.start?.date} to ${e.end?.dateTime || e.end?.date}`
  ).join('\n');

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const fullPrompt = `Here are my current calendar events:\n${eventDetails}\n\nUser request: ${userPrompt}`;

  const result = await model.generateContent(fullPrompt);

  return result.response.text();
}
