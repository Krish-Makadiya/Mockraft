import { useState, useEffect } from "react";
import {
    useCreateChatClient,
    Chat,
    Channel,
    ChannelHeader,
    MessageInput,
    MessageList,
    Thread,
    Window,
} from "stream-chat-react";

import "stream-chat-react/dist/css/v2/index.css";

const apiKey = "mv99a4nsjsbb";
const userId = "user_2wU2wbHoaMUZP8f2mXLTlyqwYlJ";
const userName = "krishhhh";
const userToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcl8yd1Uyd2JIb2FNVVpQOGYybVhMVGx5cXdZbEoifQ.h0TOWrCel-nl4bEVsNI2zrEYPhlwGWFw1eIU2aZGqOQ";

const user = {
    id: userId,
    name: userName,
    image: `https://getstream.io/random_png/?name=${userName}`,
};

const App = () => {
    const [channel, setChannel] = useState();
    const client = useCreateChatClient({
        apiKey,
        tokenOrProvider: userToken,
        userData: user,
    });

    useEffect(() => {
        if (!client) return;

        const channel = client.channel("messaging", "mockraft_mv99a4nsjsbb", {
            image: "https://getstream.io/random_png/?name=react",
            name: "Mockraft Premium Community",
            members: [userId],
        });

        setChannel(channel);
    }, [client]);

    if (!client) return <div>Setting up client & connection...</div>;

    return (
        <Chat client={client}>
            <Channel channel={channel}>
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                </Window>
                <Thread />
            </Channel>
        </Chat>
    );
};

export default App;
