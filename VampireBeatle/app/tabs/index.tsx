import { ImageSourcePropType, Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity } from "react-native";
// EDIT 121125: Do not import Modal from 'react-native'. Use custom Modal component instead (see imports for Beatle below)
import { Link, useRouter } from "expo-router";     // from tutorial app - CANNOT delete - now used for navigation
import { Image } from "expo-image";     // from tutorial app - probably can delete TODO
import { useState, useEffect } from "react";     // declare a state variable using the useState hook
// useEffect to be activated if param values change

/* Import sound ability */
//import { Audio } from 'expo-av';    // Audio API in expo-av has been deprecated and expo-av will be removed in SDK 55
import { AudioPlayer, useAudioPlayer } from "expo-audio";   // replacement of Audio API from expo-av -- npm installed 121125 AM

// BEGIN IMPORT COMPONENTS FOR BEATLE -- STARTED 120825 AM
import PausePlayButton from '@/components/PausePlayButton';
import Counters from '@/components/Counters';
import { Modal } from '@/components/Modal';
import SoundModal, { SoundName, switchSound } from '@/components/SoundSelection';
import SoundButton from '@/components/SoundButton';
import MetronomeWriting from '@/components/MetronomeWriting';

/* Import style code -- replaced .. with @ */
import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';
import { AntDesign } from "@expo/vector-icons";


// splash screen junk (does not work)
/*import * as SplashScreen from 'expo-splash-screen';
import { ImageSourcePropType } from "react-native/types_generated/index";
SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 5000);*/

// test AudioPlayer stuff outside of default function
const testAudioSource = require('@/assets/sounds/metronome/metronomesound.mp3');

export default function Index() {

  const router = useRouter();     // added to allow navigation using this version of the Expo Router

  // BEGIN HOOKS SPECIFIC TO BEATLE -- STARTED 120825 AM
  const [pausePlayIcon, setPausePlayIcon] = useState<keyof typeof AntDesign.glyphMap>('caret-right');       // component expects typed prop; 'caret-right' is a valid AntDesign icon
  const [BPM, setBPM] = useState(60); // beats per minute
  const [beat, setBeat] = useState(4);  // beats per measure
  
  // begin sound modal hooks -- converted to TS 121125
  const [selectedSoundName, setSelectedSoundName] = useState<SoundName>('Default'); // Initialize selected state with default sound
  
  // the following things were commented out in the original JS file and I'm adding them back for usage with AudioPlayer
  const [normalSoundFile, setNormalSoundFile] = useState<number>(require('@/assets/sounds/metronome/metronomesound.mp3')); // sound file of selected sound -- renamed from selectedSoundFile for clarity
  const [accentSoundFile, setAccentSoundFile] = useState<number>(require('@/assets/sounds/metronome/metronomeaccent.mp3'));
  // add silence
  const [silentSoundFile, setSilentSoundFile] = useState<number>(require('@/assets/sounds/silent/silence.mp3'));
  
  //const [actualSoundFileToPlay, setActualSoundFileToPlay] = useState<number>(normalSoundFile); // current loaded sound -- replace sound and setSound 121125 AM
  const [actualNormalFileToPlay, setActualNormalFileToPlay] = useState<number>(normalSoundFile);
  const [actualAccentFileToPlay, setActualAccentFileToPlay] = useState<number>(accentSoundFile);

  const [measure, setMeasure] = useState(-1); // current measure
  const [isPlaying, setIsPlaying] = useState(false);

  // NOTE: player is already a hook and will update whenever actualSoundFileToPlay changes -- added 121125 AM
  //const player = useAudioPlayer(actualSoundFileToPlay);   // TEST AudioPlayer
  const normalPlayer = useAudioPlayer(actualNormalFileToPlay);
  const accentPlayer = useAudioPlayer(actualAccentFileToPlay);
  const silentPlayer = useAudioPlayer(silentSoundFile);


  const [buttonStates, setButtonStates] = useState(
    Array.from({ length: beat }, () => 0),   // Set the default state to display numbers
  )

  /* variables to make timer work */
  // converted to TypeScript 121125 AM
  let expected: number = 0;     // define before using
  let drift: number = 0;
  let actual: number = 0;       // define before using
  const interval: number = (60 / BPM) * 1000;

  let accentIndicator: number;      // What type is this - passed to a particular index of buttonStates[]

  // BEGIN FUNCTIONS SPECIFIC TO BEATLE -- STARTED 120825 AM
  const togglePausePlay = () => {
    setIsPlaying((isPlaying) => !isPlaying);

    setPausePlayIcon((PausePlayIcon) => (PausePlayIcon === 'caret-right' ? 'pause' : 'caret-right'));
    
    // TEST play something
    //player.seekTo(0);
    //player.play();

    setMeasure(-1);
    drift = 0;
  }

  /* async playSound will go here. Possible rename */
  /* Plays sound. The function is async meaning that playing an audio file is asynchronouse. */
  /**
   * CHANGES: use switch statement instead of if-else (selectedSoundFile was not correct) to switch file(if needed) and play beat,
   * rename beatSound to accentIndicator (0, 1, or 2), and use new expo-audio AudioPlayer instead of prev expo-av Audio API -- playAsync is not
   * a function on type AudioPlayer. AudioPlayer is an instance that takes the file (number) itself, circumventing the need for both variable "soundFile" and "sound"
   * Also renamed variables to improve clarity. Too many similar names and/or misleading names before.
   * Done 121225 AM
   */
  async function playSound() {
    /* Accent the down beat */
    accentIndicator = buttonStates[measure % beat];
    // set the actualSoundFileToPlay according to the accentIndicator
    switch (accentIndicator) {
      case 1:
        //setActualSoundFileToPlay(accentSoundFile);
        setActualAccentFileToPlay(accentSoundFile);
        accentPlayer.seekTo(0);
        accentPlayer.play();
        break;
      case 2:
        //setActualSoundFileToPlay(silentSoundFile);
        silentPlayer.seekTo(0);
        silentPlayer.play();
        break;
      default:
        //setActualSoundFileToPlay(normalSoundFile);
        setActualNormalFileToPlay(normalSoundFile);
        normalPlayer.seekTo(0);
        normalPlayer.play();
    }

    //const { sound } = await Audio.Sound.createAsync(soundFile);
    //setSound(sound);
    //await sound.playAsync();
    
    //player.seekTo(0);
    //player.play();

    /* increment measure and calculate drift */
    setMeasure((measure) => (measure + 1));
    actual = Date.now();
    drift = (actual - expected);

    // Temporarally commented out to make eslint happy
    // console.log(measure);
    // console.log('drift ', drift);
  }

  /* start metronome by incrementing measure */
  useEffect(() => {
    // Temporaraly commented out to make eslint happy
    // console.log(isPlaying);

    if (isPlaying) {
      setMeasure((measure) => (measure + 1));
    }
  }, [isPlaying]);

  /* call playSound every interval, taking into account the drift */
  useEffect(() => {
    if (isPlaying && measure >= 0) {
      expected = Date.now() + interval - drift;
      setTimeout(playSound, interval - drift);
    }

    //player.seekTo(0);
    //player.play();

  }, [measure]);

  // update sound when user selects a new sound (paired)
  // fix lag in update of accent sound when switching SoundName? 121225 AM
  useEffect(() => {
    setTimeout(() => {
      switchSound(
        selectedSoundName,
        setNormalSoundFile,
        setAccentSoundFile,
        setSilentSoundFile
      )
    }, interval - drift);
    /*switchSound(
      selectedSoundName,
      setNormalSoundFile,
      setAccentSoundFile,
      setSilentSoundFile
    );*/
  }, [selectedSoundName]);

  /* handle the popup screen for changing the technical writing 121025 */
  const [isMetronomeWritingVisible, setIsMetronomeWritingVisible] = useState(false);
  const handleMetronomeWriting = () => {
    setIsMetronomeWritingVisible(() => !isMetronomeWritingVisible);
  }

  /* handle the popup screen for changing the sound 121025 */
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

              <SoundButton onPress={handleSoundModal} w={300} selectedSound={selectedSoundName} />
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

          <Modal isVisible={isSoundModalVisible}>
            <Modal.Container>
              <Modal.Body>
                <SoundModal
                  selectedSound={selectedSoundName}
                  setSelectedSound={setSelectedSoundName}
                  isModalVisible={isSoundModalVisible}
                  setIsModalVisible={setIsSoundModalVisible}
                  handleModal={handleSoundModal}
                />
              </Modal.Body>
            </Modal.Container>
          </Modal>

        </View>

        <Modal isVisible={isMetronomeWritingVisible}>
          <Modal.Container>
            <Modal.Body>
              <MetronomeWriting
                isModalVisible={isMetronomeWritingVisible}
                setIsModalVisible={setIsMetronomeWritingVisible}
              />
            </Modal.Body>
          </Modal.Container>
        </Modal>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}