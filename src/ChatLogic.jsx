
/// {{ THIS FILE IS COMMENTED AS THIS WAS NOT REQUIRED IN THE TASK , I AM WORKING ON THIS SIDE BY SIDE }}///

// ChatLogic.js
// import React, { useState, useEffect } from 'react';

// export default function ChatLogic({ userInput, setBotRepliesProp }) {
//     const [botReplies, setBotReplies] = useState([]);
//     const [botHistory, setBotHistory] = useState([]);

//     const matchReply = (userInput) => {
//         const botReply = generateBotReply(userInput);
//         setBotHistory([...botHistory, `Bot: ${botReply}`]);
//         setBotReplies([...botReplies, `Bot: ${botReply}`]);
//     };

//   const generateBotReply = (userInput) => {
//     // Your matching and reply logic goes here...
//     const trigger = [
//       ["hi", "hey", "hello"],
//       ["how are you", "how are things", "how you doing"],
//       ["what is going on", "what is up"],
//       ["happy", "good", "amazing", "fantastic", "cool"],
//       ["bad", "bored", "tired", "sad"],
//       ["thanks", "thank you"],
//       ["bye", "good bye", "goodbye"]
//     ];

//     const reply = [
//       ["Hello", "Hi", "It's nice seeing you!"],
//       ["I'm doing good... how are you?", "I feel kind of lonely, how are you?", "I feel happy, how are you?"],
//       ["Nothing much", "Exciting things!", "I'm happy to see you!"],
//       ["Glad to hear it", "Yayyy!! That's the spirit!"],
//       ["There is always a rainbow after the rain!"],
//       ["You're welcome", "No problem", "It's my pleasure!"],
//       ["Goodbye, it was a nice talk"]
//     ];

//     const alternative = ["Same", "Go on...", "Try again please?", "I'm listening..."];

//     let botMsg = generateReply(trigger, reply, userInput);

//     if (!botMsg) {
//       botMsg = alternative[Math.floor(Math.random() * alternative.length)];
//     }

//     return botMsg;
//   };

//   const generateReply = (trigger, reply, text) => {
//     let item;
//     for (let x = 0; x < trigger.length; x++) {
//       for (let y = 0; y < trigger[x].length; y++) {
//         if (text.toLowerCase().includes(trigger[x][y])) {
//           item = reply[x][Math.floor(Math.random() * reply[x].length)];
//           return item;
//         }
//       }
//     }
//     return null;
//   };

//   useEffect(() => {
//     matchReply(userInput);
// }, [userInput]);

// // Ensure that setBotRepliesProp is updated with the botReplies state
// useEffect(() => {
//     setBotRepliesProp(botReplies);
// }, [botReplies, setBotRepliesProp]);

// return null;
// }
