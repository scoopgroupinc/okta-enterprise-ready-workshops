import React, { useState } from 'react';

export const useOpenAi = () => {
  const [message, setMessage] = useState();
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);

    const msgs = chats;
    msgs.push({ role: 'user', content: message });
    setChats(msgs);

    setMessage('');

    fetch('/api/openai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chats,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        msgs.push(data.output);
        setChats(msgs);
        setIsTyping(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return { message, setMessage, chat, chats, isTyping };
};

export default useOpenAi;