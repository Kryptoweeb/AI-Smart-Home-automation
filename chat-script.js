const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');
let isListening = false;

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
};

const addMessage = (sender, text, isTyping = false) => {
  const div = document.createElement('div');
  div.className = `message ${sender.toLowerCase()} ${isTyping ? 'typing' : ''}`;
  if (isTyping) {
    div.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
  } else {
    div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  }
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

const removeTypingIndicator = () => {
  const typing = chatWindow.querySelector('.typing');
  if (typing) typing.remove();
};

const getAIResponse = (message) => {
  const responses = {
    'hello': 'Hi there! How can I help you today?',
    'hi': 'Hello! What can I do for you?',
    'how are you': 'I\'m doing great, thanks for asking! How can I assist you?',
    'turn on lights': 'Turning on the lights for you.',
    'turn off lights': 'Turning off the lights for you.',
    'play music': 'Playing your favorite playlist.',
    'stop music': 'Stopping the music.',
    'temperature': 'The current temperature is 22°C.',
    'weather': 'It\'s a sunny day with a high of 25°C.',
    'time': new Date().toLocaleTimeString(),
  };

  const defaultResponses = [
    'I\'m here to help! What would you like me to do?',
    'I\'m not sure about that. Could you rephrase?',
    'I\'m still learning. Could you try a different command?',
    'I understand you\'re trying to interact with your smart home. What specifically would you like to control?'
  ];

  const lowercaseMessage = message.toLowerCase();
  for (const [key, response] of Object.entries(responses)) {
    if (lowercaseMessage.includes(key)) {
      return response;
    }
  }
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

const sendMessage = async (message) => {
  if (!message.trim()) return;
  addMessage('User', message);
  userInput.value = '';
  addMessage('AIVA', '', true); // Typing indicator

  // Simulate AI processing time
  setTimeout(() => {
    removeTypingIndicator();
    const response = getAIResponse(message);
    addMessage('AIVA', response);
    speak(response);
  }, 1000);
};

sendBtn.addEventListener('click', () => sendMessage(userInput.value));
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage(userInput.value);
});

voiceBtn.addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition not supported. Please use Chrome/Edge.');
    return;
  }

  if (isListening) {
    window.recognition?.stop();
    return;
  }

  window.recognition = new window.webkitSpeechRecognition();
  window.recognition.lang = 'en-US';
  window.recognition.continuous = false;
  window.recognition.interimResults = true;

  window.recognition.onstart = () => {
    isListening = true;
    voiceBtn.classList.add('active');
    addMessage('AIVA', 'Listening...', true);
  };

  window.recognition.onend = () => {
    isListening = false;
    voiceBtn.classList.remove('active');
    removeTypingIndicator();
  };

  window.recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (event.results[0].isFinal) {
      removeTypingIndicator();
      sendMessage(transcript);
    }
  };

  window.recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isListening = false;
    voiceBtn.classList.remove('active');
    removeTypingIndicator();
    addMessage('AIVA', 'Sorry, I couldn\'t hear that. Please try again.');
  };

  window.recognition.start();
});

// Initial Message
setTimeout(() => {
  speak('Hi! How can I help with your smart home today?');
}, 1000);