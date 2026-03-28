import React from "react";
import Navbar from "../components/Navbar";

function HomePage() {
  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h2>Trang chủ</h2>
        <p>Chào mừng bạn đến với hệ thống quản lý dinh dưỡng.</p>
      </div>
    </div>
  );
}

export default HomePage;