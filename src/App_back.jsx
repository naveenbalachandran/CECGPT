import React, { useState } from 'react';
import axios from 'axios';


function App() {
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
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

  const handleStopClick = () => {
    axios.post('http://127.0.0.1:5000/chatbot', { message: '', stop: true })
      .then(response => {
        setResponse(response.data.response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleContinueClick = () => {
    axios.post('http://127.0.0.1:5000/chatbot', { message: '', continue: true })
      .then(response => {
        setResponse(response.data.response);
       })
      .catch(error => {
        console.log(error);
      });
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
          console.log(response)
          document.getElementById('status').style.display = 'none';
          setMessageHistory([...messageHistory, { type: 'user', message }, { type: 'chatbot', message: response.data.response }]);
          
        })
        .catch(error => {
          document.getElementById('status').style.display = 'none';
        });

      showStatusMessages();

  };
  

  const renderMessage = (messageObj) => {
    if (messageObj.type === 'user') {
      return <div className="user-message">{messageObj.message}</div>;
    } else {
      return <div className="chatbot-message">{messageObj.message}</div>;
    }
  };

  return (
    <div className="App">      
      <div className='chat-container'>
        <div className="message-history">
            {messageHistory.map((messageObj, index) => (
              <div key={index}>
                {messageObj.type === 'user' && <div className="user-message">{messageObj.message}</div>}
                {messageObj.type === 'chatbot' && <div className="chatbot-message">{messageObj.message}</div>}
              </div>
            ))}
            <div id="status" className="status chatbot-message"></div>
        </div>
        <form className="input-container"onSubmit={handleSubmit}>
          <input type="text" value={message} onChange={handleInputChange} />
          <button type="submit"><i class="fas fa-paper-plane"></i></button>
        </form>
        <div className="action-buttons">
          <button onClick={handleResetClick}><i class="fas fa-redo"></i>
          <span className='hide'>Reset</span>
          </button>
          <button onClick={handleStopClick} ><i class="fas fa-stop"></i>
          <span className='hide'>Stop</span>
          </button>
          <button onClick={handleContinueClick}><i class="fas fa-play"></i>
          <span className='hide'>Continue</span>
          </button>
        </div>
          
      </div>
    </div>
  );
}

export default App;
