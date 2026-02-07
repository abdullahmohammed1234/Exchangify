'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  _id: string;
  senderId: { _id: string; name: string; email: string };
  receiverId: { _id: string; name: string; email: string };
  listingId: { _id: string; title: string };
  content: string;
  createdAt: Date;
}

export default function MessagesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (session) {
      fetchMessages();
    }
  }, [session]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedConversation,
          listingId: messages.find(m => m.senderId._id === selectedConversation || m.receiverId._id === selectedConversation)?.listingId._id || '',
          content: newMessage,
        }),
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  // Get unique conversations
  const conversations = messages.reduce((acc, msg) => {
    const otherUser = msg.senderId._id === session?.user?.id ? msg.receiverId : msg.senderId;
    if (!acc.find(c => c.userId === otherUser._id)) {
      acc.push({
        userId: otherUser._id,
        name: otherUser.name,
        lastMessage: msg.content,
        listingTitle: msg.listingId?.title || 'Unknown item',
        createdAt: msg.createdAt,
      });
    }
    return acc;
  }, [] as { userId: string; name: string; lastMessage: string; listingTitle: string; createdAt: Date }[]);

  if (!session) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Please sign in to view messages</h2>
        <button
          onClick={() => router.push('/login')}
          className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-700"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Messages</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-3 min-h-[500px]">
          {/* Conversations List */}
          <div className="border-r border-gray-200">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No messages yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() => setSelectedConversation(conv.userId)}
                  className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedConversation === conv.userId ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="font-semibold text-gray-900">{conv.name}</div>
                  <div className="text-sm text-gray-500 truncate">{conv.lastMessage}</div>
                  <div className="text-xs text-gray-400 mt-1">{conv.listingTitle}</div>
                </button>
              ))
            )}
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages
                    .filter(
                      (m) =>
                        (m.senderId._id === session?.user?.id && m.receiverId._id === selectedConversation) ||
                        (m.senderId._id === selectedConversation && m.receiverId._id === session?.user?.id)
                    )
                    .map((msg) => (
                      <div
                        key={msg._id}
                        className={`mb-4 ${
                          msg.senderId._id === session?.user?.id ? 'text-right' : 'text-left'
                        }`}
                      >
                        <div
                          className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                            msg.senderId._id === session?.user?.id
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.senderId._id === session?.user?.id ? 'text-red-200' : 'text-gray-400'
                          }`}>
                            {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={sending || !newMessage.trim()}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
