import React from "react";
import ChatUI from "./components/ChatUI";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DislikedAdminPanel from "./components/DislikedAdminPanel";
const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<ChatUI />} />
                <Route path="/admin-dislikes" element={<DislikedAdminPanel />} />
            </Routes>
        </div>
    );
};

export default App;
