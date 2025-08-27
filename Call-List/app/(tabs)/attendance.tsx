import { useAttendance } from "@/context/attendanceContext";
import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";

export default function Attendance() {
  const { students, fetchStudents, addStudent, markAttendance, isLoading, error } = useAttendance();

  const [newStudentName, setNewStudentName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [dateAttendance, setDateAttendance] = useState("");
  const [present, setPresent] = useState(true);

  // Busca alunos ao montar o componente
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    if (!newStudentName.trim()) {
      alert("Digite o nome do aluno!");
      return;
    }

    await addStudent(newStudentName); // fetchStudents será chamado dentro do addStudent
    setNewStudentName("");
  };

  const handleSaveAttendance = async () => {
    if (!selectedStudent || !dateAttendance.trim()) {
      alert("Selecione um aluno e informe a data!");
      return;
    }

    await markAttendance({
      studentName: selectedStudent,
      present,
      date_attendance: dateAttendance,
    });

    setSelectedStudent(null);
    setDateAttendance("");
  };

  const togglePresence = () => setPresent((prev) => !prev);

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
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

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 24 }}>Alunos cadastrados</Text>

      {students.length === 0 ? (
        <Text style={{ color: "gray" }}>Nenhum aluno cadastrado ainda.</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedStudent(item.name)}
              style={{
                padding: 10,
                borderWidth: 1,
                borderColor: selectedStudent === item.name ? "green" : "#ccc",
                borderRadius: 8,
                marginBottom: 6,
                backgroundColor: selectedStudent === item.name ? "#d1f7d6" : "white",
              }}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={{ maxHeight: 200, marginBottom: 12 }}
        />
      )}

      <View style={{ marginTop: 24, borderTopWidth: 1, borderColor: "#ddd", paddingTop: 16, gap: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Registrar Presença</Text>

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
          title={
            selectedStudent
              ? present
                ? `Marcar Presença para ${selectedStudent}`
                : `Marcar Falta para ${selectedStudent}`
              : "Selecione um aluno"
          }
          onPress={handleSaveAttendance}
          disabled={isLoading || !selectedStudent}
        />

        <Button title={`Trocar para ${present ? "Falta" : "Presença"}`} onPress={togglePresence} />

        {error && <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>}
      </View>
    </View>
  );
}
