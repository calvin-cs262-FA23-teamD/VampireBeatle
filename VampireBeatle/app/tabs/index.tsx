import { ImageSourcePropType, Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";

// import components
import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";
import CircleButton from "@/components/CircleButton";
import IconButton from "@/components/IconButton";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiList from "@/components/EmojiList";
import EmojiSticker from "@/components/EmojiSticker";
// BEGIN IMPORT COMPONENTS FOR BEATLE -- STARTED 120825 AM
import PausePlayButton from "@/components/PausePlayButton";

/* Import style code -- replaced .. with @ */
import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';


// Use an image picker step 2 120525 AM
import * as ImagePicker from 'expo-image-picker';
// Use the selected image step 4 120525 AM
import { useState } from "react";     // declare a state variable using the useState hook

// Add gestures. 120825 AM
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign } from "@expo/vector-icons";

// splash screen junk (does not work)
/*import * as SplashScreen from 'expo-splash-screen';
import { ImageSourcePropType } from "react-native/types_generated/index";
SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 5000);*/

// ~ does not resolve to root 120525 AM
// NOTE: @ symbol is a custom path alias for importing custom components and other modules instead of relative paths, configured in tsconfig.json
const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);  // step 4 use an image picker 120525 AM
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);       // declare a boolean state variable to show/hide buttons that open the modal 120825 AM
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);       // hides the modal until the user presses the button to open it
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | undefined>(undefined);

  // BEGIN HOOKS SPECIFIC TO BEATLE -- STARTED 120825 AM
  const [pausePlayIcon, setPausePlayIcon] = useState<keyof typeof AntDesign.glyphMap>('caret-right');       // component expects typed prop; 'caret-right' is a valid AntDesign icon

  // Use an image picker step 2 120525 AM
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);      // update the pickImageAsync() function to set showAppOptions after the user picks an image 120825 AM
      console.log(result);
    } else {    // result canceled
      alert('You did not select any image.');
    }
  };

  // if the reset button is pressed 120825 AM
  const onReset = () => {
    setShowAppOptions(false);
  }

  // placeholder for now
  const onAddSticker = () => {
    // code will go here
    setIsModalVisible(true);
  };

  // placeholder for now
  const onSaveImageAsync = async () => {
    // code will go here
  };

  // create the onModalClose() function to update the isModalVisible state variable
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  // BEGIN FUNCTIONS SPECIFIC TO BEATLE -- STARTED 120825 AM
  const togglePausePlay = () => {
    setPausePlayIcon((PausePlayIcon) => (PausePlayIcon === 'caret-right' ? 'pause' : 'caret-right'));
    // additional code to handle pausing/playing audio will go here TODO
  }


  return (

    <GestureHandlerRootView style={styles.container}>
    {/*<View style={styles.container}>*/}
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
        {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" />
        </View>
      )}
      {/* Replace text with PausePlayButton component wrapped in a View 120825 AM */}
      {/*
      <View>
        <Text style={styles.text}>Home screen</Text>
        <Link href="/tabs/about" style={styles.button}>Go to About screen</Link>
      </View>*/}
      <View style={styles.footerContainer}>
        <PausePlayButton
          onPress={togglePausePlay}
          pausePlayIcon={pausePlayIcon}
          width={300}
        />
      </View>
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        {/* Emoji list component will go here */}
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    {/*</View>*/}
    </GestureHandlerRootView>
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
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});