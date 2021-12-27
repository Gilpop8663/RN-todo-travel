import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [isWork, setIsWork] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    LoadToDos();
  }, []);
  const SaveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  };
  const LoadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (JSON.parse(s) === null) {
        return;
      }
      setToDos(JSON.parse(s));
    } catch (e) {
      console.log(e);
    }
  };
  const deleteToDos = (key) => {
    Alert.alert("Delete To Do", "Are you Sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          SaveToDos(newToDos);
        },
      },
    ]);
  };
  const onSubmit = async () => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text: text, work: isWork },
    };
    setToDos(newToDos);
    await SaveToDos(newToDos);
    setText("");
  };
  const onChange = (payload) => setText(payload);
  const onWork = () => {
    setIsWork(true);
  };
  const onTravle = () => {
    setIsWork(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onWork}>
          <Text style={{ ...styles.btn, color: isWork ? "white" : theme.grey }}>
            {" "}
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onTravle}>
          <Text
            style={{ ...styles.btn, color: !isWork ? "white" : theme.grey }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={onSubmit}
        returnKeyType="done"
        value={text}
        placeholder={isWork ? "Add a To Do" : "Where do you want to go?"}
        style={{ ...styles.input }}
        onChangeText={onChange}
      ></TextInput>
      <ScrollView>
        {Object.keys(toDos).map((item) =>
          toDos[item].work === isWork ? (
            <View style={styles.toDo} key={item}>
              <Text style={styles.toDoText}>{toDos[item].text}</Text>
              <TouchableOpacity onPress={() => deleteToDos(item)}>
                <Fontisto name="trash" size={18} color={theme.grey} />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 100,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    fontSize: 30,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
