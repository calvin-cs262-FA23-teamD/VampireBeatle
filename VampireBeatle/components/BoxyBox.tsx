import { View, TouchableOpacity, TextInput } from 'react-native';

// import from react
import React, { useState, useEffect } from 'react';

// app icons
import { AntDesign } from '@expo/vector-icons';

import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';

// convert to TypeScript - 121025 AM
type BoxyBoxProps = {
    w: number;
    h: number;
    value: number;
    //setValue: (value: number) => void;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    max: number;
    min: number;
};

// export BoxyBox
export default function BoxyBox({
    w, h, value, setValue, max = 65, min = 55,
}: BoxyBoxProps) {
    // for continuous incrementing/decrementing
    const [incrementing, setIncrementing] = useState(false);
    const [decrementing, setDecrementing] = useState(false);

    // useEffect for continuous press
    useEffect(() => {
        let interval: number = 0;       // interval is a number; must assign before using in clearIntervalIfNecessary

        const handleIncrement = () => {
            if (value < max) {
                setValue((prevValue) => prevValue + 1);
            }
        };

        const handleDecrement = () => {
            if (value > min) {
                setValue((prevValue) => prevValue - 1);
            }
        };

        // Clear the interval when incrementing or decrementing becomes false (new)
        const clearIntervalIfNecessary = () => {
            if (!incrementing && !decrementing) {
                clearInterval(interval);
            }
        };

        if (incrementing) {
            // interval = setInterval(handleIncrement, 100);
            // new way to handle, calls clearInterval after every inc/dec (new)
            interval = setInterval(() => {
                handleIncrement();
                clearIntervalIfNecessary();
            }, 50);
        }

        if (decrementing) {
            // interval = setInterval(handleDecrement, 100);
            // new way to handle, calls clearInterval after every inc/dec (new)
            interval = setInterval(() => {
                handleDecrement();
                clearIntervalIfNecessary();
            }, 50);
        }

        return () => {
            clearInterval(interval);
        };
    }, [value, max, min, incrementing, decrementing]);

    // CHANGE: set direction to 'string' type
    // when you hold down the button, takes the direction (+/-)
    const handlePressIn = (direction: string) => {
        if (direction === 'increase' && value < max) {
            setIncrementing(true);
            setDecrementing(false);
        } else if (direction === 'decrease' && value > min) {
            setDecrementing(true);
            setIncrementing(false);
        }
    };

    // as soon as you let go of button
    const handlePressOut = () => {
        setIncrementing(false);
        setDecrementing(false);
    };

    













}