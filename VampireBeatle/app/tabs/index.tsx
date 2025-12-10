import { ImageSourcePropType, Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Link, useRouter } from "expo-router";     // from tutorial app - CANNOT delete - now used for navigation
import { Image } from "expo-image";     // from tutorial app - probably can delete TODO


// import components
import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";
import CircleButton from "@/components/CircleButton";
import IconButton from "@/components/IconButton";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiList from "@/components/EmojiList";
import EmojiSticker from "@/components/EmojiSticker";
// BEGIN IMPORT COMPONENTS FOR BEATLE -- STARTED 120825 AM
import PausePlayButton from '@/components/PausePlayButton';
import Counters from '@/components/Counters';
//import { Modal } from '../components/Modal.tsx';
import SoundModal, { switchSound } from '@/components/SoundSelection';
import SoundButton from '@/components/SoundButton';
import MetronomeWriting from '@/components/MetronomeWriting';

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


  const router = useRouter();     // added to allow navigation using this version of the Expo Router

  // BEGIN HOOKS SPECIFIC TO BEATLE -- STARTED 120825 AM
  const [pausePlayIcon, setPausePlayIcon] = useState<keyof typeof AntDesign.glyphMap>('caret-right');       // component expects typed prop; 'caret-right' is a valid AntDesign icon
  const [BPM, setBPM] = useState(60); // beats per minute
  const [beat, setBeat] = useState(4);  // beats per measure

  const [buttonStates, setButtonStates] = useState(
    Array.from({ length: beat }, () => 0),   // Set the default state to display numbers
  )


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

  /* handle the popup screen for changing the technical writing */
  const [isMetronomeWritingVisible, setIsMetronomeWritingVisible] = useState(false);
  const handleMetronomeWriting = () => {
    setIsMetronomeWritingVisible(() => !isMetronomeWritingVisible);
  }

  /* handle the popup screen for changing the sound */
  const [isSoundModalVisible, setIsSoundModalVisible] = useState(false);
  const handleSoundModal = () => {
    setIsSoundModalVisible(() => !isSoundModalVisible);
  };

  return (

    // get ready to REVAMP THE UI BOIZZZZ
    // NOTHING WILL BE ABLE TO DO ANYTHING EXCEPT LOOK NICE SO FAR, YAY
    <KeyboardAvoidingView
      enabled
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled
      >
        <View style={stylesMain.container}>

          <View style={[stylesMain.header, { flexDirection: 'row', paddingTop: 30 }]}>
            <View style={[stylesMain.subView, { flex: 1 }]} />
            <View style={[stylesMain.header, { flex: 3, height: '100%' }]}>
              <Text style={stylesMain.title}>Beatle</Text>
            </View>
            <View style={[stylesMain.subView, { flex: 1 }]}>
              <TouchableOpacity
                style={[stylesMain.backButton, { backgroundColor: COLORS.buttonBackground, width: 50 }]}
                onPress={handleMetronomeWriting}
              >
                <AntDesign name="question" size={24} color={COLORS.offWhite} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[stylesMain.body, {}]}>
            <View style={{ flex: 1.5, justifyContent: 'center' }}>
              <PausePlayButton onPress={togglePausePlay} pausePlayIcon={pausePlayIcon} width={300} />
            </View>

            <View style={{ flex: 6, justifyContent: 'space-between' }}>
              <Counters
                width={300}
                beat={beat} setBeat={setBeat}
                BPM={BPM} setBPM={setBPM}
                buttonStates={buttonStates} setButtonStates={setButtonStates}
              />

              <SoundButton onPress={() => alert('Do something when button is pressed')} w={300} selectedSound='Default' />
            </View>
          </View>

          <View style={[stylesMain.footer, {}]}>
            <TouchableOpacity
              style={[stylesMain.flatButton, { alignSelf: 'center', marginBottom: 10 }]}
              onPress={() => {
                //if (isPlaying) {
                if (pausePlayIcon === 'pause') {    // if "playing" (TODO later)
                  togglePausePlay();
                }
                // navigate to trackbuilder using Expo Router
                router.push("/tabs/Trackbuilder");
              }}
            >
              <Text style={[stylesMain.text, { color: COLORS.background }]}>Trackbuilder </Text>
            </TouchableOpacity>
          </View>

        </View>

        <Modal
          visible={isMetronomeWritingVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsMetronomeWritingVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: COLORS.buttonBackground }}>
            <MetronomeWriting
              isModalVisible={isMetronomeWritingVisible}
              setIsModalVisible={setIsMetronomeWritingVisible}
            />
          </View>
        </Modal>

      </ScrollView>

    </KeyboardAvoidingView>

    /*<GestureHandlerRootView style={styles.container}>
    {/*<View style={styles.container}>}
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
          <SoundButton
            onPress={togglePausePlay}
            w={300}
            selectedSound='Drum'
          />
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <View style={styles.footerContainer}>
            <PausePlayButton
              onPress={togglePausePlay}
              pausePlayIcon={pausePlayIcon}
              width={300}
            />
          </View>
        </View>
      )}
      {/* Replace text with PausePlayButton component wrapped in a View 120825 AM }
      {/*
      <View>
        <Text style={styles.text}>Home screen</Text>
        <Link href="/tabs/about" style={styles.button}>Go to About screen</Link>
      </View>}
      
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        {/* Emoji list component will go here }
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    {/*</View>}
    </GestureHandlerRootView>*/
  );
}

/*const styles = StyleSheet.create({
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
});*/