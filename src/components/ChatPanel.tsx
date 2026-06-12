import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";

type Message = {
  sessionId: string;
  sender: string;
  message: string;
  time: string;
};

function ChatPanel() {
  const { id } = useParams();

  const loginEmail = localStorage.getItem("loginEmail") || "Anonymous";
  const username = loginEmail.split("@")[0];

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    if (!id) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws-whiteboard",
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Connected");

        client.subscribe(`/topic/chat/${id}`, (msg) => {
          const receivedMessage: Message = JSON.parse(msg.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });
      },

      onStompError: (frame) => {
        console.log("STOMP Error", frame);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [id]);

  const sendMessage = () => {
    if (!message.trim() || !stompClient.current || !id) return;

    const chatMessage: Message = {
      sessionId: id,
      sender: username,
      message,
      time: new Date().toLocaleTimeString(),
    };

    stompClient.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(chatMessage),
    });

    setMessage("");
  };

  return (
    <div className="chat-panel">
      <h4>Live Chat</h4>

      <div className="chat-body">
        {messages.length === 0 ? (
          <p className="text-muted">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div className="chat-message" key={index}>
              <b>{msg.sender}</b>
              <p>{msg.message}</p>
              <small>{msg.time}</small>
            </div>
          ))
        )}
      </div>

      <div className="chat-input">
        <input
          className="form-control"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default ChatPanel;