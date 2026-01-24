'use client';

import { useEffect, useState } from 'react';
import { Channel, MessageList, MessageInput } from 'stream-chat-react';
import { chatClient } from '@/lib/stream-chat-client';

interface ChatPanelProps {
  channelId: string;
}

const ChatPanel = ({ channelId }: ChatPanelProps) => {
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    const createChannel = async () => {
      try {
        const ch = chatClient.channel('messaging', channelId);
        await ch.watch();
        setChannel(ch);
      } catch (error) {
        console.error('Error creating chat channel:', error);
      }
    };

    if (channelId) {
      createChannel();
    }

    return () => {
      if (channel) {
        channel.stopWatching();
      }
    };
  }, [channelId, channel]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!channel) {
    return (
      <div className="flex-center size-full bg-dark-1 text-white">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="size-full bg-dark-1 text-white">
      <Channel channel={channel}>
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-hidden">
            <MessageList />
          </div>
          <div className="p-2">
            <MessageInput />
          </div>
        </div>
      </Channel>
    </div>
  );
};

export default ChatPanel;
