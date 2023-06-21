import React, { useState, useEffect } from "react";
import axios from "axios";
import "../component_styles/adminpanel.css";
const BackendURL = "http://127.0.0.1:5000";

const DislikedAdminPanel = () => {
  const [dislikes, setDislikes] = useState([]);
  const [modifiedResponses, setModifiedResponses] = useState([]);

  useEffect(() => {
    fetchDislikes();
  }, []);

  const fetchDislikes = async () => {
    try {
      const response = await axios.get(`${BackendURL}/dislikes`);
      setDislikes(response.data);
      setModifiedResponses(Array(response.data.length).fill(""));
    } catch (error) {
      console.error("Error fetching dislikes:", error);
    }
  };

  const handleSubmit = async (e, index) => {
    e.preventDefault();

    // Prepare the data for the post request
    const data = {
      question: dislikes[index].question,
      modifiedResponse: modifiedResponses[index],
    };

    try {
      await axios.post(`${BackendURL}/admin-ans`, data);
      const newModifiedResponses = [...modifiedResponses];
      newModifiedResponses[index] = ""; // Reset the input field
      setModifiedResponses(newModifiedResponses);
      fetchDislikes(); // Refresh the dislikes list
    } catch (error) {
      console.error("Error submitting modified response:", error);
    }
  };

  const handleModifiedResponseChange = (e, index) => {
    const newModifiedResponses = [...modifiedResponses];
    newModifiedResponses[index] = e.target.value;
    setModifiedResponses(newModifiedResponses);
  };

  return (
    <div className="AdminPanelDislikes" id="adminPanel">
      <h1>Disliked Questions and Responses</h1>
      {dislikes.map((dislike, index) => (
        <div key={index} className="card">
          <h3>{dislike.question}</h3>
          <p>{dislike.response}</p>
          <form onSubmit={(e) => handleSubmit(e, index)}>
            <textarea
              value={modifiedResponses[index]}
              onChange={(e) => handleModifiedResponseChange(e, index)}
              placeholder="Provide a better answer"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default DislikedAdminPanel;
