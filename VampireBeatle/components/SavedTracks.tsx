/* Import react components */
import * as React from 'react';
import {
  Text, View, TouchableOpacity, FlatList, ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';

import { AntDesign } from '@expo/vector-icons';

/* Import style files */
import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';

// addition of types for SavedTracks props 121725 AM
type SavedTracksProps = {
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    selectedTrackID: number;
    setSelectedTrackID: React.Dispatch<React.SetStateAction<number>>;
    setSelectedTrackName: React.Dispatch<React.SetStateAction<string>>;
    //id: number;
};

// export SavedTracks
// selectedTrackName removed: never used
export default function SavedTracks({
    isModalVisible, setIsModalVisible,
    selectedTrackID, setSelectedTrackID,
    setSelectedTrackName,
    //id,
}: SavedTracksProps) {
    // prepare for conversion to TypeScript 121725 AM
    type Track = {
        id: number;
        name: string;
    };

    // for FlatList's renderItem 121725 AM
    type TrackItem = {
        item: Track;
    };


    const [isLoading, setIsLoading] = useState(true);
    //const [data, setData] = useState([]);               // this line from previous code commented out because TS infers that this array will 'never' have any valid element type
    const [data, setData] = useState<Track[]>([]);          // typed as array of Track objects 121725 AM

    const getTracks = async () => {
        try {
            // code to go in here later to get saved tracks from back-end TODO TODO TODO
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // identify ID and name of selected track
    // CHANGE 2025: modified to accept item of type TrackItem
    const selectTrack = (item: TrackItem): void => {
        if (selectedTrackID !== item.item.id) {
            setSelectedTrackID(item.item.id);
            setSelectedTrackName(item.item.name);
        }
    };

    // type number 121725 AM
    const deleteTrack = async (trackId: number) => {
        try {
            // code to go in here later to delete track from back-end TODO TODO TODO
        } catch (error) {
            //console.error('Error in deleteTrack: ', error.message);
            // Handle the error or update the UI as needed
        }
    };

    useEffect(() => {
        getTracks();
    }, [selectedTrackID]);

    return (
        <View style={{ height: 500, width: '100%' }}>
            <View style={{
                flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20,
            }}
            >
                <Text style={[stylesMain.title, { marginTop: 0 }]}>Saved Tracks</Text>
            </View>

            <View style={{ flex: 6, padding: 0, justifyContent: 'flex-start' }}>
                <View style={{
                    alignItems: 'flex-end', paddingBottom: 10, alignSelf: 'flex-start', width: '100%',
                }}
                >
                    <TouchableOpacity
                        style={[stylesMain.smallButton, { backgroundColor: COLORS.orange }]}
                        onPress={() => { deleteTrack(selectedTrackID); }}
                    >
                        <Text style={[stylesMain.text, { color: COLORS.background}]}>Delete</Text>
                    </TouchableOpacity>

                </View>
                {/* Invalid TS destructuring below - removed 121725
                keyExtractor={({ id: number }) => id.toString()*/}
                <View style={{ maxHeight: 300 }}>
                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={(item) => (
                                <View style={stylesMain.subView}>
                                    <TouchableOpacity
                                        style={[stylesMain.flatButton, {
                                            alignSelf: 'center',
                                            marginBottom: 10,
                                            backgroundColor: item.item.id === selectedTrackID ? '#a23600' : '#ff6900',
                                            width: 300,
                                            height: 50,
                                        }]}
                                        onPress={() => {
                                            // console.log(item.item.id);
                                            selectTrack(item);
                                        }}
                                    >
                                        <Text style={[stylesMain.text, {
                                            color: item.item.id === selectedTrackID ? '#f0f5f5' : '#0a0e0f',
                                        }]}
                                        >
                                            {item.item.name}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
            <View style={{
                flex: 0.5,
                paddingBottom: 12,
                justifyContent: 'flex-end',
                flexDirection: 'row',
                alignItems: 'flex-end',
            }}
            >
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <TouchableOpacity
                        style={[stylesMain.backButton, { backgroundColor: COLORS.orange, width: 50 }]}
                        onPress={() => setIsModalVisible(() => !isModalVisible)}
                    >
                        <AntDesign name="arrow-left" size={24} color={COLORS.background} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        style={[stylesMain.smallButton, { backgroundColor: COLORS.orange }]}
                        onPress={() => setIsModalVisible(() => !isModalVisible)}
                    >
                        <Text style={[stylesMain.text, { color: COLORS.background }]}>Open</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    );
}