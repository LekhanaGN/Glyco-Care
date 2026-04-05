'use client';

import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

const suggestedQuestions = [
  'Should I eat now?',
  'Is my trend improving?',
  'What caused this drop?',
];

const responseTemplate: Record<string, Record<string, string>> = {
  HIGH: {
    'Should I eat now?':
      'Yes, I recommend eating something soon. Your glucose is predicted to drop below 70 mg/dL. Consider a quick snack with 15-20g of fast-acting carbs like juice or a glucose tablet.',
    'Is my trend improving?':
      'No, your trend is declining. Your glucose is dropping at 4.2 mg/dL per 10 minutes. We need to take action to prevent hypoglycemia.',
    'What caused this drop?':
      'Based on your activity data and food intake, the drop appears to be caused by physical activity without corresponding carbohydrate intake.',
  },
  MEDIUM: {
    'Should I eat now?':
      'It depends on your activities in the next hour. If you plan light activity, monitor closely. If exercise is planned, consider a small snack.',
    'Is my trend improving?':
      'Your trend is relatively stable but slightly declining. Monitor for the next 20 minutes.',
    'What caused this drop?':
      'The gradual decline suggests a combination of factors including time since your last meal and moderate activity.',
  },
  LOW: {
    'Should I eat now?':
      'Your glucose is stable. You don\'t need to eat immediately, but monitor regularly.',
    'Is my trend improving?':
      'Yes, your trend looks good. Glucose levels are stable.',
    'What caused this drop?':
      'No significant drop detected. Your glucose levels are well-controlled.',
  },
};

export default function AIChat({ riskLevel = 'MEDIUM' }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content:
        'Hi! I\'m your glucose AI assistant. Ask me anything about your current glucose levels and predictions.',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: messageText }]);

    // Simulate AI response
    setTimeout(() => {
      const response =
        responseTemplate[riskLevel]?.[messageText as keyof typeof responseTemplate[typeof riskLevel]] ||
        'I\'m not sure about that. Could you ask something else about your glucose levels?';
      setMessages(prev => [...prev, { type: 'assistant', content: response }]);
    }, 500);

    setInput('');
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4 shadow-sm flex-1 min-h-96">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare size={16} className="text-primary" />
        <h3 className="font-bold text-sm text-foreground">AI Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2.5 rounded-xl max-w-xs text-sm ${
                msg.type === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-foreground rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        {messages.length === 1 && (
          <div className="space-y-1.5">
            {suggestedQuestions.map(q => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-muted transition-colors text-foreground font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question..."
            className="flex-1 bg-input border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/70"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim()}
            className="p-2 rounded-xl transition-all"
            style={{
              background: input.trim() ? 'var(--primary)' : 'var(--muted)',
              color: input.trim()
                ? 'var(--primary-foreground)'
                : 'var(--muted-foreground)',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
