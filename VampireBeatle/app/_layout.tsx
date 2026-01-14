import { Stack } from "expo-router";
import { AuthProvider } from "./AuthContext";

export default function RootLayout() {
  return (
    // global providers (AuthContext etc) go here
    <AuthProvider>
      <Stack>
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
