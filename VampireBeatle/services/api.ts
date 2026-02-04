// services/api.ts
import { Platform } from "react-native";

const LOCAL_IP = '192.168.3.103';

const TEST_EMMA_IP = '192.168.4.138';

const TODAYS_IP = '10.15.20.82';

export const API_URL =
    Platform.OS === 'web'
        ? 'http://localhost:3000'
        : `http://${LOCAL_IP}:3000`;