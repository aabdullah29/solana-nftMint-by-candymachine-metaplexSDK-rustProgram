import React from "react";
import { Routes, Route } from "react-router";
import CreateNFT from "./pages/CreateNFT";

// import GetNFT from "./pages/GetNFT";
import Home from "./pages/Home";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create_nft/:walletAddress" element={<CreateNFT />} />

        {/* <Route path="/get_nft/:id" element={<GetNFT />} /> */}
      </Routes>
    </div>
  );
};

export default App;
