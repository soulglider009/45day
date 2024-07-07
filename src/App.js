import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const socket = io('http://localhost:4000');

const colors = ['red', 'blue', 'green', 'purple', 'orange'];

function App() {
  const [mousePositions, setMousePositions] = useState({});
  const [users, setUsers] = useState({});
  const [currentUser] = useState({
    id: uuidv4(),
    color: colors[Math.floor(Math.random() * colors.length)],
  });

  useEffect(() => {
    socket.on('mouseMove', (data) => {
      setMousePositions((prev) => ({ ...prev, [data.user.id]: data.position }));
      setUsers((prev) => ({ ...prev, [data.user.id]: data.user }));
    });

    return () => {
      socket.off('mouseMove');
    };
  }, []);

  const handleMouseMove = (e) => {
    const position = { x: e.clientX, y: e.clientY };
    socket.emit('mouseMove', { user: currentUser, position });
  };

  return (
    <div className="App" onMouseMove={handleMouseMove}>
      <div id="icons-container">
        <div
          className="icon"
          style={{ borderColor: currentUser.color }}
        >
          {currentUser.id.slice(0, 1).toUpperCase()}
        </div>
        {Object.values(users).map(user => (
          user.id !== currentUser.id && (
            <div
              key={user.id}
              className="icon"
              style={{ borderColor: user.color }}
            >
              {user.id.slice(0, 1).toUpperCase()}
            </div>
          )
        ))}
      </div>
      <div id="content">
        {/* Main content here */}
      </div>
      {Object.entries(mousePositions).map(([userId, position]) => (
        <div
          key={userId}
          className="cursor"
          style={{
            top: position.y,
            left: position.x,
            backgroundColor: users[userId]?.color,
            display: currentUser.id === userId ? 'none' : 'block', // Hide current user's cursor
          }}
        />
      ))}
      <div
        className="cursor"
        style={{
          top: mousePositions[currentUser.id]?.y,
          left: mousePositions[currentUser.id]?.x,
          backgroundColor: currentUser.color,
        }}
      />
    </div>
  );
}

export default App;
