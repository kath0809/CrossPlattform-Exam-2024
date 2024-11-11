import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { blurhash } from "@/utils/common";
import { useAuth } from "@/providers/authContext";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ios = Platform.OS === "ios"; // This is a boolean that checks if the platform is iOS or not. It is used to determine the top padding.

export default function ProfileHeader() {
  const { top } = useSafeAreaInsets(); // This is the top padding for iSO devices.
  const { user, logout } = useAuth(); // This is the user object from the AuthContext.
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          await logout();
          setIsModalVisible(false);
          console.log("User", user?.username + " logged out");
        }
      }
    ], { cancelable: false }
  );
  };

  // ! Remember to replaca with images from the user. Uposite of the gallery view.
  const imageGrid = [
    {
      id: 1,
      uri: "https://t3.ftcdn.net/jpg/02/73/22/74/360_F_273227473_N0WRQuX3uZCJJxlHKYZF44uaJAkh2xLG.jpg",
    },
    {
      id: 2,
      uri: "https://sarahtaylorart.com/cdn/shop/products/Dorian-the-Bear-NEW_d01a9c53-84d1-4946-828e-d21de77890d2.jpg?v=1680272010&width=1946",
    },
    {
      id: 3,
      uri: "https://t3.ftcdn.net/jpg/02/73/22/74/360_F_273227473_N0WRQuX3uZCJJxlHKYZF44uaJAkh2xLG.jpg",
    },
    {
      id: 4,
      uri: "https://sarahtaylorart.com/cdn/shop/products/Dorian-the-Bear-NEW_d01a9c53-84d1-4946-828e-d21de77890d2.jpg?v=1680272010&width=1946",
    },
    {
      id: 5,
      uri: "https://t3.ftcdn.net/jpg/02/73/22/74/360_F_273227473_N0WRQuX3uZCJJxlHKYZF44uaJAkh2xLG.jpg",
    },
    {
      id: 6,
      uri: "https://sarahtaylorart.com/cdn/shop/products/Dorian-the-Bear-NEW_d01a9c53-84d1-4946-828e-d21de77890d2.jpg?v=1680272010&width=1946",
    },
    {
      id: 7,
      uri: "https://t3.ftcdn.net/jpg/02/73/22/74/360_F_273227473_N0WRQuX3uZCJJxlHKYZF44uaJAkh2xLG.jpg",
    },
    {
      id: 8,
      uri: "https://sarahtaylorart.com/cdn/shop/products/Dorian-the-Bear-NEW_d01a9c53-84d1-4946-828e-d21de77890d2.jpg?v=1680272010&width=1946",
    },
    {
      id: 9,
      uri: "https://t3.ftcdn.net/jpg/02/73/22/74/360_F_273227473_N0WRQuX3uZCJJxlHKYZF44uaJAkh2xLG.jpg",
    },
  ];

  return (
    // Increase padding by +10 for Android screens.
    <View
      style={{ paddingTop: ios ? top : top + 10 }}
      className="flex-row-reverse justify-between px-5 bg-custom-orange shadow pb-3 rounded-br-l"
    >
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        {/* Use expo image so that the image only gets loaded once */}
        <Image
          style={{ height: hp(4.5), aspectRatio: 1, borderRadius: 100 }}
          source={user?.profileImage}
          placeholder={{ blurhash }}
          transition={200}
        />
      </TouchableOpacity>
      <Text className="text-neutral-800 text-lg font-bold mt-3">
        Hi, {user?.username}
      </Text>

      {/* Profile Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <View style={[styles.modalContainer, { backgroundColor: "#000000e5" }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setIsModalVisible(false);
                router.push("/newPost");
              }}
            >
              <Octicons name="diff-added" size={24} color="#f5a442" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setIsModalVisible(false);
              }}
            >
              <AntDesign name="close" size={24} color="#f5a442" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
              <Octicons name="sign-out" size={24} color="#f5a442" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {user?.username ? (
              <Text style={styles.modalTitle}>{user.username}</Text>
            ) : (
              <Text style={styles.modalTitle}>Guest user</Text>
            )}
            <View>
              <Image
                style={{
                  height: hp(20),
                  aspectRatio: 1,
                  borderRadius: 10,
                  borderColor: "#f5a442",
                  borderWidth: 2,
                }}
                source={user?.profileImage}
                placeholder={{ blurhash }}
                transition={500}
              />
            </View>
            <View style={styles.gridContainer}>
              {imageGrid.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.uri }}
                  style={styles.gridItem}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalContent: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#f5a442",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#f5a442",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "black",
    fontSize: 16,
  },
  button: {
    padding: 10,
  },
  gridContainer: {
    marginTop: 70,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  gridItem: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 15,
  },
});
