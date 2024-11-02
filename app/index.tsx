import LoadingComponent from "@/components/LoadingComponent";
import { View } from "react-native";

export default function StartPage() {
  return (
    <View className="flex-1 justify-center items-center">
      <LoadingComponent size={200} />
    </View>
  );
}
