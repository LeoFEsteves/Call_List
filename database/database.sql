 create database IF NOT EXISTS database_Call_List;

CREATE TABLE IF NOT EXISTS Users (
  id_Users INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(60),
  senha VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS Student (
  id_Student INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(60),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES Users(id_Users)
);

CREATE TABLE IF NOT EXISTS Attendance (
  id_Attendance INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  present BOOLEAN,
  date_attendance DATE,
  FOREIGN KEY (student_id) REFERENCES Student(id_Student)
);

