import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Animatable from 'react-native-animatable';

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [type, setType] = useState(BarCodeScanner.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannedData({ type, data });

    const supported = await Linking.canOpenURL(data);

    if (supported) {
      await Linking.openURL(data);
    } else {
      Alert.alert("No app can handle this URL.");
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScannedData(null);
  };

  const handleScanButtonPress = () => {
    setType(type === BarCodeScanner.Constants.Type.back ? BarCodeScanner.Constants.Type.front : BarCodeScanner.Constants.Type.back);
    setScanned(false);
    setScannedData(null);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeIn" style={styles.cameraContainer}>
        {!scanned && (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
            type={type}
          />
        )}
        {scanned && (
          <Animatable.View animation="slideInUp" style={styles.overlay}>
            <Text style={styles.overlayText}>{`Scanned: ${scannedData?.type} - ${scannedData?.data}`}</Text>
            <TouchableOpacity style={styles.button} onPress={handleScanAgain}>
              <Text style={styles.buttonText}>Scan Again</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </Animatable.View>

      {!scanned && (
        <TouchableOpacity style={styles.scanButton} onPress={handleScanButtonPress}>
          <Text style={styles.scanButtonText}>Toggle Camera</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
