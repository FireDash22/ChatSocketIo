import React, { useState, useEffect } from 'react'
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const reciveMessage = (message) => {
      setMessages([message, ...messages])

    }
    socket.on('message', reciveMessage)

    return () => {
      socket.off('message', reciveMessage)
    }
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      body: message,
      from: "Me",
    }
    setMessages([newMessage, ...messages])
    setMessage("");
    socket.emit('message', newMessage.body);
  }

  return (
    <div className="h-screen bg-[#1c273d] text-white flex items-center justify-center App">
      <form onSubmit={handleSubmit} className="bg-[#3b90ba] p-10 rounded-lg border-2 border-sky-500 fondo-chat">
        <h1 className="text-2xl font-bold my-2">Chat</h1>
        <input 
        name="message"
        type="text" 
        placeholder="Write your message..."
        onChange={e => setMessage(e.target.value)}
        className="border-2 border-zinc-500 p-2 w-full text-black"
        value={message}
        autoFocus
        />
        <button>Send</button>
      <ul className="h-80 overflow-y-auto">
      { messages?.map((message, index ) => (
        <li
        key={index}
        className={`my-2 p-2 table text-sm rounded-md ${
              message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"
            }`}
            >
              <b>{message.from}</b>: {message.body}
            </li>
          ))
        }
      </ul>
      </form>
    </div>
  );
}

export default App;
