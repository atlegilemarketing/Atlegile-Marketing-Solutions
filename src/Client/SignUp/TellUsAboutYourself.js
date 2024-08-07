import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { firebase, firestore } from "../../config";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

const TellUsAboutYourself = ({ navigation }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const window = Dimensions.get("window");
  const user = firebase.auth().currentUser;

  // Function to handle the continue button click
  const handleContinue = async (e) => {
    e.preventDefault();
  
    // Check if all required fields are filled
    if (!name || !surname || !phone || !gender || !email) {
      alert("Please fill in all fields before continuing.");
      return;
    }
  
    // Set user information in local storage
    localStorage.setItem("user", user.uid);
  
    try {
      setLoading(true);
  
      // Reference to the user document in Firestore
      const userRef = firestore.collection("Users").doc(user.uid);
  
      // Set user information in Firestore document
      await userRef.set({
        name,
        surname,
        phone,
        gender,
        email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
      });
  
      // Log success message
      console.log("User information successfully submitted to Firestore.");
  
      // Alert user and navigate to the "AlternativeContact" screen
      alert("Continue To Alternative Contacts");
      navigation.navigate("AlternativeContact");
    } catch (error) {
      // Log and alert if there's an error submitting user information
      console.error("Error submitting user information:", error.message);
      alert("Error submitting user information. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Array with an empty string as the only option
  const emptyOption = [""];
  // Array with gender options
  const genderOptions = ["Male", "Female", "Other"];

  return (
    // ImageBackground component to set the background image
    <ImageBackground
      source={require("../../Global/images/Reed.jpg")}
      style={styles.background}
    >
      {/* Container View to hold the content */}
      <View style={styles.container}>
        {/* Logo Image */}
        <Image
          source={require("../../Global/images/logo5.png")}
          style={styles.logo}
        />
        {/* Title and Subtitle */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "75%",
            flexDirection: "column",
          }}
        >
          <Text style={styles.title}>MAIN ACCOUNT HOLDER</Text>
          <Text style={styles.subtitle}>TELL US ABOUT YOURSELF</Text>
        </View>
        {/* Form Inputs for Name and Surname */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "75%",
          }}
        >
          <TextField
            id="outlined-number"
            label="Name"
            type="text"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "48%",
              marginRight: "5px",
            }}
          />
          <TextField
            id="outlined-number"
            label="Surname"
            type="text"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            style={{
              width: "48%",
            }}
          />
        </View>
        {/* Input for Phone number */}
        <TextField
          id="outlined-number"
          label="Phone"
          type="text"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: "75%",
            marginTop: "5px",
            textAlign: "left",
          }}
        />
        <br />
        {/* Dropdown for selecting Gender */}
        <TextField
          id="outlined"
          select
          label="Gender"
          variant="standard"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={{
            width: "75%",
            textAlign: "left",
            marginTop: "10px",
          }}
        >
          {genderOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <br />
        {/* Input for Email */}
        <TextField
          id="outlined-number"
          label="Email"
          type="text"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "75%",
            marginTop: "5px",
            textAlign: "left",
          }}
        />
        {/* Continue button */}
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          {loading ? (
            <CircularProgress size={25} />
          ) : (
            <Text style={styles.buttonText}>CONTINUE</Text>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    height: "95%",
    margin: "3%",

    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 70,
    height: 70, 
    marginBottom: 50,
    resizeMode: "contain",
    marginTop:20,
    borderRadius: 35, 
    overflow: "hidden", 
  },
  title: {
    fontSize: 10,
    marginBottom: 2,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  input: {
    height: 40,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 15,
  },
  pickerItem: {
    color: "#072840",
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
  row: {
    flexDirection: "row",
  },
});

export default TellUsAboutYourself;
