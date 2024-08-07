import React, { useState, useRef, useEffect } from "react";
import BlackSilk from "../../Global/images/blackSilk.jpg";
import BusinessAccountPlus from "../../Global/images/BusinessPlus+.jpg";
import NavBar from "../../Global/Navbar";
import { View, TouchableOpacity, Image, Text, ScrollView } from "react-native";
import { Footer } from "../../Global/Footer";
import {
  Grid,
  TextField,
  Card,
  MenuItem,
  Box,
  Button,
  useTheme,
  CardMedia,
  Paper,
} from "@mui/material";
import Typography from "@mui/joy/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Icon from "react-native-vector-icons/Fontisto";
import Icon2 from "react-native-vector-icons/Feather";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalOverflow from "@mui/joy/ModalOverflow";
import { AntDesign } from "@expo/vector-icons";
import Header from "../../Global/Header";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import placeholder from "../../Global/images/login.jpg";
import { auth, firestore, storage } from "../../config";
import firebase from "firebase/compat/app";
import {
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import sara from "../../Global/images/Sara.png";
import Swal from "sweetalert2";
import { useNavigation } from "@react-navigation/native";

const logo = require("../../Global/images/cropped-AMS-Shadow-Queen-Logo_BNY-1320x772 1.png");
export default function BusinessAccount() {
  const [editModal, setEditModal] = useState(false);
  const [bannerModal, setBannerModal] = useState(false);
  // const [paymentModal, setPaymentModal] = useState(false);
  // const [businessAuthorization, setBusinessAuthorization] = useState(false);
  const [productName, setProductName] = useState("");
  const [otherBanner, setOtherBanner] = useState("");
  const [priceOriginal, setPriceOriginal] = useState(0);
  const [priceDiscount, setPriceDiscount] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);
  // const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  // const [productType, setProductType] = useState("");
  // const [other, setOther] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  // const screenWidth = Dimensions.get("window").width;
  // const screenHeight = Dimensions.get("window").height;
  // const [cardHolder, setCardHolder] = useState("");
  // const [cardNumber, setCardNumber] = useState();
  // const [expiery, setExpiery] = useState();
  // const [cvv, setCvv] = useState();
  const emptyOption = [""];
  // const [company, setCompany] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [selectedProductCategory, setProductCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [cartData, setCartData] = useState([]);
  const [user, setUser] = useState(null);
  // const [checkOrder, setCheckOrder] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banner, setBanner] = useState([]);
  // const [currentBanner, setCurrentBanner] = useState(null);
  const [userData, setUserData] = useState(null);
  const [length, setLength] = useState(null);
  const [width, setWidth] = useState(null);
  const [screenWidth, setScreenWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = React.useState("");
  // const [layout, setLayout] = React.useState("fullscreen");
  const [scroll, setScroll] = React.useState(true);
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [review, setReview] = useState({});
  const [docToEdit, setDoctoEdit] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const handleDimensionsChange = ({ window }) => {
      setScreenWidth(window.width);
    };

    Dimensions.addEventListener("change", handleDimensionsChange);

    return () => {
      Dimensions.removeEventListener("change", handleDimensionsChange);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1080); // Adjust the breakpoint as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    setLoading(false); // to set loading to false
  }, [products]);

  // const handleSubscription = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setLoading(true);

  //     const userRef = firestore.collection("Users").doc(user.uid);

  //     // Get the existing user data
  //     const userData = await userRef.get();

  //     // Update the subscribed field to true
  //     await userRef.update({ subscribed: true });

  //     // Ensure that setPaymentModal is called directly in the component
  //     setPaymentModal(false);

  //     // Reload the entire page
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error updating subscribed status:", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // Define an asynchronous function to fetch product data
    const fetchProductData = async () => {
      // Check if the user is authenticated
      if (!user) {
        console.error("User not authenticated.");
        return;
      }

      // Get a reference to the "Products" collection in Firestore
      const productsCollectionRef = collection(firestore, "Products");

      // Construct a query to filter products by businessName from userData
      const q = query(
        productsCollectionRef,
        where("company", "==", userData.company)
      );

      try {
        // Execute the query and get a snapshot of the results
        const querySnapshot = await getDocs(q);

        // Check if there are any matching products
        if (querySnapshot.empty) {
          console.log("No products found for the given company name.");
          return;
        }

        // Initialize an array to store fetched product data
        const productsData = [];

        // Iterate through each document in the querySnapshot
        querySnapshot.forEach((doc) => {
          // Get the data of each document
          const docData = doc.data();
          // Add the document ID to the data
          docData.id = doc.id;
          // Push the data of each document into the productsData array
          productsData.push(docData);
        });

        // Update the state with the fetched product data
        setProducts(productsData);
      } catch (error) {
        // Handle errors that may occur during the data fetching process
        console.error("Error fetching product data:", error);
      }
    };

    // Include both userData and productsCollectionRef in the dependency array
    // This will trigger the effect whenever either of them changes
    const productsCollectionRef = collection(firestore, "Products");
    fetchProductData();
    const unsubscribe = onSnapshot(productsCollectionRef, () =>
      fetchProductData()
    );

    return () => {
      // Cleanup the subscription when the component unmounts
      unsubscribe();
    };
  }, [userData]); // Include other dependencies if needed

  // useEffect(() => {
  //   // Define an asynchronous function to fetch product data
  //   const fetchProductData = async () => {
  //     // Check if the user is authenticated
  //     if (!user) {
  //       console.error("User not authenticated.");
  //       return;
  //     }

  //     // Get a reference to the "Products" collection in Firestore
  //     const productsCollectionRef = collection(firestore, "Products");

  //     // Construct a query to filter products by businessName from userData
  //     const q = query(
  //       productsCollectionRef,
  //       where("company", "==", userData.company)
  //     );

  //     try {
  //       // Execute the query and get a snapshot of the results
  //       const querySnapshot = await getDocs(q);

  //       // Check if there are any matching products
  //       if (querySnapshot.empty) {
  //         console.log("No products found for the given company name.");
  //         return;
  //       }

  //       // Initialize an array to store fetched product data
  //       const productsData = [];

  //       // Iterate through each document in the querySnapshot
  //       querySnapshot.forEach((doc) => {
  //         // Push the data of each document into the productsData array
  //         productsData.push(doc.data());
  //       });

  //       console.log("product data is: ", productsData);

  //       // Update the state with the fetched product data
  //       setProducts(productsData);
  //     } catch (error) {
  //       // Handle errors that may occur during the data fetching process
  //       console.error("Error fetching product data:", error);
  //     }
  //   };

  //   // Include both userData and productsCollectionRef in the dependency array
  //   // This will trigger the effect whenever either of them changes
  //   const productsCollectionRef = collection(firestore, "Products");
  //   fetchProductData();
  //   const unsubscribe = onSnapshot(productsCollectionRef, () =>
  //     fetchProductData()
  //   );

  //   return () => {
  //     // Cleanup the subscription when the component unmounts
  //     unsubscribe();
  //   };
  // }, [userData]); // Include other dependencies if needed

  useEffect(() => {
    // Get the authentication instance
    const auth = getAuth();

    // Set up an event listener for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Update the component's state with the current user
      setUser(user);
    });

    // Return a cleanup function to unsubscribe when the component unmounts
    return () => {
      unsubscribe(); // Unsubscribe from the auth state listener when the component unmounts
    };
  }, []);

  useEffect(() => {
    // Set up an event listener for changes in authentication state
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      // Check if a user is authenticated
      if (user) {
        // Get a reference to the user document in Firestore using the user's UID
        const userDocRef = firestore.collection("Users").doc(user.uid);

        // Fetch user details from Firestore
        try {
          // Attempt to get the user document
          const userDoc = await userDocRef.get();

          // Check if the user document exists
          if (userDoc.exists) {
            // Update the component's state with the user data from the document
            setUserData(userDoc.data());
            console.log("userDoc.data() is ", userDoc.data());
          } else {
            console.error("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    });

    // Return a cleanup function to unsubscribe when the component unmounts
    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const bannerCollection = firestore.collection("Banner");

        // Fetch the snapshot of documents in the "Banner" collection where bannerUid matches userData.uid
        const snapshot = await bannerCollection
          .where("bannerUid", "==", userData.uid)
          .get();

        const bannerData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            bannerImage: data.bannerImage,
            discountPrice: data.discountPrice,
            originalPrice: data.originalPrice,
            other: data.other,
            productName: data.productName,
            quantity: data.quantity,
          };
        });

        // console.log("bannerData is ", bannerData);
        setBanner(bannerData);
      } catch (error) {
        console.error("Error fetching banner images:", error);
      }
    };

    // Include both userData and bannerCollection in the dependency array
    // This will trigger the effect whenever either of them changes
    const bannerCollection = firestore.collection("Banner");
    fetchBanner();
    const unsubscribe = bannerCollection.onSnapshot(() => fetchBanner());

    return () => {
      // Cleanup the subscription when the component unmounts
      unsubscribe();
    };
  }, [userData]); // Include other dependencies if needed

  useEffect(() => {
    // Set up an interval to change the current index of the banner images
    const interval = setInterval(() => {
      // Check if there are banner images available
      if (banner[0].bannerImage.length > 0) {
        // Update the current index based on the length of the banner images array
        setCurrentIndex((prevIndex) =>
          prevIndex === banner[0].bannerImage.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 10000); // Set the interval to run every 10 seconds (10000 milliseconds)

    // Clean up the interval when the component is unmounted or when the 'banner' dependency changes
    return () => {
      clearInterval(interval);
    };
  }, [banner]);

  const handlePrevClick = () => {
    // Update the current index for the previous image
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banner[0].bannerImage.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    // Update the current index for the next image
    setCurrentIndex((prevIndex) =>
      prevIndex === banner[0].bannerImage.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Shows a pop-up dialog with contact information.
  const handlePress = () => {
    Swal.fire({
      icon: "info",
      title: "Contact Information",
      html: "<b>Name:</b> Julian James<br/><b>Phone Number:</b> 0123456789",
      confirmButtonText: "Close",
    });
  };

  // Asks for confirmation before signing out and navigates to the landing page if confirmed.
  const handleSignOut = () => {
    Swal.fire({
      title: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(firebase.auth());
        navigation.navigate("Landing");
      }
    });
  };

  // Sets the `checkOrder` state to `true`.
  const handleorders = () => {
    navigation.navigate("OrderHistory");
  };

  // Navigates to the "/termsandconditions" route.
  const handlefavorites = () => {
    navigation.navigate("Favourites");
  };

  // Navigates to the "/termsandconditions" route.
  const handleterms = () => {
    navigation.navigate("termsandconditions");
  };

  // Navigates to the "/privacypolicy" route.
  const handlepolicy = () => {
    navigation.navigate("privacypolicy");
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe(); // Unsubscribe from the auth state listener when component unmounts
    };
  }, []);

  // Function to fetch user's cart data from Firestore
  const fetchCartData = async () => {
    // Check if the user is authenticated
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    // Reference to the "Cart" collection in Firestore
    const cartCollectionRef = collection(firestore, "Cart");

    // Query to get documents from the "Cart" collection where the "uid" matches the current user's UID
    const q = query(cartCollectionRef, where("uid", "==", user.uid));

    try {
      // Fetch documents based on the query
      const querySnapshot = await getDocs(q);

      // Array to store cart items
      const cartItems = [];

      // Iterate through each document in the query result
      querySnapshot.forEach((doc) => {
        // Extract data from the document
        const data = doc.data();

        // Push relevant data into the cartItems array
        cartItems.push({
          id: doc.id,
          product: data.product,
          quantity: data.quantity,
          amount: data.price * data.quantity,
          image: data.image,
          name: data.name,
          orderId: data.productId,
          timestamp: data.timestamp.toDate(),
          // Add other relevant fields from your Cart collection
        });
      });

      // Set the state with the fetched cart items
      setCartData(cartItems);

      // Log the cart data to the console (for debugging purposes)
      // console.log("Cart Data : ", cartData);
    } catch (error) {
      // Handle errors that may occur during the fetch process
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    // Fetch cart data when the user is authenticated
    if (user) {
      fetchCartData();
    }
  }, [user]); // Fetch cart data whenever the user changes

  // Array representing product categories, including an empty option
  const productCategory = [
    ...emptyOption, // Spread the values from 'emptyOption'
    "Electronics",
    "Clothing and Apparel",
    "Home and Furniture",
    "Beauty and Personal Care",
    "Sports and Outdoors",
    "Toys and Games",
    "Books and Stationery",
    "Health and Wellness",
    "Automotive",
    "Grocery and Gourmet",
    "Jewelry and Watches",
    "Home Improvement",
    "Pet Supplies",
    "Office Supplies",
    "Music and Instruments",
    "Garden and Outdoor Living",
    "Art and Craft Supplies",
    "Travel and Luggage",
    "Baby and Maternity",
    "Electrical and Lighting",
  ];

  // Function to handle file input change
  const handleFileChange = (e) => {
    // Get the selected image from the file input
    const selectedImage = e.target.files[0];

    // Check if an image is selected
    if (selectedImage) {
      // Create a FileReader to read the image data
      const reader = new FileReader();

      // Set up a callback when the FileReader has loaded the image data
      reader.onload = (e) => {
        // Set the image state with the data URL of the selected image
        setImage(e.target.result);
      };

      // Read the selected image as a data URL
      reader.readAsDataURL(selectedImage);
    }
  };

  // Function to handle saving a new banner
  const handleSaveAddBanner = async (e) => {
    e.preventDefault();

    // Access the 'Banner' collection in Firestore
    const bannerCollection = firestore.collection("Banner");

    try {
      // Check if there is a document with bannerUid === userData.uid
      const existingBannerQuery = await bannerCollection
        .where("bannerUid", "==", userData.uid)
        .get();
      const existingBannerDoc = existingBannerQuery.docs[0];

      // Generate a unique ID for the new banner
      const bannerId = existingBannerDoc
        ? existingBannerDoc.id
        : bannerCollection.id;

      // Create an object with the specified fields for the new banner
      const bannerData = {
        bannerImage: [], // Initialize an empty array to store image URLs
        discountPrice: parseFloat(priceDiscount), // Convert to number
        originalPrice: parseFloat(priceOriginal), // Convert to number
        other: otherBanner,
        approved: false,
        productName: productName,
        quantity: parseInt(quantity),
        bannerUid: userData.uid,
        company: userData.company, // Convert to number
      };

      // Upload each image in the 'images' array to Firebase Storage
      const uploadTasks = images.map((image, index) => {
        const imageRef = storage.ref(`banner_images/${bannerId}/image${index}`);
        return imageRef.put(image.file);
      });

      // Wait for all image uploads to complete
      await Promise.all(uploadTasks);

      // Get the download URLs of the uploaded images
      const downloadURLs = await Promise.all(
        uploadTasks.map((task) => task.snapshot.ref.getDownloadURL())
      );

      // Update the 'bannerData' object with the image URLs
      bannerData.bannerImage = downloadURLs;

      if (existingBannerDoc) {
        // If there's an existing document, update its fields
        await existingBannerDoc.ref.update(bannerData);
      } else {
        // If no existing document, add a new banner document to the 'Banner' collection in Firestore
        await bannerCollection.add(bannerData);
      }

      // Close the modal after successful addition/update
      setBannerModal(false);
      // Reload the entire page
      // window.location.reload();
    } catch (error) {
      console.error("Error adding/updating banner data: ", error);
    }
  };

  // Function to handle saving payment information
  // const handleSavePaymentInfo = (e) => {
  //   e.preventDefault();

  //   // Close the payment modal
  //   setPaymentModal(false);

  //   // Set the 'businessAuthorization' state to true, indicating successful authorization
  //   setBusinessAuthorization(true);
  // };

  // useEffect hook to simulate a button click when the component mounts
  useEffect(() => {
    // Retrieve the button element with the id 'businessPlusModal'
    const businessPlusModalButton =
      document.getElementById("businessPlusModal");

    // Check if the button element exists
    if (businessPlusModalButton) {
      // Simulate a click on the button when the component mounts
      businessPlusModalButton.click();
    }
  }, []);

  // Function to handle the change of images in an input file element
  const handleImageChange = (e) => {
    // Retrieve the selected files from the input element
    const files = e.target.files;

    // Check if any files are selected
    if (files.length > 0) {
      // Create an array of objects containing image URLs and file references
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file), // Generate a URL for the image
        file, // Store the file reference
      }));

      // Update the state by appending the new images to the existing images
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    // Check if at least one image is selected
    if (images.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    // Set loading to true when the form is submitted
    setLoading(true);

    // Reset previous error messages

    try {
      // Create a new document reference
      const productRef = firestore.collection("Products").doc();

      // Get the autogenerated product ID
      const productId = productRef.id;

      // Store the data in Firestore with autogenerated product ID
      await productRef.set({
        name,
        businessName,
        approved: false,
        company: businessName,
        price: parseFloat(price),
        quantity,
        description,
        selectedProductCategory,
        brand,
        height: parseFloat(height), // convert from string typo to a number
        length: parseFloat(length), // convert from string typo to a number
        width: parseFloat(width), // convert from string typo to a number
        weight: parseFloat(weight), // convert from string typo to a number
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        // ... (other fields)
      });

      // Upload images to Firebase Storage
      const uploadTasks = images.map((image, index) => {
        const imageRef = storage.ref(
          `product_images/${productId}/image${index}`
        );
        return imageRef.put(image.file);
      });

      await Promise.all(uploadTasks); // Wait for all images to be uploaded

      // Get download URLs of the images
      const downloadURLs = await Promise.all(
        uploadTasks.map((task) => task.snapshot.ref.getDownloadURL())
      );

      // Update the product document with image URLs
      await productRef.update({ images: downloadURLs });

      // Set loading back to false after successful upload
      setLoading(false);

      // You can navigate to the next screen or perform other actions here
      alert("Product added successfully!");
      // Reload the entire page
      setAddProduct(false);
    } catch (error) {
      console.error("Error storing data in Firestore:", error);
      // Set loading back to false in case of an error
      setLoading(false);
    }
  };

  useEffect(() => {
    if (docToEdit) {
      setEditModal(true);
      // console.log("hello there");
    }
  }, [docToEdit]);

  // Function to handle saving edited product (closing the edit modal)
  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    const db = firebase.firestore();

    const updatedFields = {
      name,
      approved: false,
      businessName,
      company: businessName,
      price: parseFloat(price),
      quantity,
      description,
      selectedProductCategory,
      brand,
      height: parseFloat(height), // convert from string typo to a number
      length: parseFloat(length), // convert from string typo to a number
      width: parseFloat(width), // convert from string typo to a number
      weight: parseFloat(weight), // convert from string typo to a number
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    console.log("updatedFields: ", updatedFields);
    const updateObject = Object.fromEntries(
      Object.entries(updatedFields).filter(([_, value]) => value !== undefined)
    );

    try {
      await db.collection("Products").doc(docToEdit).update(updateObject);
      console.log("Product updated successfully");
    } catch (error) {
      console.error("Error updating product: ", error);
    }

    setEditModal(false);
  };

  const deleteProduct = async (productId) => {
    try {
      // Reference to the "Products" collection in Firestore
      const productCollectionRef = firestore.collection("Products");
      // Reference to the document in the "Products" collection with the product ID
      const delDocRef = productCollectionRef.doc(productId);
      // Delete the product from the "Products" collection
      await delDocRef.delete();
    } catch (error) {
      // Log an error message if there's an error while toggling heart icon
      console.error("Error deleting the product:", error);
    }
  };

  return (
    <>
      <React.Fragment>
        {/* Main modal component */}
        <Modal
          open={!!layout} // Modal opens when the layout exists
          onClose={() => {
            setLayout(undefined); // Close the modal by setting layout to undefined
          }}
        >
          {/* Overflow container for the modal */}
          <ModalOverflow>
            {/* Modal dialog with specific styles */}
            <ModalDialog
              aria-labelledby="modal-dialog-overflow"
              layout={layout}
              sx={{ backgroundColor: "transparent" }}
            >
              <ModalClose /> {/* Close button for the modal */}
              {scroll && (
                <Grid // Grid container for the modal contents
                  container
                  justifyContent="center" // Center the contents horizontally
                  alignItems="center"
                  style={{
                    position: "absolute",
                    zIndex: 1000,
                  }}
                >
                  {/* Grid container for the modal contents */}
                  <Grid item xs={10} md={8} lg={8}>
                    <Box bgcolor="white" p={2}>
                      {/* Logo section */}
                      <Box textAlign="center" mb={2}>
                        <img
                          src={logo}
                          alt="cropped AMS Shadow Queen Logo BNY-1320x772"
                          style={{ width: "60%", maxWidth: 200 }}
                        />
                      </Box>
                      {/* Title section */}
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        mb={2}
                        textAlign="center"
                      >
                        BUSINESS REGISTRATION AUTHORIZATION
                      </Typography>
                      {/* Main content section */}
                      <Typography textAlign="center" paragraph marginBottom={5}>
                        Welcome to AMS, where we strive to ensure a secure and
                        trustworthy environment for
                        <br /> businesses and customers alike. As part of our
                        commitment to maintaining the integrity of
                        <br /> our platform, we have implemented an
                        authorization process for new business
                        <br />
                        registrations. This process is designed to verify the
                        legitimacy and authenticity of the <br />
                        businesses that join our community.
                      </Typography>
                      {/* Grid for key points section */}
                      <Box maxWidth="80%" mx="auto" marginBottom={5}>
                        <Grid container spacing={2} textAlign="center">
                          {/* Mapping through key points and displaying them in cards */}
                          {[
                            {
                              title: "Enhance Trust",
                              content:
                                "By confirming the legitimacy of businesses, we build trust among our users, making it a safer place to conduct business.",
                            },
                            {
                              title: "Review",
                              content:
                                "Our dedicated team will review the provided details, ensuring they align with our platform's policies and standards.",
                            },
                            {
                              title: "Verification",
                              content:
                                "In some cases, we may request additional documents or information to verify the authenticity of your business.",
                            },
                            {
                              title: "Approval",
                              content:
                                "Once your registration is approved, your business profile will be live on our platform, and you can start receiving orders for your products and services.",
                            },
                          ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
                              <Card>
                                <Box p={2}>
                                  <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    mb={1}
                                  >
                                    {item.title}
                                  </Typography>
                                  <Typography>{item.content}</Typography>
                                </Box>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                      {/* Additional information section */}
                      <Grid container spacing={2} justifyContent="center">
                        {/* Timeframe information */}
                        <Grid item xs={12} sm={6} md={6} lg={5}>
                          <Box mb={2}>
                            <Typography variant="h6" fontWeight="bold">
                              TIMEFRAME
                            </Typography>
                            <Typography>
                              The authorization process typically takes [X]
                              business days, depending on the complexity of your
                              business and the accuracy of the information
                              provided.
                            </Typography>
                          </Box>
                        </Grid>
                        {/* Contact information */}
                        <Grid item xs={12} sm={6} md={6} lg={5}>
                          <Box mb={2}>
                            <Typography variant="h6" fontWeight="bold">
                              CONTACT US
                            </Typography>
                            <Typography>
                              If you have any questions or require assistance
                              during the authorization process, please don't
                              hesitate to contact our support team at [Contact
                              Information].
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* Business Plus Subscription section */}
                      <View style={{ marginBottom: 10, paddingBottom: "50px" }}>
                        <Card
                          sx={{
                            width: "80%",
                            p: 0,
                            alignSelf: "flex-end",
                            mx: "auto",
                            height: "auto",
                          }}
                          mb={10}
                        >
                          <Box p={theme.spacing(2)}>
                            {/* Business Plus Subscription image */}
                            <Image
                              source={BusinessAccountPlus}
                              alt="business plus logo"
                              p={theme.spacing(2)}
                              style={{
                                width: "17vw",
                                height: "12vh",
                              }}
                            />
                          </Box>

                          <Box p={theme.spacing(2)}>
                            <Box
                              display="flex"
                              flexDirection={{ xs: "column", md: "row" }}
                              justifyContent="space-between"
                              alignItems="center"
                              mb={theme.spacing(2)}
                            >
                              {/* Business Plus Subscription title */}
                              <Typography
                                style={{
                                  color: "#252b42",
                                  fontWeight: 500,
                                  fontSize: theme.typography.h4.fontSize,
                                  width: { xs: "100%", md: "50%" },
                                }}
                              >
                                BUSINESS PLUS <br />
                                SUBSCRIPTION
                              </Typography>
                              {/* Business Plus Subscription pricing */}
                              <Box
                                textAlign="center"
                                mb={{ xs: theme.spacing(2), md: 0 }}
                              >
                                <Typography
                                  style={{
                                    color: "#23a6f0",
                                    fontWeight: "700",
                                    fontSize: theme.typography.h3.fontSize,
                                  }}
                                >
                                  R150
                                </Typography>
                                <Typography
                                  style={{
                                    color: "#b8d9f7",
                                    fontWeight: "700",
                                    fontSize: theme.typography.h6.fontSize,
                                  }}
                                >
                                  Per Month
                                </Typography>
                              </Box>
                            </Box>
                            {/* Business Plus Subscription description */}
                            <Typography paragraph mb={theme.spacing(4)}>
                              Unlock More Opportunities with Business Plus
                              Subscription
                            </Typography>
                            {/* Features of Business Plus Subscription */}
                            <Box mb={theme.spacing(2)}>
                              {[
                                "List Unlimited Products",
                                "Priority Support",
                                "Exclusive Promotions",
                              ].map((item, index) => (
                                <Box
                                  key={index}
                                  display="flex"
                                  alignItems="center"
                                  mb={theme.spacing(2)}
                                >
                                  <CheckCircleIcon
                                    style={{ color: "#2dc071" }}
                                  />
                                  <Typography
                                    ml={theme.spacing(1)}
                                    fontWeight="bold"
                                  >
                                    {item}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </Card>
                      </View>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </ModalDialog>
          </ModalOverflow>
        </Modal>
      </React.Fragment>
      {editModal ? (
        // View for the edit modal overlay
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            // top: 65,
            position: "fixed",
            minWidth: 280,
            height: "auto",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column", // Make the container a column
            justifyContent: "space-between", // Push the content to the end
            alignSelf: "center",
            width: "90%",
            "@media (min-width: 600px)": {
              alignSelf: "flex-end",
              width: 400,
            },
          }}
        >
          <TouchableOpacity
            onPress={() => setEditModal(false)}
            style={{ alignSelf: "flex-end", padding: 5 }}
          >
            <Icon name="close-a" size={20} color="black" />
          </TouchableOpacity>
          {/* Main container for the edit modal */}
          <View
            style={{
              // height: "80vh",
              backgroundColor: "white",
            }}
          >
            {/* Logo section */}
            {/* <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "40%",
              }}
            >
              <Image
                source={require("../../Global/images/logo.svg")}
                style={{
                  width: "50%",
                  height: "30%",
                  resizeMode: "contain",
                }}
              />
            </View> */}
            {/* Form section for editing product details */}
            <View style={{ paddingRight: 40, paddingLeft: 40 }}>
              {/* Title for the edit modal */}
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 30,
                  marginBottom: 5,
                }}
              >
                EDIT PRODUCT
              </Text>
              <View>
                {/* Image upload and display section */}
                {/* <div
                  className="uploadContainer"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                 
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Product Image ${index + 1}`}
                        style={{
                          padding: "10px",
                          marginRight: "10px",
                          width: "16%",
                          height: "8vh",
                        }}
                      />
                    ))
                  ) : (
                    <img
                      src={placeholder}
                      alt="Placeholder"
                      style={{
                        padding: "5px",
                        marginRight: "10px",
                        width: "16%",
                        height: "8vh",
                      }}
                    />
                  )}

                
                  <label
                    htmlFor="imageInput"
                    className="add"
                    style={{
                      backgroundColor: "whitesmoke",
                      color: "#000",
                      padding: "25px",
                      width: "5%",
                      cursor: "pointer",
                      alignSelf: "center",
                    }}
                  >
                    +
                  </label>
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    multiple // Allow selecting multiple files
                  />
                </div> */}

                {/* Form for editing product details */}
                <View style={{ alignSelf: "center" }}>
                  <form onSubmit={handleSaveEditProduct}>
                    {/* Name input */}
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="Name"
                      type="text"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ width: "100%" }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    {/* Business Name input */}
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="Business Name"
                      type="text"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ width: "100%" }}
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                    {/* <TextField
                     fullWidth
                     id="outlined-number"
                     label="Company Name"
                     type="text"
                     variant="standard"
                     InputLabelProps={{
                     shrink: true,
                     }}
                     style={{ width: "100%" }}
                     value={company}
                     onChange={(e) => setCompany(e.target.value)}
                     required
                     /> */}
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      <TextField
                        fullWidth
                        id="outlined-number"
                        label="length_cm"
                        type="number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{
                          width: "45%",
                          marginRight: "10px",
                        }}
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        required
                      />
                      <TextField
                        fullWidth
                        id="outlined-number"
                        label="width_cm"
                        type="number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{
                          width: "45%",
                          marginRight: "10px",
                        }}
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        required
                      />
                      <TextField
                        fullWidth
                        id="outlined-number"
                        label="height_cm"
                        type="number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{
                          width: "45%",
                          marginRight: "10px",
                        }}
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                      />
                      <TextField
                        fullWidth
                        id="outlined-number"
                        label="weight_kg"
                        type="number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{ width: "45%" }}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                      />
                    </View>
                    {/* Price and Quantity inputs */}
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        fullWidth
                        id="outlined-number"
                        label="Price"
                        type="text"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{
                          width: "45%",
                          marginRight: "10px",
                        }}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                      <TextField
                        fullWidth
                        id="outlined-number"
                        label="Quantity"
                        type="text"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{ width: "45%" }}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                      />
                    </View>
                    {/* Description input */}
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="Description"
                      type="text"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{
                        width: "100%",
                        marginBottom: "10px",
                      }}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    {/* Product Category input */}
                    <TextField
                      fullWidth
                      id="outlined-select-currency"
                      select
                      label="Product Category"
                      variant="standard"
                      value={selectedProductCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                      }}
                      required
                    >
                      {productCategory.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    {/* Brand input */}
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="Brand"
                      type="text"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{
                        width: "100%",
                        marginLeft: "5px",
                      }}
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required
                    />

                    {/* Loading indicator or Continue button */}
                    {loading ? (
                      // <Box
                      //   sx={{
                      //     display: "flex",
                      //     justifyContent: "center",
                      //     alignItems: "center",
                      //     height: "1vh",
                      //   }}
                      // >
                      //   <CircularProgress />
                      // </Box>
                      <View></View>
                    ) : (
                      <Button
                        variant="contained"
                        style={{
                          width: "100%",
                          height: "10%",
                          marginTop: "20px",
                          marginBottom: "10px",
                          background: "#072840",
                          borderRadius: "30px",
                        }}
                        type="submit"
                      >
                        Continue
                      </Button>
                    )}
                  </form>
                </View>
              </View>
            </View>
          </View>
        </Paper>
      ) : null}
      {addProduct ? (
        // Overlay for the add product modal
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            // top: 65,
            position: "fixed",
            minWidth: 280,
            height: "auto",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column", // Make the container a column
            justifyContent: "space-between", // Push the content to the end
            alignSelf: "center",
            width: "90%",
            "@media (min-width: 600px)": {
              alignSelf: "flex-end",
              width: 400,
            },
          }}
        >
          <TouchableOpacity
            onPress={() => setAddProduct(false)}
            style={{
              alignSelf: "flex-end",
              // backgroundColor: "red",
              padding: 5,
              borderRadius: 5,
              transition: "background-color 0.3s", // Add a smooth transition
              ":hover": {
                backgroundColor: "rgba(255, 0, 0, 0.7)", // Set the alpha value for transparency
              },
            }}
          >
            <Icon name="close-a" size={20} color="black" />
          </TouchableOpacity>

          <Grid style={{ alignSelf: "center" }}>
            <img
              src={logo}
              style={{
                height: "8vh",
                width: "100%",
                //paddingTop: "15vh"
              }}
            />
          </Grid>

          {/* <View
            style={{
              color: "#000",
              textAlign: "left",
              fontSize: "25px",
              textAlign: "center",
            }}
          >
            ADD PRODUCTS + SERVICES
          </View> */}
          <View
            // className="uploadContainer"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "8vh",
            }}
          >
            {/* Display selected images or placeholder */}
            {images.length > 0 ? (
              images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Product Image ${index + 1}`}
                  style={{
                    padding: "15px",
                    marginRight: "10px",
                    width: "16%",
                    height: "8vh",
                  }}
                />
              ))
            ) : (
              <img
                src={placeholder}
                alt="Placeholder"
                style={{
                  padding: "5px",
                  marginRight: "10px",
                  width: "16%",
                  height: "8vh",
                }}
              />
            )}

            {/* Button to trigger file input */}
            <label
              htmlFor="imageInput"
              className="add"
              style={{
                backgroundColor: "whitesmoke",
                color: "#000",
                padding: "20px",
                width: "5%",
                cursor: "pointer",
                alignSelf: "center",
              }}
            >
              +
            </label>
            {/* File input for image selection */}
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
              multiple // Allow selecting multiple files
            />
          </View>
          <View style={{ width: "80%", alignSelf: "center" }}>
            <form onSubmit={handleContinue}>
              {/* Name input */}
              <TextField
                fullWidth
                id="outlined-number"
                label="Name"
                type="text"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: "100%" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {/* Business Name input */}
              <TextField
                fullWidth
                id="outlined-number"
                label="Business Name"
                type="text"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: "100%" }}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
              {/* <TextField
                fullWidth
                id="outlined-number"
                label="Company Name"
                type="text"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: "100%" }}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              /> */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  fullWidth
                  id="outlined-number"
                  label="length_cm"
                  type="number"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{
                    width: "45%",
                    marginRight: "10px",
                  }}
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  id="outlined-number"
                  label="width_cm"
                  type="number"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{
                    width: "45%",
                    marginRight: "10px",
                  }}
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  id="outlined-number"
                  label="height_cm"
                  type="number"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{
                    width: "45%",
                    marginRight: "10px",
                  }}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  id="outlined-number"
                  label="weight_kg"
                  type="number"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ width: "45%" }}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </View>
              {/* Price and Quantity inputs */}
              <View style={{ display: "flex", flexDirection: "row" }}>
                <TextField
                  fullWidth
                  id="outlined-number"
                  label="Price"
                  type="text"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{
                    width: "45%",
                    marginRight: "10px",
                  }}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  id="outlined-number"
                  label="Quantity"
                  type="text"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ width: "45%" }}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </View>
              {/* Description input */}
              <TextField
                fullWidth
                id="outlined-number"
                label="Description"
                type="text"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{
                  width: "100%",
                  marginBottom: "10px",
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              {/* Product Category input */}
              <TextField
                fullWidth
                id="outlined-select-currency"
                select
                label="Product Category"
                variant="standard"
                value={selectedProductCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                style={{
                  width: "100%",
                  textAlign: "left",
                }}
                required
              >
                {productCategory.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              {/* Brand input */}
              <TextField
                fullWidth
                id="outlined-number"
                label="Brand"
                type="text"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{
                  width: "100%",
                  marginLeft: "5px",
                }}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />

              {/* Loading indicator or Continue button */}
              {loading ? (
                // <Box
                //   sx={{
                //     display: "flex",
                //     justifyContent: "center",
                //     alignItems: "center",
                //     height: "1vh",
                //   }}
                // >
                //   <CircularProgress />
                // </Box>
                <View></View>
              ) : (
                <Button
                  variant="contained"
                  style={{
                    width: "100%",
                    height: "10%",
                    marginTop: "20px",
                    marginBottom: "10px",
                    background: "#072840",
                    borderRadius: "30px",
                  }}
                  type="submit"
                >
                  Continue
                </Button>
              )}
            </form>
          </View>
        </Paper>
      ) : null}
      // Overlay for the payment modal
      {/* <Paper
          elevation={0}
          variant="outlined"
          sx={{
            // top: 65,
            position: "fixed",
            minWidth: 280,
            height: "auto",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column", // Make the container a column
            justifyContent: "space-between", // Push the content to the end
            alignSelf: "center",
            width: "90%",
            "@media (min-width: 600px)": {
              alignSelf: "flex-end",
              width: 400,
            },
          }}
        >
      
          <View
            style={{
              height: "50vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: logo }}
              style={{
                height: "9%",
                width: "80%",
                paddingTop: "30%",
                scale: "0.5",
              }}
            />
          </View>

         
          <View style={{ alignSelf: "center", width: "80%" }}>
            <Text
              style={{
                color: "#000",
                fontSize: 30,
                fontWeight: "bold",
                alignSelf: "flex-start",
              }}
            >
              PAYMENT INFO
            </Text>
          </View>

          
          <View style={{ width: "80%", alignSelf: "center" }}>
            <form onSubmit={handleSubscription}>
              
              <TextField
                id="standard-basic"
                label="Card Holder"
                variant="standard"
                fullWidth
                required
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                style={{ width: "100%" }}
              />

         
              <TextField
                id="standard-basic"
                label="Card Number"
                variant="standard"
                fullWidth
                required
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                style={{ width: "100%" }}
              />

           
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
               
                <TextField
                  id="standard-basic"
                  label="Expiry"
                  variant="standard"
                  fullWidth
                  value={expiery}
                  type="text"
                  required
                  onChange={(e) => setExpiery(e.target.value)}
                  style={{ width: "40%", marginRight: "15px" }}
                />

               
                <TextField
                  id="standard-basic"
                  label="CVV"
                  variant="standard"
                  fullWidth
                  value={cvv}
                  type="text"
                  required
                  onChange={(e) => setCvv(e.target.value)}
                  style={{ width: "50%", marginRight: "15px" }}
                />
              </View>

              <Button
                mode="contained"
                type="submit"
                style={{
                  width: "100%",
                  height: "15%",
                  marginTop: 20,
                  marginBottom: 20,
                  borderRadius: 30,
                  backgroundColor: "#072840",
                  alignSelf: "center",
                }}
              >
                Continue
              </Button>
            </form>
          </View>
        </Paper> */}
      {bannerModal ? (
        // Overlay for the banner modal
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            // top: 65,
            position: "fixed",
            minWidth: 280,
            height: "auto",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column", // Make the container a column
            justifyContent: "space-between", // Push the content to the end
            alignSelf: "center",
            width: "90%",
            "@media (min-width: 600px)": {
              alignSelf: "flex-end",
              width: 400,
            },
          }}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={() => setBannerModal(false)}
            style={{ alignSelf: "flex-end", padding: 5 }}
          >
            <Icon name="close-a" size={20} color="black" />
          </TouchableOpacity>

          {/* Logo section */}
          <Grid style={{ alignSelf: "center" }}>
            <img
              src={logo}
              style={{
                height: "8vh",
                width: "100%",
                paddingTop: 30,
                paddingBottom: 30,
              }}
            />
          </Grid>

          {/* Form container */}
          <View
            className="form-container"
            style={{
              width: "80%",
              alignSelf: "center",
            }}
          >
            {/* Logo in the form */}
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                height: "40%",
              }}
            >
              <Image
                source={require("../../Global/images/logo.svg")} // Make sure to provide the correct path to your logo
                style={{
                  width: "20%",
                  height: "20%",
                  resizeMode: "contain",
                }}
              />
            </View>

            {/* Add Banner title */}
            <View>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 30,
                  marginBottom: 5,
                  alignSelf: "flex-start",
                }}
              >
                ADD BANNER
              </Text>
            </View>

            {/* Upload container for images */}
            <View
              className="uploadContainer"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              {/* Display uploaded images */}
              {images.length > 0 ? (
                images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`Product Image ${index + 1}`}
                    style={{
                      padding: "5px",
                      marginRight: "10px",
                      width: "16%",
                      height: "8vh",
                    }}
                  />
                ))
              ) : (
                // Placeholder image when no image is uploaded
                <img
                  src={placeholder}
                  alt="Placeholder"
                  style={{
                    padding: "5px",
                    marginRight: "10px",
                    width: "16%",
                    height: "8vh",
                  }}
                />
              )}

              {/* Input for selecting images */}
              <label
                htmlFor="imageInput"
                className="add"
                style={{
                  backgroundColor: "whitesmoke",
                  color: "#000",
                  padding: "25px",
                  width: "5%",
                  cursor: "pointer",
                  alignSelf: "center",
                }}
              >
                +
              </label>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
                multiple // Allow selecting multiple files
              />
            </View>

            {/* Form for entering banner details */}
            <View style={{ display: "flex", alignSelf: "center" }}>
              <form onSubmit={handleSaveAddBanner}>
                {/* Input for Product Name */}
                <TextField
                  fullWidth
                  required
                  type="text"
                  variant="standard"
                  id="outlined-number"
                  value={productName}
                  label="Product Name"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => setProductName(e.target.value)}
                  style={{ width: "100%" }}
                />
                <br />

                {/* Inputs for Discount Price and Quantity */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Input for Discount Price */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <TextField
                      fullWidth
                      required
                      type="text"
                      variant="standard"
                      value={priceDiscount}
                      label="Discount Price"
                      onChange={(e) => setPriceDiscount(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </View>

                  {/* Input for Quantity */}
                  <View>
                    <TextField
                      fullWidth
                      required
                      type="text"
                      variant="standard"
                      value={quantity}
                      label="Quantity"
                      onChange={(e) => setQuantity(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </View>
                </View>

                {/* Input for Original Price */}
                <TextField
                  fullWidth
                  required
                  variant="standard"
                  type="text"
                  value={priceOriginal}
                  label="Original Price"
                  onChange={(e) => setPriceOriginal(e.target.value)}
                  style={{ width: "100%" }}
                />

                {/* Input for Other details */}
                <TextField
                  fullWidth
                  required
                  variant="standard"
                  label="Other"
                  type="text"
                  value={otherBanner}
                  onChange={(e) => setOtherBanner(e.target.value)}
                  style={{ width: "100%" }}
                />

                {/* Continue button */}
                <Button
                  variant="contained"
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: 14,
                    backgroundColor: "#072840",
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 10,
                    marginTop: 20,
                    marginBottom: 20,
                    alignSelf: "center",
                    width: "100%",
                  }}
                  type="submit"
                >
                  continue
                </Button>
              </form>
            </View>
          </View>
        </Paper>
      ) : null}
      <View style={{ backgroundColor: "white" }}>
        <Header />
        <NavBar />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#FFFFFF",
          }}
        >
          {!isMobile && (
            <View
              style={{
                paddingLeft: 30,
                backgroundColor: "whitesmoke",
                alignItems: "flex-start",
              }}
            >
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                paddingRight={2}
              >
                <View
                  elevation={3}
                  style={{
                    padding: "20px",
                    height: "100%",
                    width: "300px",
                    margin: "auto",
                    backgroundColor: "whitesmoke",
                  }}
                >
                  <Box textAlign="center">
                    <img
                      src={sara}
                      alt="User Image"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        marginTop: "80%",
                      }}
                    />
                    <Box sx={{ marginTop: "10%" }}>
                      <Typography variant="h6">
                        {userData?.name} {userData?.surname}
                      </Typography>
                      <Typography variant="subtitle1">
                        {userData?.phone}
                      </Typography>
                      <Typography variant="subtitle2">
                        {userData?.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ textAlign: "center" }}>
                      {userData?.location}
                    </Typography>
                  </Box>

                  <Box style={{ marginTop: "50%" }}>
                    <Ionicons name="ios-timer-outline" size={15} color="gray" />
                    <Button
                      style={{ marginLeft: 5, color: "gray" }}
                      // onClick={handleorders}
                    >
                      Orders
                    </Button>
                  </Box>

                  <Box>
                    <Ionicons name="ios-timer-outline" size={15} color="gray" />
                    <Button
                      style={{ marginLeft: 5, color: "gray" }}
                      // onClick={handlefavorites}
                    >
                      Favorites
                    </Button>
                  </Box>

                  <Box>
                    <Ionicons name="ios-timer-outline" size={15} color="gray" />
                    <Button
                      style={{ marginLeft: 5, color: "gray" }}
                      // onClick={handleterms}
                    >
                      Terms and Conditions
                    </Button>
                  </Box>

                  <Box sx={{}}>
                    <Ionicons name="ios-timer-outline" size={15} color="gray" />
                    <Button
                      style={{ marginLeft: 5, color: "gray" }}
                      // onClick={handlepolicy}
                    >
                      Privacy Policy
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      marginTop: "40px",
                      backgroundColor: "rgba(266, 255, 255, 0.9)",
                      textAlign: "center",
                      padding: {
                        xs: "10px",
                        sm: "20px",
                      },
                    }}
                  >
                    <Button
                      sx={{
                        fontWeight: "bolder",
                        color: "black",
                        marginTop: "10%",
                      }}
                      // onClick={handlePress}
                    >
                      Julian James
                    </Button>

                    <Button sx={{ color: "gray", mt: 1, marginTop: "10%" }}>
                      Alternative Contact
                    </Button>
                  </Box>

                  <Box textAlign="center" marginTop="10%">
                    <Button onClick={handleSignOut} style={{ color: "red" }}>
                      SIGN OUT
                    </Button>
                  </Box>
                </View>
              </Box>
            </View>
          )}
          {isMobile && (
            <Box style={{ textAlign: "center", padding: "10px" }}>
              <Ionicons
                name="ios-menu"
                size={30}
                color="black"
                onClick={toggleDropdown}
              />
            </Box>
          )}
          {isMobile && showDropdown && (
            <Box
              style={{
                position: "absolute",
                top: "60px", // Adjust the top position as needed
                right: "20px",
                backgroundColor: "whitesmoke",
                padding: "10px",
                zIndex: 999,
              }}
            >
              {/* Your dropdown content here */}
              <Box textAlign="center">
                <img
                  src={sara}
                  alt="User Image"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    marginTop: "80%",
                  }}
                />
                <Box sx={{ marginTop: "10%" }}>
                  <Typography variant="h6">
                    {userData?.name} {userData?.surname}
                  </Typography>
                  <Typography variant="subtitle1">{userData?.phone}</Typography>
                  <Typography variant="subtitle2">{userData?.email}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography sx={{ textAlign: "center" }}>
                  {userData?.location}
                </Typography>
              </Box>

              <Box style={{ marginTop: "50%" }}>
                <Ionicons name="ios-timer-outline" size={15} color="gray" />
                <Button
                  style={{ marginLeft: 5, color: "gray" }}
                  // onClick={handleorders}
                >
                  Orders
                </Button>
              </Box>

              <Box>
                <Ionicons name="ios-timer-outline" size={15} color="gray" />
                <Button
                  style={{ marginLeft: 5, color: "gray" }}
                  // onClick={handlefavorites}
                >
                  Favorites
                </Button>
              </Box>

              <Box>
                <Ionicons name="ios-timer-outline" size={15} color="gray" />
                <Button
                  style={{ marginLeft: 5, color: "gray" }}
                  // onClick={handleterms}
                >
                  Terms and Conditions
                </Button>
              </Box>

              <Box sx={{}}>
                <Ionicons name="ios-timer-outline" size={15} color="gray" />
                <Button
                  style={{ marginLeft: 5, color: "gray" }}
                  // onClick={handlepolicy}
                >
                  Privacy Policy
                </Button>
              </Box>

              <Box
                sx={{
                  marginTop: "40px",
                  backgroundColor: "rgba(266, 255, 255, 0.9)",
                  textAlign: "center",
                  padding: {
                    xs: "10px",
                    sm: "20px",
                  },
                }}
              >
                <Button
                  sx={{
                    fontWeight: "bolder",
                    color: "black",
                    marginTop: "10%",
                  }}
                  // onClick={handlePress}
                >
                  Julian James
                </Button>

                <Button sx={{ color: "gray", mt: 1, marginTop: "10%" }}>
                  Alternative Contact
                </Button>
              </Box>

              <Box textAlign="center" marginTop="10%">
                <Button onClick={handleSignOut} style={{ color: "red" }}>
                  SIGN OUT
                </Button>
              </Box>
              {/* Add the rest of your dropdown components */}
            </Box>
          )}

          <View style={{ flex: 1 }}>
            <View
              style={{
                height: "150px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Displaying an image of the blacksilk */}
              <Image
                source={BlackSilk}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
            </View>

            <View
              style={{
                height: "110px",
                backgroundColor: "#072840",
                paddingTop: 20,
                paddingLeft: 30,
              }}
            >
              {/* Text information about the business */}
              <Text
                style={{
                  display: "flex",
                  color: "white",
                  flexDirection: "column",
                }}
              >
                {/* Business name */}
                <Text
                  style={{ fontWeight: "600", fontSize: 18, marginBottom: -5 }}
                >
                  BUSINESS
                </Text>
                {/* Business name or slogan */}
                <Text
                  style={{ fontWeight: "600", fontSize: 30, marginBottom: 5 }}
                >
                  SECURETECH SOLUTIONS
                </Text>
                {/* Business website or domain */}
                <Text style={{ fontWeight: "600", fontSize: 14 }}>
                  secure.tech.co.za
                </Text>
              </Text>
            </View>

            <View>
              <View>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingRight: 30,
                    paddingBottom: 30,
                    paddingTop: 30,
                    paddingLeft: 30,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap", // Allow items to wrap to the next line
                      padding: 20, // Add padding for better spacing
                    }}
                  >
                    <View style={{ marginBottom: 10, flexWrap: "wrap" }}>
                      {/* Heading for Products & Services */}
                      <Text style={{ fontWeight: "700", fontSize: 20 }}>
                        PRODUCTS & SERVICES
                      </Text>
                      {/* Additional information displayed conditionally */}
                      <Text
                        style={{
                          display:
                            // userData && !userData.subscribed ? "none" : "flex", // Adjust based on user subscription
                            userData ? "none" : "flex", // Adjust based on user subscription
                          fontWeight: 600,
                          fontSize: 14,
                          flexWrap: "wrap",
                        }}
                      >
                        Please add a minimum of 3 products
                      </Text>
                    </View>
                    {/* Business Plus subscription information */}
                    <Text
                      style={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: 14,
                        backgroundColor: "#072840",
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: 25,
                        paddingRight: 25,
                        borderRadius: 20,
                        marginTop: userData && !userData.subscribed ? 0 : 10, // Adjust spacing based on condition
                      }}
                    >
                      BUSINESS PLUS R150/PM
                    </Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Conditional display for Authorization Pending message */}
                    <Text
                      style={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: 14,
                        backgroundColor: "#fe951c",
                        paddingTop: 10,
                        paddingBottom: 10,
                        borderRadius: 20,
                        display: userData ? "none" : "flex",
                        // userData && userData.subscribed ? "none" : "flex",
                        marginTop: 5,
                        justifyContent: "center",
                        paddingLeft: 25,
                        paddingRight: 25,
                      }}
                    >
                      AUTHORIZATION PENDING
                    </Text>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* Button to add a product */}
                      <TouchableOpacity
                        onPress={() => setAddProduct(true)}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: 14,
                            backgroundColor: "#072840",
                            paddingTop: 10,
                            paddingBottom: 10,
                            paddingLeft: 25,
                            paddingRight: 25,
                            borderRadius: 20,
                            display: !userData ? "none" : "flex",
                            //  userData && !userData.subscribed
                            //   ? "none"
                            //   : "flex",
                            marginRight: 20,
                          }}
                        >
                          ADD PRODUCT
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {userData && userData.subscribed ? ( //the usre must be subscribed
                  // Card component containing business banners and add banner option
                  <Card
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      display: "flex",
                    }}
                  >
                    {banner.length > 0 ? (
                      // View displaying the current banner with background image and details
                      <View
                        style={{
                          backgroundImage: `url(${banner[0].bannerImage[currentIndex]})`,
                          backgroundColor: "gray",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 15,
                          flex: 1,
                          transition: "0.5s ease-in-out",
                        }}
                      >
                        {/* Navigation button to go to the previous banner */}
                        <TouchableOpacity
                          onPress={handlePrevClick}
                          style={{ marginRight: 20 }}
                        >
                          <AntDesign name="left" size={24} color="white" />
                        </TouchableOpacity>
                        {/* Details of the current banner */}
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: "white",
                            }}
                          >
                            {banner[0].other}
                          </Text>
                          <Text
                            style={{
                              fontSize: 25,
                              fontWeight: 700,
                              color: "white",
                            }}
                          >
                            {banner[0].productName}
                          </Text>
                          <Text>
                            {/* Displaying discount and original prices */}
                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: "#c29920",
                              }}
                            >
                              R{banner[0].discountPrice}
                            </Text>{" "}
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: 400,
                                color: "white",
                              }}
                            >
                              R{banner[0].originalPrice}
                            </Text>
                          </Text>
                        </View>
                        {/* Navigation button to go to the next banner */}
                        <TouchableOpacity onPress={handleNextClick}>
                          <AntDesign name="right" size={24} color="white" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View
                        style={{
                          // backgroundImage: `url(${banner[0].bannerImage[currentIndex]})`,
                          backgroundColor: "gray",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 15,
                          flex: 1,
                          transition: "0.5s ease-in-out",
                        }}
                      >
                        {/* Navigation button to go to the previous banner */}
                        <TouchableOpacity
                          // onPress={handlePrevClick}
                          style={{ marginRight: 20 }}
                        >
                          <AntDesign name="left" size={24} color="white" />
                        </TouchableOpacity>
                        {/* Details of the current banner */}
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: "white",
                            }}
                          >
                            EXCLUSIVE OFFER:SAVE BIG TODAY
                          </Text>
                          <Text
                            style={{
                              fontSize: 25,
                              fontWeight: 700,
                              color: "white",
                            }}
                          >
                            ULTRA HT SMART TV
                          </Text>
                          <Text>
                            {/* Displaying discount and original prices */}
                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: "#c29920",
                              }}
                            >
                              R1699.99
                            </Text>{" "}
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: 400,
                                color: "white",
                              }}
                            >
                              R1899.99
                            </Text>
                          </Text>
                        </View>
                        {/* Navigation button to go to the next banner */}
                        <TouchableOpacity
                        // onPress={handleNextClick}
                        >
                          <AntDesign name="right" size={24} color="white" />
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Option to add a new banner */}
                    <TouchableOpacity
                      style={{
                        display: "flex",
                        cursor: "pointer",
                        width: "15%",
                        borderRadius: 20,
                        border: "1px gray dashed",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        fontWeight: 700,
                        marginLeft: 10,
                      }}
                      // onPress={() => setBannerModal(true)}
                    >
                      <Text>ADD BANNER</Text>
                    </TouchableOpacity>
                  </Card>
                ) : null}
              </View>
              {userData && !userData.subscribed ? (
                <></>
              ) : // Displayed when businessAuthorization is false whicn is when not subscibed
              // <View
              //   style={{
              //     top: "20%", // Use percentages for responsiveness
              //     position: "absolute",
              //     flex: 1,
              //     display: "flex",
              //     justifyContent: "flex-end",
              //     alignItems: "flex-end",
              //     zIndex: 100,
              //     alignSelf: "flex-end",
              //     backgroundColor: "red",
              //   }}
              // >

              //   <View
              //     style={{
              //       width: "auto", // Use percentages for responsiveness
              //       flexDirection: "column",
              //       borderWidth: 1,
              //       backgroundColor: "white",
              //       borderColor: "lightgray",
              //       padding: 20,
              //       alignItems: "center",
              //       minHeight: "50%", // Use percentages for responsiveness
              //       zIndex: 500,
              //     }}
              //   >

              //     <Image
              //       source={require("../../Global/images/BusinessPlus+.jpg")}
              //       alt="business plus logo"
              //       style={{
              //         width: "120px", // Use percentages for responsiveness
              //         aspectRatio: 10 / 7, // Maintain the aspect ratio
              //         marginBottom: 5,
              //         height: "40px",
              //       }}
              //     />

              //     <Text
              //       style={{
              //         color: "#252b42",
              //         fontWeight: "700",
              //         fontSize: 16, // Adjust font size as needed
              //         textAlign: "center",
              //       }}
              //     >

              //       BUSINESS PLUS SUBSCRIPTION
              //     </Text>
              //     <Text
              //       style={{
              //         color: "#9e9e9e",
              //         fontWeight: "700",
              //         fontSize: 12, // Adjust font size as needed
              //         textAlign: "center",
              //         paddingTop: 10,
              //         paddingBottom: 10,
              //       }}
              //     >

              //       Unlock More Opportunities with Business Plus Subscription
              //     </Text>

              //     <View
              //       style={{
              //         flexDirection: "column",
              //         alignItems: "center",
              //         justifyContent: "center",
              //       }}
              //     >
              //       <Text
              //         style={{
              //           color: "#23a6f0",
              //           fontWeight: "700",
              //           fontSize: 24, // Adjust font size as needed
              //           marginBottom: -5,
              //         }}
              //       >
              //         R150
              //       </Text>
              //       <Text
              //         style={{
              //           color: "#b8d9f7",
              //           fontWeight: "700",
              //           fontSize: 14, // Adjust font size as needed
              //         }}
              //       >
              //         Per Month
              //       </Text>
              //     </View>

              //     <View style={{ flexDirection: "column" }}>
              //       <Text
              //         style={{
              //           marginTop: 10,
              //           fontWeight: "700",
              //           fontSize: 12, // Adjust font size as needed
              //           flexDirection: "row",
              //           alignItems: "center",
              //         }}
              //       >

              //         <Ionicons
              //           name="checkmark-circle"
              //           size={20}
              //           color="#2dc071"
              //         />
              //         List Unlimited Products
              //       </Text>
              //       <Text
              //         style={{
              //           fontWeight: "700",
              //           fontSize: 12, // Adjust font size as needed
              //           marginTop: 10,
              //           flexDirection: "row",
              //           alignItems: "center",
              //         }}
              //       >

              //         <Ionicons
              //           name="checkmark-circle"
              //           size={20}
              //           color="#2dc071"
              //         />
              //         Priority Support
              //       </Text>
              //       <Text
              //         style={{
              //           fontWeight: "700",
              //           fontSize: 12, // Adjust font size as needed
              //           marginTop: 10,
              //           flexDirection: "row",
              //           alignItems: "center",
              //         }}
              //       >

              //         <Ionicons
              //           name="checkmark-circle"
              //           size={20}
              //           color="#2dc071"
              //         />
              //         Exclusive Promotions
              //       </Text>
              //     </View>
              //   </View>
              // </View>
              null}
              {/* ScrollView to allow vertical scrolling */}
              <ScrollView style={{ width: "100%" }}>
                {/* Container view for the product cards */}
                <View
                  style={{
                    paddingRight: 10,
                    marginBottom: 20,
                  }}
                >
                  {/* Flex container for the product cards */}
                  <View style={{ flex: 1 }}>
                    {/* Flex container for wrapping the product cards */}

                    {screenWidth < 600 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        {/* Mapping through products to display individual product cards */}

                        {products.length >= 1 ? (
                          products.map((product, index) => (
                            <View
                              key={product.id}
                              style={{
                                display: "flex",
                                margin: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                // backgroundColor: "yellow",
                              }}
                            >
                              {/* View for styling and layout within each Card */}
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  // paddingTop: 10,
                                  margin: 5,
                                }}
                              >
                                {/* Box for styling product display */}
                                <Box
                                  style={{
                                    objectFit: "cover",
                                    position: "relative",
                                    background:
                                      "radial-gradient(circle at top left, rgba(255, 255, 255, 0.5) 0%, #D4AF37 10%, #B48811 40%, #A2790D 50%, #E7BE3A 90%)",
                                    width: "110px",
                                    height: "110px",
                                    borderRadius: "50%",
                                    alignself: "center",
                                    justifyContent: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <View
                                    style={{
                                      alignSelf: "center",
                                      width: 100,
                                      height: 100,
                                    }}
                                  >
                                    <CardMedia
                                      component="img"
                                      height="140"
                                      image={
                                        product.images &&
                                        product.images.length > 0
                                          ? product.images[0]
                                          : "../../assets/image/headsets.png"
                                      }
                                      alt={product.name}
                                      style={{
                                        borderRadius: "100px",
                                        objectFit: "cover",
                                        width: "100%",
                                        height: "100%",
                                      }}
                                    />
                                  </View>

                                  {/* Snackbar for showing a success message when adding to favorites */}
                                  {/* <Snackbar
                                    open={showSnackbar}
                                    autoHideDuration={3000}
                                    onClose={handleSnackbarClose}
                                    anchorOrigin={{
                                      vertical: "top",
                                      horizontal: "center",
                                    }}
                                  >
                                    <MuiAlert
                                      onClose={handleSnackbarClose}
                                      severity="success"
                                      sx={{ width: "100%" }}
                                    >
                                      Product added to favorites!
                                    </MuiAlert>
                                  </Snackbar> */}

                                  {/* Box containing heart and shopping cart icons with interaction */}
                                </Box>

                                {/* View for styling and layout within each Card */}
                                <View
                                  style={{
                                    width: "100%",
                                    justifyContent: "space-between",
                                    marginTop: "5%",
                                  }}
                                >
                                  {/* View for displaying product details */}
                                  <View>
                                    {/* View for displaying product category and rating */}
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                      }}
                                    ></View>

                                    {/* Typography component for displaying the product name */}
                                    {/* Typography component for displaying the product name */}
                                    <Typography
                                      variant="body2"
                                      component="body2"
                                      style={{
                                        color: "black",
                                        wordWrap: "break-word",
                                        display: "inline",
                                      }}
                                    >
                                      {product.name &&
                                        product.name.slice(0, 15)}
                                      {product.name && product.name.length < 50
                                        ? ""
                                        : "..."}
                                    </Typography>

                                    {/* Typography component for displaying the product description */}
                                    <Typography
                                      variant="subtitle2"
                                      component="p"
                                      style={{
                                        color: "gray",
                                        wordWrap: "break-word",
                                        display: "inline",
                                      }}
                                    >
                                      {product.description &&
                                      product.description.length > 12
                                        ? `${product.description.slice(
                                            0,
                                            12
                                          )}...`
                                        : product.description}
                                    </Typography>
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginBottom: 5,
                                        marginTop: 5,
                                      }}
                                    >
                                      <View
                                        style={{
                                          backgroundColor: "#072840",
                                          paddingHorizontal: 5,
                                          paddingVertical: 3,
                                          borderRadius: 15,
                                        }}
                                      >
                                        <Text style={{ color: "white" }}>
                                          ⭐ {review[product.id] || 0}
                                        </Text>
                                      </View>
                                      {/* <TouchableOpacity>
                                        <Icon
                                          name={
                                            favoriteProducts.find(
                                              (item) =>
                                                item.productId === product.id
                                            )
                                              ? "heart"
                                              : "heart-o"
                                          }
                                          size={20}
                                          style={{
                                            marginLeft: 5,
                                          }}
                                          onPress={() => toggleHeart(product)} // Use onPress instead of onClick for TouchableOpacity
                                          color={
                                            favoriteProducts.find(
                                              (item) =>
                                                item.productId === product.id
                                            )
                                              ? "red"
                                              : "black"
                                          }
                                        />
                                      </TouchableOpacity> */}

                                      {/* TouchableOpacity for adding product to the cart */}
                                      {/* <TouchableOpacity
                                        onPress={() => toggleCart(product)}
                                      >
                                        <Snackbar
                                          open={showSnackbar1}
                                          autoHideDuration={3000} // Adjust as needed
                                          onClose={handleSnackbarClose1}
                                          anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "center",
                                          }} // Set position to top center
                                        >
                                          <MuiAlert
                                            onClose={handleSnackbarClose1}
                                            severity="success"
                                            sx={{ width: "100%" }}
                                          >
                                            Product added to Cart!
                                          </MuiAlert>
                                        </Snackbar>
                                        <Icon3
                                          name={
                                            cartItems.find(
                                              (item) =>
                                                item.productId === product.id
                                            )
                                              ? "cart"
                                              : "cart-outline"
                                          }
                                          size={20}
                                          style={{
                                            marginLeft: 5,
                                          }}
                                          color="black"
                                        />
                                      </TouchableOpacity> */}
                                      {/* Box for displaying additional product details */}
                                      <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="flex-start"
                                        justifyContent="space-between"
                                      >
                                        {/* Typography component for displaying sales information */}
                                        {/* <Typography
                                         variant="body2"
                                         component="p"
                                         style={{ color: "gray" }}
                                         >
                                        <Icon2 name="download" size={20} /> {product.quantity}{" "}
                                        Sales
                                        </Typography> */}
                                        {/* View for displaying product price */}
                                      </Box>
                                    </View>
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      {/* Typography component for displaying the original product price */}
                                      <Typography
                                        variant="body2"
                                        component="p"
                                        style={{
                                          color: "gray",
                                          marginRight: 5,
                                        }}
                                      >
                                        <Icon2 name="download" size={20} /> 15
                                        In stalk
                                      </Typography>

                                      {/* Typography component for displaying the discounted product price */}
                                    </View>
                                    <View
                                      style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        // backgroundColor: 'red',
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle2"
                                        component="p"
                                        style={{
                                          color: "rgb(97, 151, 97)",
                                          fontSize: "18px",
                                          fontWeight: "700",
                                        }}
                                      >
                                        R{product.price}
                                      </Typography>
                                      <TouchableOpacity
                                        onPress={() => setDoctoEdit(product.id)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          height={20}
                                          width={20}
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                          />
                                        </svg>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={() =>
                                          deleteProduct(product.id)
                                        }
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          height={20}
                                          width={20}
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                          />
                                        </svg>
                                      </TouchableOpacity>
                                    </View>
                                  </View>

                                  {/* Button for navigating to the product details screen */}
                                  {/* <Button
                                    style={{
                                      border: "1px black solid",
                                      alignSelf: "flex-start",
                                      borderRadius: "50px",
                                      marginBottom: 15,
                                      color: "black",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      navigateProductDetails(product.id)
                                    }
                                  >
                                    VIEW <Icon name="arrow-right" size={20} />
                                  </Button> */}
                                </View>
                              </View>
                            </View>
                          ))
                        ) : (
                          <Typography variant="body1" component="p">
                            There are no products available. You can add up to 3
                            products.
                          </Typography>
                        )}
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        {/* Mapping through products to display individual product cards */}

                        {products.length >= 1 ? (
                          products.map((product, index) => (
                            <View
                              key={index}
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                margin: 1,
                                height: 450,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  paddingTop: 10,
                                  margin: 20,
                                }}
                              >
                                <Box
                                  style={{
                                    objectFit: "cover",
                                    position: "relative",
                                    background:
                                      "radial-gradient(circle at top left, rgba(255, 255, 255, 0.5) 0%, #D4AF37 10%, #B48811 40%, #A2790D 50%, #E7BE3A 90%)",

                                    width: "200px",
                                    height: "200px",
                                    borderRadius: "50%",
                                    alignself: "center",
                                    justifyContent: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <View
                                    style={{
                                      alignSelf: "center",
                                      width: 180,
                                      height: 180,
                                    }}
                                  >
                                    <CardMedia
                                      component="img"
                                      height="140"
                                      image={
                                        product.images &&
                                        product.images.length > 0
                                          ? product.images[0]
                                          : "../../assets/image/headsets.png"
                                      }
                                      alt={product.name}
                                      style={{
                                        borderRadius: "100px",
                                        objectFit: "cover",
                                        width: "100%",
                                        height: "100%",
                                      }}
                                    />
                                    {/* <Box
                                      style={{
                                        backgroundColor: "#E74040",
                                        position: "absolute",
                                        top: 0,

                                        padding: 2,
                                        width: "30%",
                                        borderRadius: "8%",
                                        alignSelf: "center",
                                      }}
                                    >
                                      <Typography
                                        variant="h5"
                                        style={{
                                          color: "#fff",
                                          textAlign: "center",
                                        }}
                                      >
                                        Sale
                                      </Typography>
                                    </Box> */}
                                  </View>
                                </Box>

                                <View
                                  style={{
                                    width: "100%",
                                    justifyContent: "space-between",
                                    marginTop: 16,
                                    height: "25vh",
                                  }}
                                >
                                  <View>
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          flex: 1,
                                          fontSize: "15px",
                                          color: "#4FC3F7",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {product.selectedProductCategory}
                                      </Text>
                                      <View
                                        style={{
                                          backgroundColor: "#072840",
                                          paddingHorizontal: 5,
                                          paddingVertical: 3,
                                          borderRadius: 15,
                                        }}
                                      >
                                        <Text style={{ color: "white" }}>
                                          ⭐ {review[product.id] || 0}
                                        </Text>
                                      </View>
                                    </View>
                                    <Typography variant="h5" component="h5">
                                      {product.name &&
                                        product.name.slice(0, 15)}
                                      {product.name && product.name.length < 50
                                        ? ""
                                        : "..."}
                                    </Typography>
                                    <Typography
                                      variant="subtitle2"
                                      component="p"
                                      style={{
                                        color: "gray",
                                        wordWrap: "break-word",
                                        display: "inline",
                                      }}
                                    >
                                      {product.description &&
                                      product.description.length > 25
                                        ? `${product.description.slice(
                                            0,
                                            25
                                          )}...`
                                        : product.description}
                                    </Typography>
                                    <Box
                                      display="flex"
                                      flexDirection="column"
                                      alignItems="flex-start"
                                      justifyContent="space-between"
                                    >
                                      <View
                                        style={{
                                          width: "100%",
                                          display: "flex",
                                          flexDirection: "row",
                                          justifyContent: "space-between",
                                          // backgroundColor: 'red',
                                          alignItems: "center",
                                        }}
                                      >
                                        <Typography
                                          variant="body2"
                                          component="p"
                                          style={{ color: "gray" }}
                                        >
                                          <Icon2 name="download" size={20} /> 15
                                          In stalk
                                        </Typography>
                                        <Box
                                          style={{
                                            backgroundColor: "#E74040",
                                            // position: "absolute",
                                            // top: 0,

                                            padding: 2,
                                            width: "auto",
                                            borderRadius: "8%",
                                            // alignSelf: "center",
                                          }}
                                        >
                                          {product.approved === true ? (
                                            <Typography
                                              variant="h5"
                                              style={{
                                                color: "#fff",
                                                textAlign: "center",
                                              }}
                                            >
                                              Approved
                                            </Typography>
                                          ) : (
                                            <Typography
                                              variant="h5"
                                              style={{
                                                color: "#fff",
                                                textAlign: "center",
                                              }}
                                            >
                                              Not Approved
                                            </Typography>
                                          )}
                                        </Box>
                                      </View>

                                      <View
                                        style={{
                                          width: "100%",
                                          display: "flex",
                                          flexDirection: "row",
                                          justifyContent: "space-between",
                                          // backgroundColor: 'red',
                                          alignItems: "center",
                                        }}
                                      >
                                        {/* <Typography
                                          variant="subtitle2"
                                          component="p"
                                          style={{
                                            color: "#BDBDBD",
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            marginRight: "10px",
                                          }}
                                        >
                                          R{product.price}
                                        </Typography> */}
                                        <Typography
                                          variant="subtitle2"
                                          component="p"
                                          style={{
                                            color: "rgb(97, 151, 97)",
                                            fontSize: "18px",
                                            fontWeight: "700",
                                          }}
                                        >
                                          R{product.price}
                                        </Typography>
                                        <TouchableOpacity
                                          onPress={() =>
                                            setDoctoEdit(product.id)
                                          }
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            height={20}
                                            width={20}
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                            />
                                          </svg>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                          onPress={() =>
                                            deleteProduct(product.id)
                                          }
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            height={20}
                                            width={20}
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                            />
                                          </svg>
                                        </TouchableOpacity>
                                      </View>
                                    </Box>
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))
                        ) : (
                          <Typography variant="body1" component="p">
                            There are no products available. You can add up to 3
                            products.
                          </Typography>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
      <Footer />
    </>
  );
}
