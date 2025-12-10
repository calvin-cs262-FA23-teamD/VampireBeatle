import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useCallback, useEffect } from 'react';

/* Import component files */
import { AntDesign } from '@expo/vector-icons';

/* Import style code -- .. replaced with @ */
import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';

// this one will be a bit harder.
// attempt to type properties for generateButtons 120925 AM
type AccentButtonProps = {
    numButtons: number;
    buttonStates: [number];
    //setButtonStates: (value: number) => void;
    setButtonStates: React.Dispatch<React.SetStateAction<number[]>>;
    buttonSize: number;
}

/**
 * generateButtons from the original AccentButtons.js (old file) was a "plain function" or helper function. In JS, hooks can be used within a plain function.
 * In TS, the "Rule of Hooks" is enforced. TS does not support using hooks within plain functions.
 * TS supports using hooks within a custom hook - which is what is below. Custom hooks' names begin with 'use'.
 * Change last made 121025 AM
 */
function useGenerateButtons({ numButtons, buttonStates, setButtonStates, buttonSize, }: AccentButtonProps): React.JSX.Element[] {
    // below was already commented out - leave it
    // const [buttonStates, setButtonStates] = useState(
    //   Array.from({ length: numButtons }, () => 0), // Set the default state to display numbers
    // );

    // toggleButtonState uses setButtonStates and useCallback hook, same as original, only change is typing of index 121025 AM
    const toggleButtonState = useCallback((index: number) => {
        setButtonStates((prevStates) => {
            const newStates = [...prevStates];
            newStates[index] = (newStates[index] + 1) % 3; // Cycle through 0, 1, 2
            return newStates;
        });
    }, []); // Memoize the function

    // update buttonStates whenever numButtons changes (no change)
    // Watch for changes in numButtons and update buttonStates (no change)
    useEffect(() => {
        setButtonStates(Array(numButtons).fill(0).map((_, index) => (index === 0 ? 1 : 0)));
    }, [numButtons]);

    // must use React. prefix because global JSX namespace is not available in React 17+ 121025 AM
    const buttons: React.JSX.Element[] = [];         // should be array of Views, not numbers
    const maxButtonsPerRow: number = 6;
    const buttonSpacing: number = 15;

    const rows: number = Math.ceil(numButtons / maxButtonsPerRow);
    const buttonsPerRow: number = Math.ceil(numButtons / rows);

    for (let i: number = 0; i < rows; i++) {
        const rowButtons: React.JSX.Element[] = [];         // array of TouchableOpacity objects

        for (let j: number = 0; j < buttonsPerRow; j++) {
            const buttonNumber: number = i * buttonsPerRow + j + 1;
            const buttonIndex: number = i * buttonsPerRow + j;

            if (buttonNumber <= numButtons) {
                // type ButtonContent; can be <Text>, <AntDesign>, or null - change made 121025 AM
                let buttonContent: React.JSX.Element | null;
                //let buttonContent;

                switch (buttonStates[buttonIndex]) {
                    case 0:
                        buttonContent = (
                        <Text style={[stylesMain.text, { color: COLORS.background }]}>
                            {buttonNumber}
                        </Text>
                        );
                        break;
                    case 1:
                        buttonContent = (
                        <AntDesign name="up" size={24} color={COLORS.background} />
                        );
                        break;
                    case 2:

                        buttonContent = null;
                        break;
                    default:
                        buttonContent = (
                        <Text style={[stylesMain.text, { color: COLORS.background }]}>
                            {buttonNumber}
                        </Text>
                        );
                }

                rowButtons.push(
                    <TouchableOpacity
                        key={buttonNumber}
                        style={[
                        j > 0 && { marginLeft: buttonSpacing },
                        {
                            width: buttonSize,
                            height: buttonSize,
                            borderRadius: 20,
                            backgroundColor: COLORS.orange,
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    ]}
                    onPress={() => toggleButtonState(buttonIndex)}
                >
                    {buttonContent}
                </TouchableOpacity>,
                );
            }
        }

        buttons.push(
        // eslint-disable-next-line object-curly-newline
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
            {rowButtons}
        </View>,
        );

    }
    return buttons;
}


// Change was made to this default function to call the custom hook and to use the same props/parameters as useGenerateButtons. 121025 AM
// eslint-disable-next-line object-curly-newline
export default function AccentButtons({ numButtons, buttonStates, setButtonStates, buttonSize }: AccentButtonProps): React.JSX.Element {
    // call custom hook
    const buttons = useGenerateButtons({ numButtons, buttonStates, setButtonStates, buttonSize });
  
    // return view after calling custom hook
    return <View style={[{ alignItems: 'center' }]}>{buttons}</View>;
}