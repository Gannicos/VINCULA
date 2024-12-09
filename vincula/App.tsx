// App.tsx

import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import ListDocentes from './components/ListDocentes';
import AlterDocentes from './components/AlterDocentes';

const App = () => {
  // Estado que controla qual componente será exibido
  const [showList, setShowList] = useState(true);

  const toggleComponent = () => {
    setShowList((prevShowList) => !prevShowList);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Botão para alternar entre ListDocentes e AlterDocentes */}
        <Button
          title={showList ? "Ir para Alterar Docentes" : "Ir para Listar Docentes"}
          onPress={toggleComponent}
          color="#0D92F4"
        />
        
        {/* Exibir o componente com base no estado */}
        {showList ? <ListDocentes /> : <AlterDocentes />}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
