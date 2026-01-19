'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

type ChatRole = 'user' | 'assistant' | 'system';
type ChatMessage = { role: ChatRole; content: string };

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: "Hey, I'm CalmSync. How are you feeling right now?",
};

export function CalmSyncChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      // Prepare messages for API (exclude system message from user messages)
      const apiMessages = [...messages, userMessage].filter(
        (msg) => msg.role !== 'system'
      );

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 'Failed to get response. Please try again.'
        );
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply || "I'm here for you. How can I help?",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.';

      const errorChatMessage: ChatMessage = {
        role: 'assistant',
        content: `I'm sorry, I'm having trouble right now. ${errorMessage}`,
      };

      setMessages((prev) => [...prev, errorChatMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="flex h-full flex-col bg-transparent border-0 shadow-none">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="text-lg font-semibold text-white/90">CalmSync Companion</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 p-4">
        {/* Messages area */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 backdrop-blur-sm ${
                    message.role === 'user'
                      ? 'bg-emerald-500/30 text-white border border-emerald-400/30'
                      : 'bg-white/10 text-white/90 border border-white/20'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white/90 rounded-lg px-4 py-2 border border-white/20 backdrop-blur-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px] resize-none bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30 focus-visible:border-white/40"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isSending}
            className="shrink-0 cursor-pointer bg-emerald-500/30 hover:bg-emerald-500/40 border border-emerald-400/30 text-white backdrop-blur-sm"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
