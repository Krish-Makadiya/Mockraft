import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import {
    Channel,
    Chat,
    MessageInput,
    MessageList,
    Window,
    useChannelStateContext,
    useCreateChatClient,
} from "stream-chat-react";
import "./layout.css";
import { useTheme } from "../../context/ThemeProvider";
import Loader from "../../components/main/Loader";

const CustomChannelHeader = () => {
    const { channel } = useChannelStateContext();

    if (!channel?.data) return null;

    const { name, image } = channel.data;
    const members = Object.values(channel.state.members || {});
    const totalMembers = members.length;
    const onlineMembers = members.filter(
        (member) => member.user?.online
    ).length;

    return (
        <div className="flex items-center gap-4 md:px-4 pl-14 py-4 bg-light-surface dark:bg-dark-bg shadow-sm">
            <img
                src={image || "https://via.placeholder.com/40"}
                alt={name}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div>
                <div className="font-semibold text-base text-light-primary-text dark:text-dark-primary-text">
                    {name || "Unnamed Channel"}
                </div>
                <div className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                    {totalMembers} member{totalMembers !== 1 && "s"} •{" "}
                    {onlineMembers} online
                </div>
            </div>
        </div>
    );
};

const CommunityContent = () => {
    const [channel, setChannel] = useState();
    const { user } = useUser();
    const { theme } = useTheme();

    const apiKey = import.meta.env.VITE_STREAM_KEY;

    const userData = {
        id: user.id,
        name: user.fullName,
        image: user.imageUrl,
    };

    const client = useCreateChatClient({
        apiKey,
        tokenOrProvider: user.publicMetadata.streamToken,
        userData: userData,
    });

    useEffect(() => {
        if (!client) return;

        const channel = client.channel(
            "messaging",
            import.meta.env.VITE_STREAM_SLUG,
            {
                image: "/logo-light.png",
                name: "Mockraft Premium Community",
                members: [user.id],
            }
        );
        setChannel(channel);
    }, [client]);

    if (!client) return <Loader />;

    return (
        <div className="md:h-screen h-[94%]">
            <Chat client={client}>
                <Channel
                    channel={channel}
                    MessageListNotifications={() => null}
                    FileUploadIcon={() => null}
                    messageActions={["edit", "delete", "react"]}>
                    <Window>
                        <CustomChannelHeader />
                        <MessageList />
                        <MessageInput />
                    </Window>
                </Channel>
            </Chat>
        </div>
    );
};

export default CommunityContent;
