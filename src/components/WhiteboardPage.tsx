import { useParams } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { useRef, useState,useEffect } from "react";
import WhiteboardCanvas from "../components/WhiteboardCanvas";
import ChatPanel from "../components/ChatPanel";
import axios from "axios";
import { Client } from "@stomp/stompjs";

export type Tool = "pen" | "eraser" | "rect" | "circle" | "line" | "text";

type Session = {
  id: string;
  title: string;
  code: string;
};

const WhiteboardPage = () => {
  const { id } = useParams();

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);

  const undoRef = useRef<() => void>(() => {});
  const redoRef = useRef<() => void>(() => {});
  const clearRef = useRef<() => void>(() => {});
  const downloadRef = useRef<() => void>(() => {});
  const pdfRef = useRef<() => void>(() => {});
  const stompClient = useRef<any>(null);
  const [cursors, setCursors] = useState<any[]>([]);

  const sessions: Session[] = JSON.parse(
    localStorage.getItem("sessions") || "[]"
  );

  const session = sessions.find((s) => s.id === id);

  const loginEmail = localStorage.getItem("loginEmail") || "Anonymous";
  const loginName = loginEmail.split("@")[0];

  const membersKey = `members_${id}`;

  const getMembers = (): string[] => {
    return JSON.parse(localStorage.getItem(membersKey) || "[]");
  };

  const [members, setMembers] = useState<string[]>(getMembers());

  useEffect(() => {
  if (!id) return;

  const client = new Client({
    brokerURL: "ws://localhost:8080/ws-whiteboard",
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("WebSocket connected");

      client.subscribe(`/topic/cursor/${id}`, (message) => {
        const cursor = JSON.parse(message.body);

        setCursors((prev) => {
          const filtered = prev.filter((c) => c.user !== cursor.user);
          return [...filtered, cursor];
        });
      });
    },
  });

  client.activate();
  stompClient.current = client;

  return () => {
    client.deactivate();
  };
}, [id]);


 const handleInvite = async () => {
  if (!inviteEmail.trim()) {
    alert("Please enter email id");
    return;
  }

  const joinLink = `${window.location.origin}/WhiteboardCanvas/${id}`;

  const inviteData = {
    toEmail: inviteEmail,
    invitedBy: loginName,
    sessionName: session?.title || "Whiteboard",
    sessionCode: session?.code || "N/A",
    joinLink: joinLink,
  };

  try {
    await axios.post("http://localhost:8080/api/invite/send", inviteData);

    const updatedMembers = [...members, inviteEmail];
    setMembers(updatedMembers);
    localStorage.setItem(membersKey, JSON.stringify(updatedMembers));

    alert("Invite email sent successfully!");

    setInviteEmail("");
    setShowInvite(false);
  } catch (error) {
    console.log(error);
    alert("Failed to send invite email.");
  }
};

  return (
    <div className="whiteboard-page">
      <header className="whiteboard-header">
        <div>
          <h1>{session?.title || "Whiteboard"}</h1>
          <p>
            Session Code: <b>{session?.code || "N/A"}</b>
          </p>
        </div>

        <div className="d-flex gap-3">
          <button className="btn btn-light">
            👥 {members.length + 1} participants
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setShowInvite(true)}
          >
            Invite Member
          </button>
        </div>
      </header>

      <div className="whiteboard-layout">
        <div className="board-area">
          <Toolbar
            tool={tool}
            setTool={setTool}
            color={color}
            setColor={setColor}
            size={size}
            setSize={setSize}
            undo={() => undoRef.current()}
            redo={() => redoRef.current()}
            clear={() => clearRef.current()}
            download={() => downloadRef.current()}
            pdf={() => pdfRef.current()}
          />

        <div style={{ position: "relative" }}>
  <WhiteboardCanvas
    tool={tool}
    color={color}
    size={size}
    sessionId={id || ""}
    username={loginName}
    stompClient={stompClient.current}
    undoRef={undoRef}
    redoRef={redoRef}
    clearRef={clearRef}
    downloadRef={downloadRef}
    pdfRef={pdfRef}
  />

  {cursors.map((cursor) => (
    <div
      key={cursor.user}
      style={{
        position: "absolute",
        left: cursor.x,
        top: cursor.y,
        pointerEvents: "none",
        color: "red",
        fontWeight: "bold",
        zIndex: 9999,
      }}
    >
      🖱 {cursor.user}
    </div>
  ))}
</div>
        </div>

        <ChatPanel />
      </div>

      {showInvite && (
        <div className="modal-overlay">
          <div className="custom-modal">
            <button
              className="close-btn"
              onClick={() => setShowInvite(false)}
            >
              ×
            </button>

            <h2>Invite Member</h2>

            <label className="form-label">Member Email</label>

            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter member email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />

            <button
              className="btn btn-primary w-100 mt-4"
              onClick={handleInvite}
            >
              Send Invite
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhiteboardPage;