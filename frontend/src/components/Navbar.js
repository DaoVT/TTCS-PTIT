import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      navigate("/login");
    } catch (err) {
      alert("Lỗi đăng xuất");
    }
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <Link to="/home">Trang chủ</Link>
        <Link to="/journal">Nhật kí</Link>
        <Link to="/add-meal">Thêm đồ ăn</Link>
        <Link to="/account">Tài khoản</Link>
      </div>

      <div className="nav-right">
        <button onClick={handleLogout}>Đăng xuất</button>
      </div>
    </div>
  );
}

export default Navbar;