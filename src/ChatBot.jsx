import React, { useState, useRef } from 'react';
import { Input, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

function ChatBot() {
  const [userInput, setUserInput] = useState('');
  const [recording, setRecording] = useState(null);
  const [botReplies, setBotReplies] = useState([]);
  const mediaRecorderRef = useRef(null);

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = () => {
    const botReply = 'Bot response to: ' + userInput;
    setBotReplies([...botReplies, botReply]);
    setUserInput('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setRecording(audioBlob);
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const saveRecordingToIndexedDB = async (audioBlob) => {
    try {
      const dbName = 'audioDB';
      const dbVersion = 1;
  
      // Open database
      const request = window.indexedDB.open(dbName, dbVersion);
  
      // Database open success handler
      request.onsuccess = (event) => {
        const db = event.target.result;
  
        // Transaction and object store
        const transaction = db.transaction(['audioStore'], 'readwrite');
        const objectStore = transaction.objectStore('audioStore');
  
        // Get the count of existing recordings
        const countRequest = objectStore.count();
        countRequest.onsuccess = (countEvent) => {
          const count = countEvent.target.result;
  
          // Store audio blob with a unique key (count + 1)
          const addRequest = objectStore.add(audioBlob, count + 1);
          addRequest.onsuccess = () => {
            console.log('Recording saved to IndexedDB');
          };
          addRequest.onerror = (error) => {
            console.error('Error saving recording to IndexedDB:', error);
          };
        };
      };
  
      // Handle errors
      request.onerror = (error) => {
        console.error('Error opening IndexedDB:', error);
      };
    } catch (error) {
      console.error('IndexedDB operation failed:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();

      if (recording) {
        saveRecordingToIndexedDB(recording);
      }
    }
  };

  const playRecording = () => {
    if (recording) {
      const audioURL = URL.createObjectURL(recording);
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  return (
    <div className='chatbot-card'>
      <div className='conversation-box'>
        {botReplies.map((reply, index) => (
          <div key={index} id='bot-reply'>
            {reply}
          </div>
        ))}
      </div>

      <div className='human-input'>
        <Input
          placeholder='Ask me something'
          value={userInput}
          onChange={handleChange}
        />
        <IconButton onClick={sendMessage}>
          <SendIcon />
        </IconButton>
        <IconButton onMouseDown={startRecording}>
          <MicIcon />
        </IconButton>
        <IconButton onClick={stopRecording}>
          <StopIcon />
        </IconButton>
        <IconButton onClick={playRecording}>
          Play
        </IconButton>
      </div>
    </div>
  );
}

export default ChatBot;
