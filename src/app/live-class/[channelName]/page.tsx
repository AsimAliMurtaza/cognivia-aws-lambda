"use client";
import { useEffect, useRef, useState } from "react";
import AgoraRTC, { IAgoraRTCRemoteUser, ILocalTrack } from "agora-rtc-sdk-ng";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  Text,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID as string;

interface LiveClassRoomProps {
  params: { channelName: string };
}

export default function LiveClassRoom({ params }: LiveClassRoomProps) {
  const { channelName } = params;
  const searchParams = useSearchParams();
  const uid =
    searchParams.get("uid") || String(Math.floor(Math.random() * 100000));

  const clientRef = useRef<ReturnType<typeof AgoraRTC.createClient> | null>(
    null
  );
  const localTracks = useRef<ILocalTrack[]>([]);
  const [joinedUsers, setJoinedUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Color mode values
  const borderColor = useColorModeValue("teal.500", "teal.200");
  const buttonBg = useColorModeValue("white", "gray.800");
  const buttonHoverBg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const start = async () => {
      try {
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        const res = await fetch(
          `/api/agora/token?channelName=${channelName}&uid=${uid}`
        );
        const { token } = await res.json();

        await client.join(appId, channelName, token, uid);

        const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracks.current = [mic, cam];
        await client.publish(localTracks.current);

        const localPlayer = document.getElementById("local-player");
        if (localPlayer) {
          cam.play(localPlayer);
        }

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            const container = document.createElement("div");
            container.id = user.uid.toString();
            container.style.width = "100%";
            container.style.height = "100%";
            document.getElementById("remote-players")?.appendChild(container);
            user.videoTrack?.play(container);
          }
          setJoinedUsers((prev) => [...prev, user]);
        });

        client.on("user-unpublished", (user) => {
          document.getElementById(user.uid.toString())?.remove();
          setJoinedUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });

        client.on("user-left", (user) => {
          document.getElementById(user.uid.toString())?.remove();
          setJoinedUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });
      } catch (error) {
        console.error("Error starting Agora session:", error);
      }
    };

    start();

    return () => {
      localTracks.current.forEach((track) => {
        if (track) {
          track.stop();
          track.close();
        }
      });
      if (clientRef.current) {
        clientRef.current.leave();
      }
    };
  }, [channelName, uid]);

  const handleMute = () => {
    if (!localTracks.current[0]) return;
    localTracks.current[0].setEnabled(!isMuted);
    setIsMuted(!isMuted);
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Live Class: {channelName}</Heading>

      <HStack spacing={4} mb={4}>
        <Button
          onClick={handleMute}
          leftIcon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          bg={buttonBg}
          _hover={{ bg: buttonHoverBg }}
        >
          {isMuted ? "Unmute" : "Mute"}
        </Button>
      </HStack>

      <Box
        id="local-player"
        border={`2px solid ${borderColor}`}
        borderRadius="lg"
        w="100%"
        h="300px"
        mb={6}
      />

      <Heading size="md" mb={2}>
        Participants
      </Heading>
      <HStack id="remote-players" spacing={4} wrap="wrap" align="start" />

      <VStack align="start" mt={6}>
        {joinedUsers.map((user) => (
          <HStack key={user.uid.toString()}>
            <Avatar size="sm" name={`User ${user.uid}`} />
            <Text>User {user.uid}</Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
