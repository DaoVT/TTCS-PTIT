import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function JournalPage() {
  const [history, setHistory] = useState([]);
  const [dailyCalories, setDailyCalories] = useState([]);
  const [energy, setEnergy] = useState([]);
  const [body, setBody] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const h = await api.get("/nutrition-history");
      const c = await api.get("/daily-calories");
      const e = await api.get("/energy-balance");
      const b = await api.get("/body-metrics");

      setHistory(h.data);
      setDailyCalories(c.data);
      setEnergy(e.data);
      setBody(b.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h2>Nhật kí dinh dưỡng</h2>

        {/* TDEE + BMR */}
        {body && (
          <div>
            <h3>Chỉ số cơ thể</h3>
            <p>BMI: {body.BMI}</p>
            <p>BMR: {body.BMR}</p>
            <p>TDEE: {body.TDEE}</p>
          </div>
        )}

        {/* Tổng calo */}
        <h3>Tổng calo theo ngày</h3>
        {dailyCalories.map((d, i) => (
          <p key={i}>
            {d.meal_date}: {d.total_calories} kcal
          </p>
        ))}

        {/* Trạng thái năng lượng */}
        <h3>Trạng thái năng lượng</h3>
        {energy.map((e, i) => (
          <div key={i}>
            <p>Ngày: {e.meal_date}</p>
            <p>Calo: {e.total_calories}</p>
            <p>TDEE: {e.TDEE}</p>
            <p>Chênh lệch: {e.calorie_balance}</p>
            <p>Trạng thái: {e.energy_status}</p>
            <hr />
          </div>
        ))}

        {/* Lịch sử chi tiết */}
        <h3>Lịch sử ăn uống</h3>
        {history.map((item, i) => (
          <div key={i}>
            <p>
              {item.meal_date} - {item.meal_type}
            </p>
            <p>
              {item.food_name} ({item.quantity_g}g) - {item.calories} kcal
            </p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default JournalPage;