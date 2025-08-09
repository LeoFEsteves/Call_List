create database IF NOT EXISTS Call_List;

CREATE TABLE IF NOT EXISTS Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100),
  senha VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS Student (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100),
  id_user INT,
  FOREIGN KEY (id_user) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_student INT,
  present BOOLEAN,
  date_attendance DATE,
  FOREIGN KEY (id_student) REFERENCES Student(id)
);

ALTER TABLE Attendance ADD UNIQUE KEY uniq_attendance (id_student, date_attendance);