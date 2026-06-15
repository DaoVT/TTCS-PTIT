CREATE DATABASE IF NOT EXISTS nutrition_system
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE nutrition_system;

CREATE TABLE users (
id BIGINT AUTO_INCREMENT PRIMARY KEY,

email VARCHAR(255) NOT NULL UNIQUE,
phone VARCHAR(20) NOT NULL UNIQUE,

password_hash VARCHAR(255) NOT NULL,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP

);

CREATE TABLE activity_levels (
id INT AUTO_INCREMENT PRIMARY KEY,

code VARCHAR(50) UNIQUE NOT NULL,
name VARCHAR(100) NOT NULL,

factor DECIMAL(5,3) NOT NULL

);

INSERT INTO activity_levels(code,name,factor)
VALUES
('sedentary','Sedentary',1.200),
('light','Lightly Active',1.375),
('moderate','Moderately Active',1.550),
('very_active','Very Active',1.725);

CREATE TABLE health_profiles (
id BIGINT AUTO_INCREMENT PRIMARY KEY,

user_id BIGINT NOT NULL UNIQUE,

gender ENUM(
    'male',
    'female'
) NOT NULL,

age INT NOT NULL,

height_cm DECIMAL(5,2) NOT NULL,

weight_kg DECIMAL(5,2) NOT NULL,

activity_level_id INT NOT NULL,

goal ENUM(
    'lose_weight',
    'maintain_weight',
    'gain_muscle'
) NOT NULL,

bmi DECIMAL(5,2),

daily_target_calories INT,

profile_completed BOOLEAN DEFAULT FALSE,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

FOREIGN KEY (activity_level_id)
    REFERENCES activity_levels(id)

);

CREATE TABLE diet_preferences (
id INT AUTO_INCREMENT PRIMARY KEY,

name VARCHAR(100) UNIQUE NOT NULL

);

INSERT INTO diet_preferences(name)
VALUES
('Traditional'),
('Vegan'),
('Keto'),
('Low-Carb'),
('Mediterranean'),
('Paleo'),
('Intermittent Fasting');

CREATE TABLE user_diet_preferences (
user_id BIGINT NOT NULL,
preference_id INT NOT NULL,

PRIMARY KEY(user_id, preference_id),

FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

FOREIGN KEY(preference_id)
    REFERENCES diet_preferences(id)
    ON DELETE CASCADE

);

CREATE TABLE foods (
id BIGINT AUTO_INCREMENT PRIMARY KEY,

name VARCHAR(255) NOT NULL,

serving_size DECIMAL(10,2),

unit VARCHAR(20),

calories DECIMAL(10,2) DEFAULT 0,

protein DECIMAL(10,2) DEFAULT 0,

carbs DECIMAL(10,2) DEFAULT 0,

fat DECIMAL(10,2) DEFAULT 0,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE meals (
id BIGINT AUTO_INCREMENT PRIMARY KEY,

user_id BIGINT NOT NULL,

meal_type ENUM(
    'breakfast',
    'lunch',
    'dinner',
    'snack'
) NOT NULL,

meal_date DATE NOT NULL,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE

);

CREATE TABLE nutrition_logs (
id BIGINT AUTO_INCREMENT PRIMARY KEY,

meal_id BIGINT NOT NULL,

food_id BIGINT NOT NULL,

quantity DECIMAL(10,2) NOT NULL,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(meal_id)
    REFERENCES meals(id)
    ON DELETE CASCADE,

FOREIGN KEY(food_id)
    REFERENCES foods(id)

);

CREATE TABLE daily_nutrition_summary (
id BIGINT AUTO_INCREMENT PRIMARY KEY,

user_id BIGINT NOT NULL,

summary_date DATE NOT NULL,

total_calories DECIMAL(10,2) DEFAULT 0,

total_protein DECIMAL(10,2) DEFAULT 0,

total_carbs DECIMAL(10,2) DEFAULT 0,

total_fat DECIMAL(10,2) DEFAULT 0,

calories_burned DECIMAL(10,2) DEFAULT 0,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

UNIQUE(user_id, summary_date),

FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE

);

CREATE TABLE weight_records (
id BIGINT AUTO_INCREMENT PRIMARY KEY,

user_id BIGINT NOT NULL,

weight_kg DECIMAL(5,2) NOT NULL,

record_date DATE NOT NULL,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE

);

CREATE TABLE ai_conversations (
id BIGINT AUTO_INCREMENT PRIMARY KEY,

user_id BIGINT NOT NULL,

title VARCHAR(255),

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE

);

CREATE TABLE ai_messages (
id BIGINT AUTO_INCREMENT PRIMARY KEY,

conversation_id BIGINT NOT NULL,

role ENUM(
    'user',
    'assistant'
) NOT NULL,

content LONGTEXT NOT NULL,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(conversation_id)
    REFERENCES ai_conversations(id)
    ON DELETE CASCADE

);
