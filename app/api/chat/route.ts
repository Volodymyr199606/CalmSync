/**
 * POST /api/chat
 * AI wellness companion chat powered by Groq
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { logger, extractErrorInfo } from '@/lib/logger';
import { z } from 'zod';

export const runtime = 'nodejs';

type ChatRole = 'user' | 'assistant' | 'system';
type ChatMessage = { role: ChatRole; content: string };
type ChatRequestBody = { messages: ChatMessage[] };

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1),
    })
  ),
});

interface ChatSuccessResponse {
  reply: string;
}

interface ChatErrorResponse {
  error: string;
}

type ChatResponse = ChatSuccessResponse | ChatErrorResponse;

/**
 * CalmSync system prompt for wellness companion
 */
const CALMSYNC_SYSTEM_PROMPT = `You are CalmSync, a warm and supportive AI wellness companion. Your role is to:

- Provide brief, empathetic responses that help users feel heard and supported
- Suggest gentle breathing exercises, grounding techniques, or calming routines when appropriate
- Keep responses concise (2-3 sentences typically)
- Use a warm, non-judgmental tone
- NEVER provide medical advice, diagnoses, or treatment recommendations
- If a user mentions self-harm, suicidal thoughts, or emergency situations, gently suggest they reach out to a trusted person, mental health professional, or crisis service (like 988 Suicide & Crisis Lifeline)

Remember: You are a supportive companion, not a replacement for professional mental health care.`;

export async function POST(
  request: NextRequest
): Promise<NextResponse<ChatResponse>> {
  try {
    // 1. Authenticate user
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      logger.warn('Unauthorized chat request', {
        path: '/api/chat',
        hasUser: !!currentUser,
      });
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // 2. Check environment variables
    const groqApiKey = process.env.GROQ_API_KEY;
    const groqModel = process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant';

    if (!groqApiKey) {
      logger.error('Missing GROQ_API_KEY environment variable', {
        path: '/api/chat',
        email: currentUser.email,
      });
      return NextResponse.json(
        { error: 'Server configuration error. Please try again later.' },
        { status: 500 }
      );
    }

    // 3. Parse and validate request body
    const body = await request.json();
    const validation = chatRequestSchema.safeParse(body);

    if (!validation.success) {
      logger.warn('Invalid chat request data', {
        email: currentUser.email,
        errors: validation.error.issues,
      });
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { messages } = validation.data;

    // 4. Prepare messages with system prompt
    const systemMessage: ChatMessage = {
      role: 'system',
      content: CALMSYNC_SYSTEM_PROMPT,
    };

    // Check if system message already exists, if not prepend it
    const hasSystemMessage = messages.some((msg) => msg.role === 'system');
    const groqMessages = hasSystemMessage
      ? messages
      : [systemMessage, ...messages];

    // 5. Call Groq API
    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: groqModel,
          messages: groqMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      logger.error('Groq API request failed', {
        email: currentUser.email,
        status: groqResponse.status,
        statusText: groqResponse.statusText,
        responseText: errorText.substring(0, 200), // Log first 200 chars
      });

      return NextResponse.json(
        { error: 'Unable to process your message. Please try again.' },
        { status: 502 }
      );
    }

    const groqData = await groqResponse.json();

    // 6. Extract assistant reply
    const reply =
      groqData.choices?.[0]?.message?.content?.trim() ||
      "I'm here for you. How can I help you feel more calm right now?";

    logger.info('Chat request processed successfully', {
      email: currentUser.email,
      messageCount: messages.length,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    const errorInfo = extractErrorInfo(error);
    logger.error('Unexpected error in chat API', {
      path: '/api/chat',
      ...errorInfo,
    });

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
