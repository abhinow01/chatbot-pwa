import React, { useState, useRef } from 'react';
import { Input, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Card, CardContent } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
 import StopIcon from '@mui/icons-material/Stop';
//  import ChatLogic from './ChatLogic';

function ChatBot() {
  const [userInput, setUserInput] = useState('');
  const [recording, setRecording] = useState(null);
  const [botReplies, setBotReplies] = useState([]);
  const [voiceNotes, setVoiceNotes] = useState([]);


  const handleUserInput = (input) => {
    setUserInput(input);
  };

  const mediaRecorderRef = useRef(null);

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = () => {
    const botReply = 'Bot response to: ' + userInput;
    setBotReplies([...botReplies, botReply]);
    setUserInput('');

    if (recording) {
      // Push the recording to voiceNotes
      setVoiceNotes([...voiceNotes, recording]);
      setRecording(null);
    }
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
        saveRecordingToIndexedDB(audioBlob); // Save the recording immediately after it stops
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
  
      const request = window.indexedDB.open(dbName, dbVersion);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('audioStore', { autoIncrement: true });
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['audioStore'], 'readwrite');
        const objectStore = transaction.objectStore('audioStore');
  
        const addRequest = objectStore.add(audioBlob);
  
        addRequest.onsuccess = () => {
          console.log('Recording saved to IndexedDB');
        };
  
        addRequest.onerror = (error) => {
          console.error('Error saving recording to IndexedDB:', error);
        };
      };
  
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
    }
  };
  
  const handleSaveClick = () => {
    saveRecordingToIndexedDB(recording);
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
      {/* <ChatLogic userInput={userInput} setUserInput={handleUserInput} setBotReplies={setBotReplies} /> */}
        {botReplies.map((reply, index) => (
          <div key={index} className={reply.startsWith('Bot') ? 'text-blob-left' : 'text-blob-right'}>
            {reply}
          </div>
        ))}
      </div>

      <div className='voice-notes-container'>
        {voiceNotes.map((voiceNote, index) => (
          <Card key={index} className='voice-note-card'style={{
            backgroundColor: 'transparent', 
            border: 'none', 
            borderRadius: '5px', 
            padding: '10px',
            marginBottom: '10px',
          }}>
            <CardContent>
              <audio controls style={{
        width: '100%',
        backgroundColor: 'transparent', 
      }}>
                <source src={URL.createObjectURL(voiceNote)} type='audio/wav' />
                Your browser does not support the audio element.
              </audio>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='human-input'>
        <Input
          placeholder='Ask me something'
          value={userInput}
          onChange={handleChange}
          style={{color: 'white'}}
        />
        <IconButton onClick={sendMessage}>
          <SendIcon style={{color: 'white'}}/>
        </IconButton>
        <IconButton onMouseDown={startRecording}>
          <MicIcon style={{color: 'white'}}/>
        </IconButton>
        <IconButton onClick={stopRecording}>
          <StopIcon style={{color: 'white'}} />
        </IconButton>
        <Button onClick={handleSaveClick}style={{color: 'white'}}>save</Button>
      </div>

      
    </div>
  );
}


export default ChatBot;
