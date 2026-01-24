'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { Chat } from 'stream-chat-react';
import { useParams } from 'next/navigation';
import { Loader } from 'lucide-react';

import { useGetCallById } from '@/hooks/useGetCallById';
import { tokenProvider } from '@/actions/stream.actions';
import {
  connectUserToChat,
  disconnectUserFromChat,
  chatClient,
} from '@/lib/stream-chat-client';
import Alert from '@/components/Alert';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';

const MeetingPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    const connectChat = async () => {
      if (user && call) {
        try {
          const token = await tokenProvider();
          await connectUserToChat(user.id, token);
        } catch (error) {
          console.error('Error connecting to chat:', error);
        }
      }
    };

    connectChat();

    return () => {
      disconnectUserFromChat();
    };
  }, [user, call]);

  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call)
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );

  // get more info about custom call type:  https://getstream.io/video/docs/react/guides/configuring-call-types/
  const notAllowed =
    call.type === 'invited' &&
    (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed)
    return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="h-screen w-full">
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <StreamCall call={call}>
          <StreamTheme>
            {!isSetupComplete ? (
              <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
            ) : (
              <MeetingRoom />
            )}
          </StreamTheme>
        </StreamCall>
      </Chat>
    </main>
  );
};

export default MeetingPage;
