// copied from TrackbuilderWriting.js with minimal changes
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/prop-types */
/* Import react components */
import * as React from 'react';
import {
  Text, View, TouchableOpacity,
} from 'react-native';

import { AntDesign } from '@expo/vector-icons';

/* Import style files */
// eslint-disable-next-line import/extensions
import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';

// addition of property typing 121225 AM
type TrackbuilderProps = {
    isModalVisible: boolean;
    setIsModalVisible: (value: boolean) => void;
};

// export TrackbuilderWriting
export default function TrackbuilderWriting({
  isModalVisible, setIsModalVisible,
}: TrackbuilderProps) {
  return (
    <View style={{ height: 700, width: '100%' }}>
      <View style={{
        flex: 2, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 15,
      }}
      >
        <Text style={[stylesMain.title, { marginTop: 0 }]}>Trackbuilder Info</Text>
      </View>
      {/*Add alignItems: 'center' so the justified text is in the center of the modal on both web and android 121125 AM*/}
      <View style={{ flex: 20, padding: 0, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[stylesMain.text, { fontSize: 16 }]}>
          {'Clicktrack:\n'}
          {'    The orange bars are the measures each\n       containing the measure number;\n       beats in the measure; and tempo of the\n       measure.\n'}
          {'    Scroll to navigate through the measures\n       of the track.\n\n'}

          {'Edit Track Name:\n'}
          {'    Tap on the “New Track” text above the\n       measure bars to edit the track name.\n\n'}

          {'Delete Measure:\n'}
          {'    Tap on a measure from the track, then tap\n       “Delete” to delete the measure.\n\n'}

          {'Add Measure:\n'}
          {'    Tap “Add” to open a pop-up for making\n       a new measure.\n\n'}

          {'Save Measure:\n'}
          {'    Tap “Save Track” to save the current\n       track.\n\n'}

          {'Open New Track:\n'}
          {'    Tap “My Tracks” to open a pop-up of\n       saved track.\n'}
          {'    Select a track and tap “Open” to open\n       track.\n\n'}

        </Text>
      </View>

      <View style={{
        flex: 2,
        paddingBottom: 12,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}
      >
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <TouchableOpacity
            style={[stylesMain.backButton, { backgroundColor: COLORS.orange, width: 50 }]}
            onPress={() => setIsModalVisible(false)}
            /*allow modal to be closed by pressing the back button*/
          >
            <AntDesign name="arrow-left" size={24} color={COLORS.background} />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}
