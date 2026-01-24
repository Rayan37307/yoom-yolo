import { StreamChat } from 'stream-chat';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

if (!STREAM_API_KEY) {
  throw new Error('Stream API key is missing');
}

export const chatClient = StreamChat.getInstance(STREAM_API_KEY);

export const connectUserToChat = async (userId: string, token: string) => {
  await chatClient.connectUser({ id: userId }, token);
};

export const disconnectUserFromChat = async () => {
  await chatClient.disconnectUser();
};
