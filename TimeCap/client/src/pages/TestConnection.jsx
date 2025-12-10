import React, { useState, useEffect } from 'react';

function TestConnection() {
  const [message, setMessage] = useState('Checking connection...');

  useEffect(() => {
    // 1. The effect runs once when the component is first rendered
    fetch('/api/test')
      .then(response => {
        // Handle non-200 responses (e.g., 404, 500)
        if (!response.ok) {
          throw new Error('Failed to connect to the backend API.');
        }
        // Since the Express route sends plain text, we use .text()
        return response.text();
      })
      .then(data => {
        // 2. Data received: update state to display the message
        setMessage(`Success! Backend says: "${data}"`);
      })
      .catch(error => {
        // 3. Connection failed: show the error message
        console.error('Connection Error:', error);
        setMessage('Connection Failed. Check your Node server and proxy settings.');
      });
  }, []); // The empty array ensures this runs only once

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Connection Test Status</h2>
      <p>{message}</p>
    </div>
  );
}

export default TestConnection;