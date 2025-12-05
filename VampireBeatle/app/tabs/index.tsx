import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";

import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";

// Use an image picker step 2 120525 AM
import * as ImagePicker from 'expo-image-picker';
// Use the selected image step 4 120525 AM
import { useState } from "react";     // declare a state variable using the useState hook

// splash screen junk (does not work)
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 5000);

// ~ does not resolve to root 120525 AM
// NOTE: @ symbol is a custom path alias for importing custom components and other modules instead of relative paths, configured in tsconfig.json
const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);  // step 4 use an image picker 120525 AM

  // Use an image picker step 2 120525 AM
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      console.log(result);
    } else {    // result canceled
      alert('You did not select any image.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
        <Button label="Use this photo" />
      </View>
      <View>
        <Text style={styles.text}>Home screen</Text>
        <Link href="/tabs/about" style={styles.button}>Go to About screen</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#1e90ff',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});