import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import CircularProgress from "@mui/material/CircularProgress";

const TalentSignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    try {
      setLoading(true); // Set loading to true before initiating the sign-in process
      if (email.trim() === "" || password.trim() === "") {
        alert("Please fill in all fields before signing in.");
        return;
      }

      console.log("Email:", email);
      console.log("Password:", password);

      // // Use signInWithEmailAndPassword for signing in
      // Your custom sign-in logic here...

      // Navigate to "Landing" after successful sign-in
      navigation.navigate("Landing");
    } catch (error) {
      console.error("Error signing in:", error.message);
      alert("Error signing in. Please try again.");
    } finally {
      setLoading(false); // Set loading back to false after the sign-in process completes
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Your custom Google sign-in logic here...

      // Navigate or perform additional logic after successful Google sign-in
      navigation.navigate("TellUsAboutYourself");
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      alert("Error signing in with Google. Please try again.");
    }
  };

  const handleShop = () => {
    navigation.navigate("Landing");
  };

  return (
    <ImageBackground
      source={require("../../Global/images/Reed.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Logo image container */}
        <View>
          <Image
            source={require("../../Global/images/logo.png")}
            style={styles.logo}
          />
        </View>
        {/* SignUp text container */}
        <View
          style={{
            width: "120%",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Text style={styles.title}>SIGN IN </Text>
          {/*Insert arrow logo */}
          <TouchableOpacity onPress={handleShop}>
            <Text style={{ fontSize: "70%", marginBottom: "-20%" }}>
              SHOP{" "}
              <FontAwesome
                style={styles.arrow}
                name="angle-right"
                size={20}
                color="#072840"
              />{" "}
            </Text>
          </TouchableOpacity>
        </View>
        {/* TextInput fields container */}
        <View style={{ width: "75%" }}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
        </View>
        <View>
          <Text
            style={{
              position: "relative",
              left: "5vw",
              marginVertical: "1vh",
              cursor: "pointer",
            }}
          >
            {" "}
            FORGOT PASSWORD?
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignin}>
          {loading ? (
            <CircularProgress size={25} />
          ) : (
            <Text style={styles.buttonText}>SIGN IN</Text>
          )}
        </TouchableOpacity>

        {/* <TouchableOpacity>
          <Text style={styles.linkText}> ALREADY HAVE AN ACCOUNT?</Text>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={handleGoogleSignIn}>
          <Text style={styles.linkText1}>
            {" "}
            <AntDesign name="google" size={15} color="red" />
            SIGN UP WITH GOOGLE
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "30%",
    marginLeft: "69%",
    height: "95%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 150,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "left",
  },
  input: {
    height: 40,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 15,
  },
  button: {
    backgroundColor: "#072840",
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 10,
    width: "75%",
    display: "flex",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  linkText: {
    color: COLORS.darkBlue,
    textAlign: "center",
    marginTop: 20,
  },
  linkText1: {
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  businessButton: {
    borderColor: COLORS.darkBlue,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: "10%",
    width: "75%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonText1: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#072840",
  },
  arrow: {
    marginLeft: "10px",
  },
});
export default TalentSignIn;