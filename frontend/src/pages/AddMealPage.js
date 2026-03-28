import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AddMealPage() {
  const [foods, setFoods] = useState([]);
  const [meals, setMeals] = useState([]);
  const [selectedMealId, setSelectedMealId] = useState("");
  const [createdMealInfo, setCreatedMealInfo] = useState(null);

  const [mealForm, setMealForm] = useState({
    meal_date: "",
    meal_type: "Sáng",
    meal_time: "",
    note: ""
  });

  const [foodForm, setFoodForm] = useState({
    food_id: "",
    quantity_g: ""
  });

  const [customFoodForm, setCustomFoodForm] = useState({
    food_name: "",
    protein_per_100g: "",
    carbs_per_100g: "",
    fat_per_100g: ""
  });

  const [showCustomFoodForm, setShowCustomFoodForm] = useState(false);
  const [loadingMeal, setLoadingMeal] = useState(false);
  const [loadingFood, setLoadingFood] = useState(false);
  const [loadingCustomFood, setLoadingCustomFood] = useState(false);

  const loadFoods = async () => {
    try {
      const res = await api.get("/foods");
      setFoods(res.data || []);
    } catch (err) {
      console.log("Lỗi tải foods:", err);
    }
  };

  const loadMeals = async () => {
    try {
      const res = await api.get("/meals");
      setMeals(res.data || []);
    } catch (err) {
      console.log("Lỗi tải meals:", err);
    }
  };

  useEffect(() => {
    loadFoods();
    loadMeals();
  }, []);

  const handleMealChange = (e) => {
    setMealForm({ ...mealForm, [e.target.name]: e.target.value });
  };

  const handleFoodChange = (e) => {
    setFoodForm({ ...foodForm, [e.target.name]: e.target.value });
  };

  const handleCustomFoodChange = (e) => {
    setCustomFoodForm({ ...customFoodForm, [e.target.name]: e.target.value });
  };

  const handleCreateMeal = async (e) => {
    e.preventDefault();

    if (!mealForm.meal_date || !mealForm.meal_type) {
      alert("Vui lòng chọn ngày ăn và loại bữa ăn");
      return;
    }

    try {
      setLoadingMeal(true);

      const payload = {
        meal_date: mealForm.meal_date,
        meal_type: mealForm.meal_type,
        meal_time: mealForm.meal_time || null,
        note: mealForm.note || ""
      };

      const res = await api.post("/meals", payload);

      alert(res.data.message || "Tạo bữa ăn thành công");

      const newMealId = String(res.data.meal_id);
      setSelectedMealId(newMealId);
      setCreatedMealInfo({
        meal_id: newMealId,
        meal_date: mealForm.meal_date,
        meal_type: mealForm.meal_type,
        meal_time: mealForm.meal_time
      });

      await loadMeals();
    } catch (err) {
      alert(err.response?.data?.error || "Lỗi tạo bữa ăn");
    } finally {
      setLoadingMeal(false);
    }
  };

  const handleCreateCustomFood = async (e) => {
    e.preventDefault();

    if (!customFoodForm.food_name) {
      alert("Vui lòng nhập tên món ăn");
      return;
    }

    try {
      setLoadingCustomFood(true);

      const payload = {
        food_name: customFoodForm.food_name,
        protein_per_100g: customFoodForm.protein_per_100g || 0,
        carbs_per_100g: customFoodForm.carbs_per_100g || 0,
        fat_per_100g: customFoodForm.fat_per_100g || 0
      };

      const res = await api.post("/foods", payload);
      alert(res.data.message || "Tạo món ăn thành công");

      await loadFoods();

      setCustomFoodForm({
        food_name: "",
        protein_per_100g: "",
        carbs_per_100g: "",
        fat_per_100g: ""
      });

      setShowCustomFoodForm(false);
    } catch (err) {
      alert(err.response?.data?.error || "Lỗi tạo món ăn riêng");
    } finally {
      setLoadingCustomFood(false);
    }
  };

  const handleAddFoodToMeal = async (e) => {
    e.preventDefault();

    if (!selectedMealId) {
      alert("Vui lòng tạo bữa ăn hoặc chọn bữa ăn trước");
      return;
    }

    if (!foodForm.food_id || !foodForm.quantity_g) {
      alert("Vui lòng chọn món ăn và nhập khối lượng");
      return;
    }

    try {
      setLoadingFood(true);

      const payload = {
        meal_id: selectedMealId,
        food_id: foodForm.food_id,
        quantity_g: foodForm.quantity_g
      };

      const res = await api.post("/nutrition-logs", payload);
      alert(res.data.message || "Thêm món ăn thành công");

      setFoodForm({
        food_id: "",
        quantity_g: ""
      });
    } catch (err) {
      alert(err.response?.data?.error || "Lỗi thêm món ăn vào bữa");
    } finally {
      setLoadingFood(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="page-container">
        <h2>Thêm đồ ăn</h2>

        <div className="card">
          <h3>Bước 1: Tạo bữa ăn</h3>

          <form onSubmit={handleCreateMeal}>
            <label>Ngày ăn</label>
            <br />
            <input
              type="date"
              name="meal_date"
              value={mealForm.meal_date}
              onChange={handleMealChange}
            />
            <br /><br />

            <label>Loại bữa ăn</label>
            <br />
            <select
              name="meal_type"
              value={mealForm.meal_type}
              onChange={handleMealChange}
            >
              <option value="Sáng">Sáng</option>
              <option value="Phụ sáng">Phụ sáng</option>
              <option value="Trưa">Trưa</option>
              <option value="Phụ chiều">Phụ chiều</option>
              <option value="Tối">Tối</option>
            </select>
            <br /><br />

            <label>Giờ ăn</label>
            <br />
            <input
              type="time"
              name="meal_time"
              value={mealForm.meal_time}
              onChange={handleMealChange}
            />
            <br /><br />

            <label>Ghi chú</label>
            <br />
            <input
              type="text"
              name="note"
              placeholder="Ví dụ: ăn tại nhà"
              value={mealForm.note}
              onChange={handleMealChange}
            />
            <br /><br />

            <button type="submit" disabled={loadingMeal}>
              {loadingMeal ? "Đang tạo..." : "Tạo bữa ăn"}
            </button>
          </form>

          {createdMealInfo && (
            <div style={{ marginTop: "16px" }}>
              <p>
                <strong>Đã tạo bữa ăn:</strong> {createdMealInfo.meal_date} - {createdMealInfo.meal_type}
                {createdMealInfo.meal_time ? ` - ${createdMealInfo.meal_time}` : ""}
              </p>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Bước 2: Chọn bữa ăn để thêm món</h3>

          <label>Chọn bữa ăn đã tạo</label>
          <br />
          <select
            value={selectedMealId}
            onChange={(e) => setSelectedMealId(e.target.value)}
          >
            <option value="">-- Chọn bữa ăn --</option>
            {meals.map((meal) => (
              <option key={meal.meal_id} value={meal.meal_id}>
                {meal.meal_date} - {meal.meal_type} {meal.meal_time ? `- ${meal.meal_time}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="card">
          <h3>Bước 3: Chọn món ăn</h3>

          <form onSubmit={handleAddFoodToMeal}>
            <label>Danh sách món phổ biến</label>
            <br />
            <select
              name="food_id"
              value={foodForm.food_id}
              onChange={handleFoodChange}
            >
              <option value="">-- Chọn món ăn --</option>
              {foods.map((food) => (
                <option key={food.food_id} value={food.food_id}>
                  {food.food_name}
                </option>
              ))}
            </select>
            <br /><br />

            <label>Khối lượng đã ăn (g / ml)</label>
            <br />
            <input
              type="number"
              name="quantity_g"
              placeholder="Ví dụ: 150"
              value={foodForm.quantity_g}
              onChange={handleFoodChange}
            />
            <br /><br />

            <button type="submit" disabled={loadingFood}>
              {loadingFood ? "Đang thêm..." : "Thêm món vào bữa ăn"}
            </button>
          </form>

          <br />

          <button onClick={() => setShowCustomFoodForm(!showCustomFoodForm)}>
            {showCustomFoodForm ? "Ẩn tạo đồ ăn riêng" : "Tạo đồ ăn riêng"}
          </button>

          {showCustomFoodForm && (
            <form onSubmit={handleCreateCustomFood} style={{ marginTop: "20px" }}>
              <h4>Tạo món ăn riêng</h4>

              <label>Tên món</label>
              <br />
              <input
                type="text"
                name="food_name"
                value={customFoodForm.food_name}
                onChange={handleCustomFoodChange}
              />
              <br /><br />

              <label>Chất đạm / 100g hoặc 100ml</label>
              <br />
              <input
                type="number"
                step="0.1"
                name="protein_per_100g"
                value={customFoodForm.protein_per_100g}
                onChange={handleCustomFoodChange}
              />
              <br /><br />

              <label>Đường bột / 100g hoặc 100ml</label>
              <br />
              <input
                type="number"
                step="0.1"
                name="carbs_per_100g"
                value={customFoodForm.carbs_per_100g}
                onChange={handleCustomFoodChange}
              />
              <br /><br />

              <label>Chất béo / 100g hoặc 100ml</label>
              <br />
              <input
                type="number"
                step="0.1"
                name="fat_per_100g"
                value={customFoodForm.fat_per_100g}
                onChange={handleCustomFoodChange}
              />
              <br /><br />

              <button type="submit" disabled={loadingCustomFood}>
                {loadingCustomFood ? "Đang lưu..." : "Lưu món ăn riêng"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddMealPage;