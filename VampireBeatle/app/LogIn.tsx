// partially copied from LogIn.js 121225 AM
// please note that the back-end is non-functional so that part wasn't copied over

// attempt to use AuthContext begins here 011326 AM
import { useAuth } from '@/app/AuthContext';

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
} from 'react-native';
// added 121225 AM
import { useRouter } from 'expo-router';
// added 121925 AM
import { API_URL } from '@/services/api';

import { AntDesign } from '@expo/vector-icons';

/* Import style code */
import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';
import TrackbuilderScreen from './tabs/Trackbuilder';

// define a User type that matches what the backend returns 121925 AM
type User = {
    id: number;
    username: string;
    // backend should not return passwords but I'm doing it anyway for now
    password: string;
};

// define a CreateUserPayload type that matches what the backend expects 121925 AM
type CreateUserPayload = {
    username: string;
    password: string;
};

function LogInScreen() {
    // attempt to use AuthContext begins here 011326 AM
    // include setUsername here
    const { setLoggedInFlag, setUsername: setAuthUsername } = useAuth();


    // added 121225 AM
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // other code will go here TODO
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<User[]>([]);

    const getUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/allUsers`);
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    let userID: number = 0;

    // eslint-disable-next-line no-unused-vars
    const handleLogin = async () => {
        // Add login logic here (for now just an alert) TODO
        // Check username and password, navigate to the next screen on success, show an error on failure
       
        alert('The log in button was pressed');
        console.log('Data: ', data);
        for (let i = 0; i < data.length; i++) {
            if (username === data[i].username && password === data[i].password) {
                userID = data[i].id;
                console.log('User: ', userID);
                //navigation.navigate('Trackbuilder', { id: userID });
                router.push('/tabs/Trackbuilder');
                // set Trackbuilder loggedInFlag to true - added 011326 AM
                setLoggedInFlag(true);
                // set Trackbuilder username to the logged in user - added 011326 AM
                setAuthUsername(username);
                return;
            }
        }
        // add back alert (A)
        alert('Invalid username-password combination');
        console.log('user not found');
        return;
    };

    // always fetch users on load (was here before; add back) 121925 AM
    useEffect(() => {
        getUsers();
    }, []);

    // navigate to signup screen (new) 121225 AM
    const handleSignUp = () => {
        router.push('/SignUp');
    };

    return (
        <View style={stylesMain.container}>

            <View style={[stylesMain.header, { flexDirection: 'row', paddingTop: 30 }]}>
                <View style={[stylesMain.subView, { flex: 1 }]} />
                <View style={[stylesMain.header, { flex: 3, height: '100%' }]}>
                    <Text style={stylesMain.title}>Log In</Text>
                </View>
                <View style={[stylesMain.subView, { flex: 1 }]} />
            </View>

            <View style={[stylesMain.body, { alignContent: 'flex-start', justifyContent: 'flex-start' }]}>
                <View style={{ flex: 1.5, justifyContent: 'center' }} />

                <View style={{ flex: 6 }}>
                    <View style={[stylesMain.subView, {}]}>
                        <Text style={stylesMain.text}>Username: </Text>
                        <TextInput
                            onChangeText={(text) => setUsername(text)}
                            value={username}
                            defaultValue="username"
                            // placeholder="username"
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

                        <Text style={stylesMain.text}>Password: </Text>
                        <TextInput
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            defaultValue="password"
                            // placeholder="password"
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
                                style={[
                                    stylesMain.flatButton,
                                    {
                                        width: 300,
                                        alignSelf: 'center',
                                        marginBottom: 10,
                                        backgroundColor: COLORS.orange,
                                    }
                                ]}
                                onPress={handleLogin}
                            >
                                <Text style={[stylesMain.text, { color: COLORS.background }]}>Log In</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    stylesMain.flatButton,
                                    {
                                        width: 300,
                                        alignSelf: 'center',
                                        marginBottom: 10,
                                        backgroundColor: COLORS.orange,
                                    }
                                ]}
                                onPress={handleSignUp}
                            >
                                <Text style={[stylesMain.text, { color: COLORS.background }]}>Create an Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <View style={[stylesMain.footer, {}]}>
                <TouchableOpacity
                    style={[
                        stylesMain.backButton,
                        {
                            backgroundColor: COLORS.buttonBackground,
                            width: 50
                        }
                    ]}
                    onPress={() => router.push('/tabs/Trackbuilder')}
                >
                    <AntDesign name="arrow-left" size={24} color={COLORS.offWhite} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default LogInScreen;