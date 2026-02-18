import { useState } from 'react';
import { ArrowLeft, Send, Lock } from 'lucide-react';
import { User, Message } from '../types';

interface MessagesPageProps {
  creator: User;
  currentUser: User;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (content: string) => void;
  isSupporter: boolean;
}

export default function MessagesPage({
  creator,
  currentUser,
  messages,
  onBack,
  onSendMessage,
  isSupporter,
}: MessagesPageProps) {
  const [messageContent, setMessageContent] = useState('');

  const handleSend = () => {
    if (messageContent.trim() && isSupporter) {
      onSendMessage(messageContent);
      setMessageContent('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="sticky top-0 bg-gray-950 bg-opacity-95 backdrop-blur border-b border-gray-800 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <img
              src={creator.avatarUrl}
              alt={creator.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="font-bold">{creator.displayName}</h1>
              <p className="text-xs text-gray-400">@{creator.username}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {!isSupporter ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Supporter-Only Feature</h2>
              <p className="text-gray-400 mb-6">
                Direct messaging is available exclusively for supporters. Subscribe to{' '}
                {creator.displayName} to unlock this feature.
              </p>
              <button className="px-6 py-3 bg-accent-500 hover:bg-accent-600 rounded-lg font-medium transition-colors">
                Become a Supporter
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No messages yet</p>
                  <p className="text-sm text-gray-500">
                    Start the conversation with {creator.displayName}
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const isFromCurrentUser = message.fromUserId === currentUser.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-2xl ${
                          isFromCurrentUser
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-800 text-gray-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isFromCurrentUser ? 'text-primary-100' : 'text-gray-500'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {isSupporter && (
        <div className="sticky bottom-0 bg-gray-950 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!messageContent.trim()}
                className="w-12 h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
