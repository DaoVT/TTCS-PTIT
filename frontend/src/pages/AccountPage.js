import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AccountPage() {
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: ""
  });

  const [bodyForm, setBodyForm] = useState({
    gender: "female",
    age: "",
    height_cm: "",
    current_weight_kg: "",
    activity_level_id: "2",
    goal_calories: ""
  });

  const loadProfile = async () => {
    try {
      const res = await api.get("/profile");
      setProfile(res.data);
      setForm({
        username: res.data.username,
        email: res.data.email
      });
    } catch (err) {
      console.log(err);
    }
  };

  const loadMetrics = async () => {
    try {
      const res = await api.get("/body-metrics");
      setMetrics(res.data);
    } catch (err) {
      setMetrics(null);
    }
  };

  useEffect(() => {
    loadProfile();
    loadMetrics();
  }, []);

  const handleProfileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBodyChange = (e) => {
    setBodyForm({ ...bodyForm, [e.target.name]: e.target.value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/profile", form);
      alert(res.data.message);
      loadProfile();
    } catch (err) {
      alert(err.response?.data?.error || "Lỗi cập nhật thông tin");
    }
  };

  const saveBodyMetrics = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/body-metrics", bodyForm);
      alert(res.data.message);
      loadMetrics();
    } catch (err) {
      alert(err.response?.data?.error || "Lỗi lưu thông số cơ thể");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h2>Tài khoản</h2>

        <div className="card">
          <h3>Thông tin cá nhân</h3>
          <form onSubmit={updateProfile}>
            <input name="username" value={form.username} onChange={handleProfileChange} />
            <br /><br />
            <input name="email" value={form.email} onChange={handleProfileChange} />
            <br /><br />
            <button type="submit">Cập nhật</button>
          </form>
        </div>

        <div className="card">
          <h3>Thông số cơ thể</h3>
          <form onSubmit={saveBodyMetrics}>
            <select name="gender" value={bodyForm.gender} onChange={handleBodyChange}>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
            <br /><br />

            <input name="age" type="number" placeholder="Tuổi" value={bodyForm.age} onChange={handleBodyChange} />
            <br /><br />

            <input name="height_cm" type="number" step="0.1" placeholder="Chiều cao" value={bodyForm.height_cm} onChange={handleBodyChange} />
            <br /><br />

            <input name="current_weight_kg" type="number" step="0.1" placeholder="Cân nặng" value={bodyForm.current_weight_kg} onChange={handleBodyChange} />
            <br /><br />

            <input name="activity_level_id" type="number" placeholder="Mức độ vận động (1-4)" value={bodyForm.activity_level_id} onChange={handleBodyChange} />
            <br /><br />

            <input name="goal_calories" type="number" placeholder="Mục tiêu calo" value={bodyForm.goal_calories} onChange={handleBodyChange} />
            <br /><br />

            <button type="submit">Lưu thông số</button>
          </form>
        </div>

        {metrics && (
          <div className="card">
            <h3>Chỉ số cơ thể</h3>
            <p><strong>BMI:</strong> {metrics.BMI}</p>
            <p><strong>BMR:</strong> {metrics.BMR}</p>
            <p><strong>TDEE:</strong> {metrics.TDEE}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountPage;