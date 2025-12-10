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
    setValue: React.Dispatch<React.SetStateAction<number>>;     // set value accepting input as a number... make sure to convert text to number before calling
    max?: number;       // nullable
    min?: number;       // nullable
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
        // try setting interval to the return type of setInterval 121025
        let interval: ReturnType<typeof setInterval> | undefined;

        const handleIncrement = () => {
            if (value < max) {
                setValue((prevValue) => (prevValue + 1));
            }
        };

        const handleDecrement = () => {
            if (value > min) {
                setValue((prevValue) => (prevValue - 1));
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

    // CHANGE: set direction as 'boolean' type here 121025 AM
    // this function will add or subtract 1 to/from the current value
    // normal single tap, keep this
    const changeValue = (direction: boolean) => {
        if (direction === true && value < max) {
            setValue(value + 1);
        } else if (direction === false && value > min) {
            setValue(value - 1);
        }
    };

    /**
     * CHANGES: before, this took one param of newValue - which acted like either a number or a string (string upon being typed in, number for calculations)
     * TypeScript uses strict typing, so I changed the param to userInputRaw (either a string or number, but most likely string)
     * Then wrote code to convert it to a number (parsedInput), convert to integer, and set 'value' (already a number as defined in props) as usual. 121025 AM
     */
    // this function will set the current value to what the user enters
    const updateValue = (userInputRaw: string | number) => {
        /* parse input to determine if it's a string or number. We have to do this because JS is happy
         * to mix string and number types, but TypeScript uses strict typing.
         */
        // if string, convert to number, else keep as is
        const parsedInput = typeof userInputRaw === 'string' ? Number(userInputRaw) : userInputRaw;

        // if input can't be converted to number, do nothing
        if (Number.isNaN(parsedInput)) {
            // invalid
            return;
        }

        // use Math.floor to make it integer
        const floored = Math.floor(parsedInput);

        // max/min are already numbers; no need toString
        if (floored >= max) {
            setValue(max);      // setValue takes an input of a number
        } else if (floored <= min) {
            setValue(min);
        } else {
            setValue(floored);
        }
    };
    
    /*const updateValue = (newValue: string) => {
        if (newValue >= max.toString()) {
            // fixed the bug that allowed numbers like 2006 (A)
            setValue(max.toString());
        } else if (newValue <= min) {
            // there is still a bug that allows numbers too low (A)
            // console.log('error, value too low');
            setValue(min);
        } else {
            setValue(Math.floor(newValue));
        }
    };*/

    return (
        <View style={[stylesMain.boxyBoxes, {

        }]}
        >
            {/* <Text style={[stylesMain.text, { alignSelf: 'center' }]}>Tempo</Text> */}
            <View style={{ width: w, height: h, alignItems: 'center', flexDirection: 'row' }}>

                <View style={stylesMain.plusMinusButtons}>
                    <TouchableOpacity
                        style={[stylesMain.buttonContainer, { width: w / 2.7, height: h }]}
                        // on single tap
                        onPress={() => changeValue(false)}
                        // hold down minus button
                        onPressIn={() => handlePressIn('decrease')}
                        // release minus button
                        onPressOut={handlePressOut}
                    >
                        <AntDesign name="minus" size={24} color={COLORS.orange} />
                    </TouchableOpacity>
                </View>

                <View style={stylesMain.valueText}>
                    {/* BUG!!! if you enter too low a value, it will update correctly,
                    but the text will not display the right value */}
                    {/* NEW CHANGE 2025: backgroundColor is part of style, and I corrected how it's passed to TextInput */}
                    <TextInput
                        onChangeText={(text) => updateValue(text)}
                        value={value.toString()}
                        defaultValue={value.toString()}
                        keyboardType="numeric"
                        cursorColor={COLORS.orange}
                        style={{ 
                            width: w / 3,
                            backgroundColor: COLORS.buttonBackground,
                            color: COLORS.offWhite,
                            fontSize: w / 6,
                            textAlign: "center",
                        }}
                    />
                </View>

                <View style={stylesMain.plusMinusButtons}>
                    <TouchableOpacity
                        style={[stylesMain.buttonContainer, { width: w / 2.7, height: h }]}
                        // on single tap
                        onPress={() => changeValue(true)}
                        // hold down plus button
                        onPressIn={() => handlePressIn('increase')}
                        // release plus button
                        onPressOut={handlePressOut}
                    >
                        <AntDesign name="plus" size={24} color={COLORS.orange} />
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}