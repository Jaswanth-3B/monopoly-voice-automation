import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GameContent from './src/screens/GameContent';
import { THEME_COLORS } from './src/theme/colors';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <GameContent />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
});

export default App;