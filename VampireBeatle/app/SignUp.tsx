// partially copied from LogIn.js 121225 AM
// please note that the back-end is non-functional so that part wasn't copied over

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

import { AntDesign } from '@expo/vector-icons';

/* Import style code */
// eslint-disable-next-line import/named
import { stylesMain } from '@/styles/stylesMain';
// eslint-disable-next-line import/named, no-unused-vars
import { COLORS } from '@/styles/colors';

// eslint-disable-next-line no-unused-vars
import LogInScreen from '@/app/LogIn';

function SignUpScreen() {
    // added 121225 AM
    const router = useRouter();

    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    // const [email, setEmail] = useState('');

    // eslint-disable-next-line no-unused-vars
    const [isLoading, setLoading] = useState(true);
    //const [data, setData] = useState([]);

    // more code here once back-end is set up TODO

    


    const handleSignUp = async () => {
        if (newUsername && newPassword && confirmNewPassword) {
            if (newPassword.length >= 6) {
                if (newPassword === confirmNewPassword) {
                    // other code in here
                    alert('Get rekt, loser');
                    router.push('/+not-found');
                } else {
                    // invalid password, show an error message
                    alert('Your passwords do not match. Please try again.');
                    return;
                }
            } else {
                // password too short
                alert('Password must be at least 6 characters long.');
                return;
            }
        } else {
            // did not enter username and password, show an error message
            alert('You must enter your username and password.');
            return;
        }
    };


    return (
        <View style={stylesMain.container}>

            <View style={[stylesMain.header, { flexDirection: 'row', paddingTop: 30 }]}>
                <View style={[stylesMain.subView, { flex: 1 }]} />
                <View style={[stylesMain.header, { flex: 3, height: '100%' }]}>
                    <Text style={stylesMain.title}>Sign Up</Text>
                </View>
                <View style={[stylesMain.subView, { flex: 1 }]} />
            </View>

            <View style={[stylesMain.body, {}]}>
                <View style={{ flex: 1.5, justifyContent: 'center' }} />

                <View style={{ flex: 6 }}>
                    <View style={[stylesMain.subView, {}]}>
                        <Text style={stylesMain.text}>Username: </Text>
                        <TextInput
                            onChangeText={(text) => setNewUsername(text)}
                            value={newUsername}
                            defaultValue="new-username"
                            // placeholder="new-username"
                            // placeholderTextColor='#aaa'
                            cursorColor={COLORS.orange}
                            style={{
                                width: 200,
                                backgroundColor: COLORS.background,
                                borderBottomWidth: 2,
                                borderBottomColor: COLORS.offWhite,
                                color: COLORS.orange,
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        />

                        {/* formatting copied from LogIn.js [new-password] */}

                        <Text style={stylesMain.text}>Password: </Text>
                        <TextInput
                            onChangeText={(text) => setNewPassword(text)}
                            value={newPassword}
                            defaultValue="NULL"
                            // placeholder=""
                            // placeholderTextColor='#aaa'
                            secureTextEntry
                            cursorColor={COLORS.orange}
                            style={{
                                width: 200,
                                backgroundColor: COLORS.background,
                                borderBottomWidth: 2,
                                borderBottomColor: COLORS.offWhite,
                                color: COLORS.orange,
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        />

                        <Text style={stylesMain.text}>Confirm Password: </Text>
                        <TextInput
                            onChangeText={(text) => setConfirmNewPassword(text)}
                            value={confirmNewPassword}
                            defaultValue=""
                            // placeholder=""
                            // placeholderTextColor='#aaa'
                            secureTextEntry
                            cursorColor={COLORS.orange}
                            style={{
                                width: 200,
                                backgroundColor: COLORS.background,
                                borderBottomWidth: 2,
                                borderBottomColor: COLORS.offWhite,
                                color: COLORS.orange,
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        />

                        <View style={{ paddingTop: 10, rowGap: 5 }}>
                        <TouchableOpacity
                            style={[stylesMain.flatButton, { alignSelf: 'center', marginBottom: 10 }]}
                            onPress={handleSignUp}
                        >
                            <Text style={[stylesMain.text, { color: COLORS.background }]}>
                                Create an Account
                            </Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default SignUpScreen;