import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import GoogleTranslate from './google_translate';
import { useSpeechSynthesis } from 'react-speech-kit';
function ChatUI() {
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const [showTranslate, setShowTranslate] = useState(false);
  const [enableTTS, setEnableTTS] = useState(false);
  const { speak } = useSpeechSynthesis();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }


  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };
  const handleStartListening = () => {
    SpeechRecognition.startListening();
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setMessage(transcript);

  };
  const handleResetClick = () => {
    axios.post('http://127.0.0.1:5000/chatbot', { message: '', reset: true })
      .then(response => {
        setMessageHistory([])
        setResponse(response.data.response);
      })
      .catch(error => {
        console.log(error);
      });
  };


  const handleTranslateToggle = () => {
    setShowTranslate(!showTranslate);
  };
  const handleSpeechToggle = () => {
    setEnableTTS(!enableTTS);
  };

  function showStatusMessages() {
    document.getElementById('status').style.display = 'block';
    document.getElementById('status').textContent = '';
    setTimeout(() => {
      document.getElementById('status').textContent = 'Thinking...';
    }, 2000);

    setTimeout(() => {
      document.getElementById('status').textContent = 'Fetching necessary data...';
    }, 5000);

    setTimeout(() => {
      document.getElementById('status').textContent = 'Typing...';
    }, 7000);

    setTimeout(() => {
      document.getElementById('status').textContent = 'Still typing...';
    }, 10000);

    setTimeout(() => {
      document.getElementById('status').textContent = 'This is taking longer than usual...';
    }, 40000);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:5000/chatbot', { message })
      .then(response => {
        document.getElementById('status').style.display = 'none';
        setMessageHistory([...messageHistory, { type: 'user', message }, { type: 'chatbot', message: response.data.response }]);
        if (enableTTS) {
          speak({ text: response.data.response })
        }
      })
      .catch(error => {
        document.getElementById('status').style.display = 'none';
      });

    showStatusMessages();

  };
  const handleDislikeClick = (question, response) => {
    axios.post('http://localhost:5000/dislike', { question, response })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleLikeClick = (question, response) => {
    axios
      .post('http://localhost:5000/like', { question, response })
      .then(response => {
        console.log(response);       
      })
      .catch(error => {
        console.log(error);
      });
  };


  return (
    <div className="App">
      {showTranslate && <GoogleTranslate />}
      <div className='chat-container'>
        <div className="message-history">
          {messageHistory.map((messageObj, index) => (
            <div key={index}>
              {messageObj.type === 'user' && <div className="user-message">{messageObj.message}</div>}
              {messageObj.type === 'chatbot' && (
                <div className="chatbot-message">
                  <div className="chat-text">{messageObj.message}</div>
                  <div className="chat-buttons">
                    <button className="like-button" onClick={() => handleLikeClick(messageHistory[index - 1].message, messageObj.message)}>
                      <i class="fas fa-thumbs-up"></i>
                    </button>
                    <button className="dislike-button" onClick={() => handleDislikeClick(messageHistory[index - 1].message, messageObj.message)}>
                      <i class="fas fa-thumbs-down"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div id="status" className="status chatbot-message"></div>
        </div>
        <form className="input-container" onSubmit={handleSubmit}>
          <input type="text" value={message} onChange={handleInputChange} />
          {listening ? (
            <button type="button" onClick={handleStopListening}>
              Stop Listening
            </button>
          ) : (
            <button type="button" onClick={handleStartListening}>
              <i className="fa fa-microphone"></i>
            </button>
          )}
          <button type="submit"><i class="fas fa-paper-plane"></i></button>
        </form>
        <div className="action-buttons">
          <button onClick={handleResetClick}><i class="fas fa-redo"></i>
            <span className='hide'>Reset</span>
          </button>
          <button onClick={handleTranslateToggle} ><i class="fas fa-globe"></i>
            <span className='hide'>Translate</span>
          </button>
          <button onClick={handleSpeechToggle}><i class="fas fa-volume-up"></i>
            <span className='hide'>Accessibility Mode</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default ChatUI;
