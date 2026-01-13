// this is a new file for VampireBeatle to manage authentication context and sustain it across the app
// untested as of 011326
// heavily based on ChatGPT example code
// AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

// define the type for the loggedInFlag
type AuthContextType = {
    loggedInFlag: boolean;
    setLoggedInFlag: (value: boolean) => void;
    // store username in AuthContext at login time (will be relevant when saving tracks)
    username: string | null;
    setUsername: (username: string | null) => void;
};

// initialize
// creates a Context that components can provide or read
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // "hook" here instead of within Trackbuilder
    const [loggedInFlag, setLoggedInFlag] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(null);      // null by default (not logged in)

    return (
        <AuthContext.Provider value={{ loggedInFlag, setLoggedInFlag, username, setUsername, }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};