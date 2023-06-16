import * as TaskManager from "expo-task-manager";
import * as Updates from "expo-updates";
import { Alert } from "react-native";

const displayCameraActivityFailedAlert = () => {
  Alert.alert("Kamera İzni Gerekli.", "Kamera İzniniz için uygulamayı yeniden başlatmanız gerekiyor", [
    {
      text: "Vazgeç"
    },
    {
      text: "Tamam",
      onPress: async () => {
          await TaskManager.unregisterAllTasksAsync();
          await Updates.reloadAsync();
      }
    }
  ]);
};

export { displayCameraActivityFailedAlert };