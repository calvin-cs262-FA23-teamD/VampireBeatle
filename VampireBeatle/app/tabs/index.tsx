import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";

import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";

// ~ does not resolve to root 120525 AM
// NOTE: @ symbol is a custom path alias for importing custom components and other modules instead of relative paths, configured in tsconfig.json
const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" />
        <Button label="Use this photo" />
      </View>
      <View>
        <Text style={styles.text}>Home screen</Text>
        <Link href="/tabs/about" style={styles.button}>Go to About screen</Link>
      </View>
      {/*}
      <Text style={styles.text}>Home screen</Text>
      <Link href="/tabs/about" style={styles.button}>Go to About screen</Link>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#1e90ff',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});