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

/* Import design files */
//import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { Modal } from '@/components/Modal';

/* Import component files */
import PausePlayButton from '@/components/PausePlayButton';
//import AddMeasure from '@/components/AddMeasure';
import SoundModal, { SoundName, switchSound } from '@/components/SoundSelection';
import SoundButton from '@/components/SoundButton';
//import SavedTracks from '@/components/SavedTracks';

/* Import style files */
import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';
import TrackbuilderWriting from '@/components/TrackbuilderWriting';

/* hard coded click track */
// define/type measureObject
type measureObject = {
    clickTrackID: number;
    measurenum?: number;
    tempo: number;
    timesig: number;
    sound: SoundName | 'notused';
}

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



   /* The following code implements playing of the clicktrack
  *
  * */
  /** These control whether the clictrack is playing */
  const [isPlaying, setIsPlaying] = useState(false);
  const [pausePlayIcon, setPausePlayIcon] = useState<keyof typeof AntDesign.glyphMap>('caret-right');

  /** these determine what sound to play */
  const [selectedSound, setSelectedSound] = useState<SoundName>('Default'); // Initialize selected state with default sound





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
    /*if (isAddModalVisible) {
      //addMeasure();
      // TODO later: get this working
    }*/
    //setIsAddModalVisible(() => !isAddModalVisible);
    alert('Nothing to see here so far');
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
    setIsTrackbuilderWritingVisible(() => ! isTrackbuilderWritingVisible);
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
  
  /** the folling section of code handles the clicktrack content,
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
  // MORE CODE WILL GO HERE TODO
  const deleteMeasure = () => {
    /*if (selectedMeasure != null) {
      measures.splice(selectedMeasure - 1, 1);
      // Update the 'number' property of the remaining measures
      for (let i: number = 0; i < measures.length; i++) {
        measures[i].measurenum = i + 1;
      }
      flatListRef.current.forceUpdate();
    }*/
    // currently does nothing
    alert('You clicked the delete button, which does nothing');
  };

  /** This function hangles whether the track should start or stop playing.
   * @param isPlaying tells if the function is currently playing'
   * @param PausePlayIcon the image displayed on the pause play button
   */
  const togglePausePlay = () => {
    setIsPlaying((isPlaying) => !isPlaying);
    setPausePlayIcon((pausePlayIcon) => (pausePlayIcon === 'caret-right' ? 'pause' : 'caret-right'));
    // TODO more code later
    //setCount(-1);
    //drift = 0;
  };

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
                <Text style={[stylesMain.text, { color: COLORS.orange }]}>Log In</Text>
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

              {/* Display of TrackList -- does not work come back later}
              <View style={{ maxHeight: 250 }}>
                {/* warning may be caused by use of FlatList within ScrollView,
                potential solution to use SectionList instead }
                <FlatList
                  ref={flatListRef}
                  data={measures}
                  renderItem={renderMeasure}}

                  extraData={selectedMeasure}
                  vertical
                  showsVerticalScrollIndicator={false}
                />
              </View>*/}

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
                <SoundButton onPress={handleSoundModal} w={300} selectedSound={selectedSound} />
                {/* Navigate to metronome here once I fix the other things */}
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
            </Modal.Body>
          </Modal.Container>
        </Modal>

        {/* SoundModal */}
        <Modal isVisible={isSoundModalVisible}>
          <Modal.Container>
            <Modal.Body>
              <SoundModal
                selectedSound={selectedSound}
                setSelectedSound={setSelectedSound}
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
              {/* SavedTracks component will go here */}
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