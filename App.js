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
import { Entypo } from "@expo/vector-icons";
import Dialog from "react-native-dialog";
import { theme } from "./colors";

const STORAGE_KEY = "@toDos";
const WHERE_IS = "@where";

export default function App() {
  const [isWork, setIsWork] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    LoadToDos();
  }, []);
  const SaveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      await AsyncStorage.setItem(WHERE_IS, isWork.toString());
    } catch (e) {
      console.log(e);
    }
  };
  const LoadToDos = async () => {
    try {
      const a = await AsyncStorage.getItem(WHERE_IS);
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (JSON.parse(s) === null) {
        return;
      }
      setIsWork(Boolean(a));
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
      [Date.now()]: { text: text, work: isWork, done: false },
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
  const onPop = () => {
    setVisible(true);
  };

  const onModify = async (item) => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [item]: {
        text: text,
        work: toDos[item].work,
        done: toDos[item].done,
      },
    };
    //console.log(newToDos);
    setToDos(newToDos);
    await SaveToDos(newToDos);
    setVisible(false);
    setText("");
  };
  const doneToDos = (key, isDone) => {
    //console.log(newToDos);
    const newToDos = {
      ...toDos,
      [key]: {
        text: toDos[key].text,
        work: toDos[key].work,
        done: isDone,
      },
    };
    //console.log(key, toDos[key].text, toDos[key].work);
    //console.log(newToDos);
    setToDos(newToDos);
    SaveToDos(newToDos);
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
              <TouchableOpacity>
                {toDos[item].done === false ? (
                  <Fontisto
                    onPress={() => doneToDos(item, true)}
                    name="checkbox-passive"
                    size={18}
                    color={theme.grey}
                  />
                ) : (
                  <View style={{ color: "white", borderStyle: "solid" }}>
                    <Fontisto
                      onPress={() => doneToDos(item, false)}
                      name="checkbox-active"
                      size={18}
                    />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity>
                <Entypo
                  name="pencil"
                  size={18}
                  color={theme.grey}
                  onPress={() => onPop(item)}
                />
                <View>
                  <Dialog.Container visible={visible}>
                    <Dialog.Title>Text modification</Dialog.Title>
                    <Dialog.Description>
                      Do you want me to modify the text? Please write down the
                      text you want to modify.
                    </Dialog.Description>
                    <Dialog.Input
                      value={text}
                      returnKeyType="done"
                      onChangeText={onChange}
                      placeholder="Text to be modified."
                    ></Dialog.Input>
                    <Dialog.Button
                      onPress={() => setVisible(false)}
                      label="Cancel"
                    />
                    <Dialog.Button
                      onPress={() => onModify(item)}
                      label="Modify"
                    />
                  </Dialog.Container>
                </View>
              </TouchableOpacity>
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
