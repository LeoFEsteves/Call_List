import { useAttendance } from "@/context/attendanceContext";
import { Button, Text, View, TextInput } from "react-native";
import { useState } from "react";

export default function Attendance() {
  const { markAttendance, addStudent, isLoading, error } = useAttendance();

  const [newStudentName, setNewStudentName] = useState("");

  const [studentName, setStudentName] = useState("");
  const [dateAttendance, setDateAttendance] = useState("");
  const [present, setPresent] = useState(true);

  const togglePresence = () => setPresent((prev) => !prev);

  const handleSaveAttendance = async () => {
    if (!studentName || !dateAttendance) {
      alert("Informe nome do aluno e data!");
      return;
    }

    await markAttendance({
      studentName,
      present,
      date_attendance: dateAttendance,
    });

    setStudentName("");
    setDateAttendance("");
  };

  const handleAddStudent = async () => {
    if (!newStudentName.trim()) {
      alert("Digite o nome do aluno!");
      return;
    }

    await addStudent(newStudentName);
    setNewStudentName("");
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 16, top: 50, }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Adicionar Aluno</Text>
      <TextInput
        placeholder="Nome do novo aluno"
        value={newStudentName}
        onChangeText={setNewStudentName}
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          padding: 8,
          borderRadius: 8,
          width: "100%",
          marginBottom: 8,
        }}
      />
      <Button title="Adicionar aluno" onPress={handleAddStudent} />

      <View
        style={{
          marginTop: 24,
          borderTopWidth: 1,
          borderColor: "#ddd",
          paddingTop: 16,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Registrar Presença</Text>

        <TextInput
          placeholder="Nome do Aluno"
          value={studentName}
          onChangeText={setStudentName}
          style={{
            borderWidth: 1,
            borderColor: "#aaa",
            padding: 8,
            borderRadius: 8,
            width: "100%",
            marginBottom: 8,
          }}
        />

        <TextInput
          placeholder="Data (YYYY-MM-DD)"
          value={dateAttendance}
          onChangeText={setDateAttendance}
          style={{
            borderWidth: 1,
            borderColor: "#aaa",
            padding: 8,
            borderRadius: 8,
            width: "100%",
            marginBottom: 8,
          }}
        />

        <Button
          title={present ? "Marcar Presença" : "Marcar Falta"}
          onPress={handleSaveAttendance}
          disabled={isLoading}
        />

        <Button
          title={`Trocar para ${present ? "Falta" : "Presença"}`}
          onPress={togglePresence}
        />

        {error && <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>}
      </View>
    </View>
  );
}
