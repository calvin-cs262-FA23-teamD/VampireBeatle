/* Import react components */
import * as React from 'react';
import {
  // add KeyboardAvoidingView and ScrollView (A)
  StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, FlatList, TouchableOpacity, TextInput,
  ColorValue,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
//import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';

/* Import sound ability */
//import { Audio } from 'expo-av';    // Audio API in expo-av has been deprecated and expo-av will be removed in SDK 55
import { AudioPlayer, useAudioPlayer } from "expo-audio";   // replacement of Audio API from expo-av -- npm installed 121125 AM

/* Import design files */
//import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { Modal } from '@/components/Modal';

/* Import component files */
import PausePlayButton from '@/components/PausePlayButton';
import AddMeasure from '@/components/AddMeasure';
import SoundModal, { SoundName, switchSound } from '@/components/SoundSelection';
import SoundButton from '@/components/SoundButton';
import SavedTracks from '@/components/SavedTracks';

/* Import style files */
import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';
import TrackbuilderWriting from '@/components/TrackbuilderWriting';
import { measure } from 'react-native-reanimated';
import { API_URL } from '@/services/api';

// define/type TrackData
type TrackData = {
  name: string;
  date: string;
};

/* hard coded click track */
// define/type measureObject
type measureObject = {
    clickTrackID: number;
    measurenum: number;
    tempo: number;
    timesig: number;
    sound: SoundName | 'notused';
};

const defaultMeasures: measureObject[] = [
  {
    clickTrackID: 0,
    measurenum: 1,
    tempo: 120,
    timesig: 4,
    sound: 'notused',
  },
  {
    clickTrackID: 0,
    measurenum: 2,
    tempo: 120,
    timesig: 3,
    sound: 'notused',
  },
  {
    clickTrackID: 0,
    measurenum: 3,
    tempo: 120,
    timesig: 4,
    sound: 'notused',
  },
];
let measures = defaultMeasures;


/**  This function returns a button which represents one measure in the click track
* @param measure: number of measure
* @param onPress: The function called when button pressed
* @param MeasureBoxColor: Color of the button, will change based on whether button is selected
* @param textColor: color of text, will change based on whether button is selected
*
* @return the touchable opacity representing the measure
*/

/* New: props for MeasureBox */
type MeasureBoxProps = {
  measure: measureObject;
  onPress: () => void;
  MeasureBoxColor: ColorValue;
  textColor: ColorValue;
};

function MeasureBox({
  measure, onPress, MeasureBoxColor, textColor,
}: MeasureBoxProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[stylesMain.measureBox, { backgroundColor: MeasureBoxColor }]}
    >
      <View style={[{ flexDirection: 'row', flex: 1, width: 150 }]}>
        {/* measure number */}
        <View style={[{
          alignItems: 'stretch', justifyContent: 'space-evenly', paddingHorizontal: 15,
        }]}
        >
          <Text style={[stylesMain.text, { color: textColor, fontSize: 20 }]}>
            {measure.measurenum}
          </Text>
        </View>

        {/* Beats per measure */}
        <View style={[{ alignItems: 'stretch', justifyContent: 'space-evenly' }]}>
          <Text style={[stylesMain.text, { color: textColor, fontSize: 50 }]}>
            {measure.timesig}
          </Text>
        </View>

        {/* Beats per minute */}
        <View style={{
          alignItems: 'stretch', justifyContent: 'space-evenly', paddingHorizontal: 15,
        }}
        >
          <Text style={[stylesMain.text, { color: textColor, fontSize: 20 }]}>
            {measure.tempo} BPM
          </Text>
        </View>

      </View>
    </TouchableOpacity>
  );
}

/** This function builds the main track builder screen.
 * This is where users can create and play customizable click tracks
 */
export default function TrackbuilderScreen() {

  const router = useRouter();     // added to allow navigation using this version of the Expo Router

  
  // TODO: A bunch of code will go in here. Right now I will just focus on the layout then work backwards.



  //* These are hooks meant to help with the implementation of the database
  const [selectedTrackID, setSelectedTrackID] = useState(50000000);
  const [selectedTrackName, setSelectedTrackName] = useState('New Track');


  // NEW UNTESTED CODE TO HANDLE LOGIN STATUS 011326 AM -- to replace triple-purpose id variable
  const [loggedInFlag, setLoggedInFlag] = useState(false);



   /* The following code implements playing of the clicktrack
  *
  * */
  /** These control whether the clictrack is playing */
  const [isPlaying, setIsPlaying] = useState(false);
  const [pausePlayIcon, setPausePlayIcon] = useState<keyof typeof AntDesign.glyphMap>('caret-right');

  /** these determine what sound to play */
  const [selectedSoundName, setSelectedSoundName] = useState<SoundName>('Default'); // Initialize selected state with default sound

  /* The following were copied from index.tsx on 121725 AM */
  // the following things were commented out in the original JS file and I'm adding them back for usage with AudioPlayer
  const [normalSoundFile, setNormalSoundFile] = useState<number>(require('@/assets/sounds/metronome/metronomesound.mp3')); // sound file of selected sound -- renamed from selectedSoundFile for clarity
  const [accentSoundFile, setAccentSoundFile] = useState<number>(require('@/assets/sounds/metronome/metronomeaccent.mp3'));
  // add silence
  const [silentSoundFile, setSilentSoundFile] = useState<number>(require('@/assets/sounds/silent/silence.mp3'));

  const [actualNormalFileToPlay, setActualNormalFileToPlay] = useState<number>(normalSoundFile);
  const [actualAccentFileToPlay, setActualAccentFileToPlay] = useState<number>(accentSoundFile);

  /** This keeps track of what beat the track is on */
  const [count, setCount] = useState(-1); // current beat

  /** These keep track of number of beats and the tempos of each measure */
  const [beatList, setBeatList] = useState<number[]>([]);       // list of all the accent values of each beat
  const [tempoList, setTempoList] = useState<number[]>([]);     // list of tempos of each beat

  // copy AudioPlayers from index.tsx 121725 AM
  const normalPlayer = useAudioPlayer(actualNormalFileToPlay);
  const accentPlayer = useAudioPlayer(actualAccentFileToPlay);
  const silentPlayer = useAudioPlayer(silentSoundFile);


  /**  The following section of code controls the various modals that can
   * appear within the trackbuilder
  *
  */

  /** This handles the AddModal, which is where the user can create a new measure
   * and add it to the click track.
   * In particular, this code sets the modal to be visible or invisible.
   */
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const handleAddModal = () => {
    if (isAddModalVisible) {
      addMeasure();
    }
    setIsAddModalVisible(() => !isAddModalVisible);
    //alert('Nothing to see here so far');
  };

  /** This handles the SoundModal, which is where the user can change the sound
   * of the click track.
   * In particular, this code sets the modal to be visible or invisible.
   */
  const [isSoundModalVisible, setIsSoundModalVisible] = useState(false);
  const handleSoundModal = () => {
    setIsSoundModalVisible(() => !isSoundModalVisible);
  };

  /** This handles the TrackbuilderWriting Modal, which has information about using
   * the app.
   * In particular, this code sets the modal to be visible or invisible.
   */
  const [isTrackbuilderWritingVisible, setIsTrackbuilderWritingVisible] = useState(false);
  const handleTrackbuilderWriting = () => {
    setIsTrackbuilderWritingVisible(() => !isTrackbuilderWritingVisible);
    alert('Later this will show some information about the trackbuilder.');
  };

  /** This handles the SavedTracks Modal, stores and displays a user's saved tracks
   * In particular, this code sets the modal to be visible or invisible.
   * If the user is not logged in, it redirects them to the log in page.
   */
  const [isSavedTrackVisible, setIsSavedTrackVisible] = useState(false);
  const handleSavedTrackModal = () => {
    /* id code has not been implemented TODO
    if (id) {
      setIsSavedTrackVisible(() => !isSavedTrackVisible);
    } else {
      navigation.navigate('LogIn');
    }*/
    alert('You are trying to access the saved tracks');
    router.push('/LogIn');
  };

  /* This handles the user's login. If the user has logged in, it will log them out.
    * In particular, this code sets the modal to be visible or invisible.
    */
  const [loginText,setLoginText] = useState('Log In');
  const handleLogIn = () => {
    // will do something useful later (TODO)
    //alert('This will do something useful later');
    router.push('/LogIn');
  };

  /** This function is supposed to save a track into the database.
   * However, It is currently not implemented */
  const saveTrack = () => {
    if (!loggedInFlag) {
      router.push('/LogIn');
    }
    // TODO add in save track code
    // console.log('save track');
    const newTrackData: TrackData = {
      //userID: id,
      name: selectedTrackName,
      date: '1772-01-01',
    };
    createClickTrack(newTrackData);
    /*if (!id) {
      navigation.navigate('LogIn');
    }
    // TODO add in save track code
    // console.log('save track');
    const newTrackData = {
      userID: id,
      name: selectedTrackName,
      date: '1772-01-01',
    };
    createClickTrack(newTrackData);*/
    alert('This was never implemented!?!?!?!');
  };

  /** this section of code updates the value of selected measure
   * @param item the measure that was selected and should be made the selected measure
   *
   * @return updates value of selectedMeasure
   */
  const [selectedMeasure, setSelectedMeasure] = useState<number | null>(null);
  const selectMeasure = ( item: measureObject ) => {
    if (selectedMeasure === item.measurenum) {
      setSelectedMeasure(null);    // see if this works TODO**
      setNewMeasureNum(measures.length + 1);
    } else {
      setSelectedMeasure(item.measurenum!);     // because measurenum is optional
      setNewMeasureNum(item.measurenum! + 1);   // because measurenum is optional
    }
  };
  
  /** the following section of code handles the clicktrack content,
   * rendering the clicktrack onto the screen,
     * and adding or deleting measures.
    */

  /** This section of Code renders the MeasureBox onto the screen
     * @param item this is which measure is being rendered
     *
     * @return returns the MeasureBox, which is a button containing the measure's information
    */
   // CHANGE: give types to item (see interface), MeasureBoxColor, color
   interface RenderMeasureArgs {
    item: measureObject;
   }

  const renderMeasure = ({ item }: RenderMeasureArgs) => {
    const MeasureBoxColor: ColorValue = item.measurenum === selectedMeasure ? COLORS.darkOrange : COLORS.orange;
    const color = item.measurenum === selectedMeasure ? COLORS.offWhite : COLORS.background;

    return (
      <MeasureBox
        measure={item}
        onPress={() => selectMeasure(item)}
        MeasureBoxColor={MeasureBoxColor}
        textColor={color}
      />
    );
  };

  /** This function handles creating a new measure and adding it into the current clicktrack
   * It relies on the values in the hooks newTempo, and newBeat to create a new measure
   * it then inserts the measure in location newMeasureNum, and corrects the measureNums of all
   * the other measures
   * @param newMeasureNum the new measure number
   * @param newTempo tempo of measure
   * @param newBeat beat of measure
   * @param measures the clicktrack
   *
   * @return modified clicktrack
  */
  const [newMeasureNum, setNewMeasureNum] = useState(measures.length + 1);
  const [newTempo, setNewTempo] = useState(60);
  const [newBeat, setNewBeat] = useState(4);
  const addMeasure = () => {
    if (newTempo !== null && newBeat !== null && newMeasureNum !== null) {
      // console.log(newMeasureNum);
      // console.log((newMeasureNum < 1) ? 1 : newMeasureNum);
      const newMeasureNumCorr: number = (newMeasureNum < 1) ? 1 : newMeasureNum;
      const newMeasure: measureObject = {
        clickTrackID: 0,
        measurenum: newMeasureNumCorr,
        timesig: newBeat,
        tempo: newTempo,
        sound: 'notused',
      };
      measures.splice(newMeasureNumCorr - 1, 0, newMeasure);
      for (let i: number = 0; i < measures.length; i++) {
        measures[i].measurenum = i + 1;
      }
      setNewMeasureNum(measures.length);
    }
  }

  /** This function deletes a selected measure and updates the clicktrack accordingly
   * @param selectedMeasure the measure that will be deleted
   * @param measures the clicktrack
   *
   * @return the updated clicktrack
   */
  const flatListRef = useRef(null);
  const deleteMeasure = () => {
    if (selectedMeasure != null) {
      measures.splice(selectedMeasure - 1, 1);
      // Update the 'number' property of the remaining measures
      for (let i: number = 0; i < measures.length; i++) {
        measures[i].measurenum = i + 1;
      }
      // actually fine, because the "error" just says it might be null. Which it isn't, because this is in the selectedMeasure != null block. AM 121725
      // @ts-ignore
      flatListRef.current.forceUpdate();
    }
    alert('You clicked the delete button');
  };

  /** This function reads the clicktrack and generates a list of the sound and tempo of each beat
   * @param measures the clicktrack
   *
   * @return set the values of newTempoList and newCountList
  */
  function setUpTrack() {
    const newCountList: number[] = [];      // add type for TypeScript conversion
    const newTempoList: number[] = [60];    // add type for TypeScript conversion
    let i: number = 0;
    measures.forEach((measure) => {
      for (i = 0; i < measure.measurenum; i++) {
        if (i === 0) { newCountList.push(1); } else { newCountList.push(0); }
        newTempoList.push(measure.tempo);
      }
    });
    setBeatList(newCountList);
    setTempoList(newTempoList);
  }


  let expected: number = 0;   // initialize
  let actual: number = 0;     // initialize
  let drift: number = 0;

  let accentIndicator: number;

  /** This function hangles whether the track should start or stop playing.
   * @param isPlaying tells if the function is currently playing'
   * @param PausePlayIcon the image displayed on the pause play button
   */
  const togglePausePlay = () => {
    setIsPlaying((isPlaying) => !isPlaying);
    setPausePlayIcon((pausePlayIcon) => (pausePlayIcon === 'caret-right' ? 'pause' : 'caret-right'));
    setCount(-1);
    drift = 0;
  };

    /** this code triggers the clicktrack to start playing  by incrementing count */
  useEffect(() => {
    if (isPlaying) {
      setUpTrack();
      setCount((count) => (count + 1));
    }
  }, [isPlaying]);

  /** This function plays a beat by loading the sound, playing it, and incrementing the count,
   * which triggers the next sound
   * @param expected when we expect the beat to occur
   * @param actual when the beat actually occurs
   * @param drift variation between expected beat and actual beat
   * @param beatlist what beat are they on?
   * @param accentSoundFile sound of accent beat
   * @param selectedSoundFile sound of selected sound
  */
  async function playSound() {
    if (count < beatList.length) {
      // Play sound, accenting the down beat
      accentIndicator = beatList[count];

      // set the actualSoundFileToPlay according to the accentIndicator
      switch (accentIndicator) {
        case 1:
          setActualAccentFileToPlay(accentSoundFile);
          accentPlayer.seekTo(0);
          accentPlayer.play();
          break;
        case 2:
          silentPlayer.seekTo(0);
          silentPlayer.play();
          break;
        default:
          setActualNormalFileToPlay(normalSoundFile);
          normalPlayer.seekTo(0);
          normalPlayer.play();
      }

      // increment to next count and calculate drift
      setCount((count) => (count + 1));
      actual = Date.now();
      drift = (actual - expected);

      // console.log(count);
      // console.log('drift ', drift);
    } else {
      togglePausePlay();
    }
  }

  /** this code calls the next beat to start playing by setting up the expected,
   *  and calling a timeout
   * @param isPlaying is the clicktrack playing
   * @param tempoList list of tempos throughout clicktrack
   * @param expected when the next beat should be
   * @param drift how much the beat is off
  */
 useEffect(() => {
  if (isPlaying && count >= 0) {
    // console.log(count);
    // console.log(tempoList[count]);

    expected = Date.now() + ((60 / tempoList[count]) * 1000) - drift;
    setTimeout(playSound, ((60 / tempoList[count]) * 1000) - drift);
  }

 }, [count]);

  // update sound when user selects a new sound (paired)
  // copied from index.tsx to implement sound switching 121725 AM
  useEffect(() => {
    setTimeout(() => {
      switchSound(
        selectedSoundName,
        setNormalSoundFile,
        setAccentSoundFile,
        setSilentSoundFile
      )
    }, ((60 / tempoList[count]) * 1000) - drift);
  }, [selectedSoundName]);

  const createClickTrack = async (newTrackData: TrackData) => {
    try {
      const response = await fetch(`${API_URL}/makeClickTrack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTrackData),
      });

      const track = await response.json();

      // Handle the response or update the UI as needed
      let i: number;
      for (i = 0; i < measures.length; i++) {
        measures[i].clickTrackID = track.id;
        createMeasure(measures[i]);
      }
    } catch (error) {
      // console.error('Error creating click track:', error);

      // Handle the error or update the UI as needed
    }
  };

  const createMeasure = async (newMeasureData: measureObject) => {
    try {
      const response = await fetch(`${API_URL}/makeMeasure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMeasureData),
      });

      const json = await response.json();

      if (!response.ok) {
        // console.error('Server returned an error:', response.status, response.statusText);
        // Handle the error or update the UI as needed
        return;
      }

      // Handle the response or update the UI as needed
      // console.log('Measure created:', json);
    } catch (error) {
      // console.error('Error creating measure:', error);

      // Handle the error or update the UI as needed
    }
  };

  const getMeasures = async () => {
    try {
      // const response = await fetch(`https://beatleservice.azurewebsites.net/aClickTrack/${0}`);
      const response = await fetch(`${API_URL}/allMeasures`);
      const json = await response.json();

      let trackMeasures: measureObject[] = [];
      trackMeasures = json.filter((item: measureObject) => item.clickTrackID === selectedTrackID);
      //trackMeasures = json.filter((item) => item.clickTrackID === selectedTrackID);
      /*trackMeasures = trackMeasures.sort((a, b) => {
        if (a.measurenum < b.measurenum) {
          return -1;
        } else {
          return 0;
        }
      });*/

      // ******** fix this TODO
      // let intermediate = 0;
      // if (intermediate === 0) {
      //  intermediate++
      // } else{}
      measures = trackMeasures;
      // console.log('measures:', trackMeasures);
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    // console.log('this is the trackID: ', selectedTrackID);
    getMeasures();
  }, [selectedTrackID]);


  return (
    <KeyboardAvoidingView
      // behavior={isIOS ? "padding" : "height"}
      enabled
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled
      >
        <View style={stylesMain.container}>
          {/* Header */}
          <View style={[stylesMain.header, { flexDirection: 'row', paddingTop: 30 }]}>
            <View style={[stylesMain.subView, { flex: 1, alignItems: 'center', justifyContent: 'flex-end' }]}>
              <TouchableOpacity
                style={[stylesMain.smallButton, { backgroundColor: COLORS.background }]}
                onPress={handleLogIn}
              >
                <Text style={[stylesMain.text, { color: COLORS.orange }]}>{loginText}</Text>
              </TouchableOpacity>
            </View>
            {/* Page Title */}
            <View style={[stylesMain.header, { flex: 3, height: '100%' }]}>
              <Text style={stylesMain.title}>Trackbuilder</Text>
            </View>
            {/* Info button */}
            <View style={[stylesMain.subView, { flex: 1 }]}>
              <TouchableOpacity
                style={[stylesMain.backButton,
                  { backgroundColor: COLORS.buttonBackground, width: 50 }
                ]}
                onPress={handleTrackbuilderWriting}
              >
                <AntDesign name="question" size={24} color={COLORS.offWhite} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Main body of code */}
          <View style={[stylesMain.body, {}]}>
            {/* Pause Play Button */}
            <View style={{ flex: 1.5, justifyContent: 'center' }}>
              <PausePlayButton onPress={togglePausePlay} pausePlayIcon={pausePlayIcon} width={300} />
            </View>

            {/* Track Title */}
            <View style={{ flex: 6 }}>
              <View style={{ alignItems: 'center', paddingBottom: 5 }}>
                <TextInput
                  onChangeText={(text) => setSelectedTrackName(text)}
                  defaultValue={selectedTrackName}
                  cursorColor={COLORS.orange}
                  style={{
                    width: 300,
                    backgroundColor: COLORS.background,
                    color: COLORS.offWhite,
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}                    
                />
              </View>

              {/* Display of TrackList -- does not work come back later}*/}
              {/* warning may be caused by use of FlatList within ScrollView,
                potential solution to use SectionList instead }*/}
              <View style={{ maxHeight: 250 }}>
                <FlatList
                  ref={flatListRef}
                  data={measures}
                  renderItem={renderMeasure}
                  extraData={selectedMeasure}
                  vertical
                  showsVerticalScrollIndicator={false}
                />
              </View>

              {/* interaction buttons */}
              <View style={{ flex: 4, marginTop: 10, alignItems: 'center' }}>
                <View style={{ alignItems: 'flex-start', flex: 2, flexDirection: 'row' }}>
                  {/* Delete measure */}
                  <View style={{ flex: 2, alignItems: 'flex-start' }}>
                    <TouchableOpacity style={[stylesMain.smallButton, {}]} onPress={deleteMeasure}>
                      <Text style={[stylesMain.text]}> Delete </Text>
                    </TouchableOpacity>
                  </View>
                  {/* Add Measure */}
                  <View style={{ flex: 2, alignItems: 'flex-end' }}>
                    <TouchableOpacity style={[stylesMain.smallButton, { flexDirection: 'row' }]} onPress={handleAddModal}>
                      <Text style={[stylesMain.text]}> Add </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-start', flex: 2, flexDirection: 'row' }}>
                  {/* My Tracks */}
                  <View style={{ flex: 2, alignItems: 'center' }}>
                    <TouchableOpacity
                      style={[stylesMain.smallButton, {}]}
                      onPress={handleSavedTrackModal}
                    >
                      <Text style={[stylesMain.text, { color: COLORS.offWhite }]}>My Tracks</Text>
                    </TouchableOpacity>
                  </View>
                  {/* Save Track */}
                  <View style={{ flex: 2, alignItems: 'flex-end' }}>
                    <TouchableOpacity style={[stylesMain.smallButton, {}]} onPress={saveTrack}>
                      <Text style={[stylesMain.text, { color: COLORS.offWhite }]}>Save Track</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Sound */}
                <SoundButton onPress={handleSoundModal} w={300} selectedSound={selectedSoundName} />
                {/* Navigate to metronome */}
                <View style={[stylesMain.footer, {}]}>
                  <TouchableOpacity
                    style={[stylesMain.flatButton, { width: 300, alignSelf: 'center', marginBottom: 10 }]}
                    onPress={() => {
                      if (isPlaying) {
                        togglePausePlay();
                      }
                      // navigate code here
                      router.push("/tabs");
                    }}
                  >
                    <Text style={[stylesMain.text, { color: COLORS.background }]}>Metronome </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Add Track Modal */}
        <Modal isVisible={isAddModalVisible}>
          <Modal.Container>
            <Modal.Body>
              {/* AddMeasure component will go here */}
              <AddMeasure
                newMeasureNum={newMeasureNum}
                setNewMeasureNum={setNewMeasureNum}
                newTempo={newTempo}
                setNewTempo={setNewTempo}
                newBeat={newBeat}
                setNewBeat={setNewBeat}
                isModalVisible={isAddModalVisible}
                setIsModalVisible={setIsAddModalVisible}
                handleModal={handleAddModal}
              />
            </Modal.Body>
          </Modal.Container>
        </Modal>

        {/* SoundModal */}
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

        {/* Saved Tracks Modal */}
        <Modal isVisible={isSavedTrackVisible}>
          <Modal.Container>
            <Modal.Body>
              <SavedTracks
                isModalVisible={isSavedTrackVisible}
                setIsModalVisible={setIsSavedTrackVisible}
                selectedTrackID={selectedTrackID}
                setSelectedTrackID={setSelectedTrackID}
                setSelectedTrackName={setSelectedTrackName}
                //id={id}
              />
            </Modal.Body>
          </Modal.Container>
        </Modal>

        {/* Technical Writing Modal */}
        <Modal isVisible={isTrackbuilderWritingVisible}>
          <Modal.Container>
            <Modal.Body>
              <TrackbuilderWriting
                isModalVisible={isTrackbuilderWritingVisible}
                setIsModalVisible={setIsTrackbuilderWritingVisible}
              />
            </Modal.Body>
          </Modal.Container>
        </Modal>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}