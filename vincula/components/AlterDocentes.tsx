import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TextInput, Modal, Alert } from 'react-native';
import { supabase } from '../supabaseClient';

//Definindo o Objeto Docente (mesma tabela do Supabase)
type Docente = {
  ID_Docente: number;
  Nome: string;
  Regime: number;
  Ordem: number;
  updated_at: string;
  is_deleted: boolean;
  created_at: string;
};

//Abrindo Componente
const AlterDocentes = () => {
  //Informações de conexão
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //Informações da tela
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [nome, setNome] = useState<string>('');
  const [regime, setRegime] = useState<string>('');
  const [ordem, setOrdem] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  const [searchText, setSearchText] = useState<string>(''); // Estado para o texto de pesquisa

  //Pegando dados no Supabase
  useEffect(() => {
    fetchDocentes();
  }, []);

  const fetchDocentes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Docentes')//Tabela Docentes
        .select('*')//Todos
        .neq('is_deleted', true)//Que não forem deletados
        .order('ID_Docente', { ascending: true });//Coloque em ordem de ID

      if (error) {
        throw error;//Mostra o erro
      }

      setDocentes(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar docentes:', err.message);
      setError('Não foi possível carregar os docentes.');
    } finally {
      setLoading(false);
    }
  };

  //Adicionando ou Editando os docentes
  const handleAddOrUpdateDocente = async () => {
    if(!nome || !regime || !ordem){
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    //Solicitação no Supabase
    try{
      const regimeInt = parseInt(regime);
      const ordemInt = parseInt(ordem);

      if (isNaN(regimeInt) || isNaN(ordemInt)) {
        Alert.alert('Erro', 'Regime e Ordem devem ser números válidos.');
        return;
      }

      if (isEdit && selectedDocente) {
        // Atualizando um docente existente
        const {error} = await supabase
          .from('Docentes')
          .update({ Nome: nome, Regime: regimeInt, Ordem: ordemInt })
          .eq('ID_Docente', selectedDocente.ID_Docente);

        if(error){
          throw error;
        }

        Alert.alert('Sucesso', 'Docente atualizado com sucesso.');
      }else{
        // Adicionando um novo docente
        const { error } = await supabase
          .from('Docentes')
          .insert([{ Nome: nome, Regime: regimeInt, Ordem: ordemInt, is_deleted: false }]);

        if(error){
          throw error;
        }

        Alert.alert('Sucesso', 'Docente adicionado com sucesso.');
      }

      // Resetar os estados do modal e atualizar a lista de docentes
      setNome('');
      setRegime('');
      setOrdem('');
      setSelectedDocente(null);
      setIsEdit(false);
      setModalVisible(false);
      fetchDocentes();
    } catch (err: any) {
      console.error('Erro ao adicionar/atualizar docente:', err.message);
      Alert.alert('Erro', 'Não foi possível adicionar/atualizar o docente.');
    }
  };

  //Deletando um docente
  const handleDeleteDocente = async (id: number) => {
    try{
      const {error} = await supabase
        .from('Docentes')
        .update({ is_deleted: true })//Somente ativa um boolean
        .eq('ID_Docente', id);

      if(error){
        throw error;
      }

      Alert.alert('Sucesso', 'Docente excluído com sucesso.');
      fetchDocentes();
    } catch (err: any) {
      console.error('Erro ao excluir docente:', err.message);
      Alert.alert('Erro', 'Não foi possível excluir o docente.');
    }
  };

  const handleEditDocente = (docente: Docente) => {
    setSelectedDocente(docente);
    setNome(docente.Nome);
    setRegime(docente.Regime.toString());
    setOrdem(docente.Ordem.toString());
    setIsEdit(true);
    setModalVisible(true);
  };

  const filteredDocentes = docentes.filter(docente =>
    docente.Nome.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando docentes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar Docentes</Text>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar docente..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <Button title="Adicionar Docente" color="#0D92F4" onPress={() => {
        setIsEdit(false);
        setNome('');
        setRegime('');
        setOrdem('');
        setModalVisible(true);
      }} />

      <FlatList
        data={filteredDocentes}
        keyExtractor={(item) => item.ID_Docente.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.Nome}</Text>
            <Text>Regime: {item.Regime} horas</Text>
            <Text>Ordem: {item.Ordem}</Text>
            <View style={styles.actions}>
              <Button title="Editar" color="#FFA500" onPress={() => handleEditDocente(item)} />
              <Button title="Excluir" color="#FF4545" onPress={() => handleDeleteDocente(item.ID_Docente)} />
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{isEdit ? "Editar Docente" : "Adicionar Docente"}</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do Docente"
              value={nome}
              onChangeText={(text) => setNome(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Regime (horas)"
              value={regime}
              onChangeText={(text) => setRegime(text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Ordem"
              value={ordem}
              onChangeText={(text) => setOrdem(text)}
              keyboardType="numeric"
            />

            <Button title={isEdit ? "Salvar Alterações" : "Adicionar"} color="#0D92F4" onPress={handleAddOrUpdateDocente} />
            <Button title="Cancelar" color="#888" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 50,
      backgroundColor: '#f6f8fa',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#24292f',
    },
    input: {
      borderWidth: 1,
      borderColor: '#d0d7de',
      borderRadius: 6,
      padding: 12,
      marginBottom: 20,
      backgroundColor: '#ffffff',
      color: '#24292f',
    },
    item: {
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 2,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#d0d7de',
    },
    nome: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 5,
      color: '#24292f',
    },
    details: {
      fontSize: 14,
      color: '#57606a',
      marginBottom: 5,
    },
    separator: {
      height: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f6f8fa',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f6f8fa',
    },
    errorText: {
      color: '#cf222e',
      fontSize: 18,
      textAlign: 'center',
      fontWeight: '600',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      width: '85%',
      padding: 25,
      backgroundColor: '#ffffff',
      borderRadius: 6,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: '#d0d7de',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 15,
      textAlign: 'center',
      color: '#24292f',
    },
  });
  
  

export default AlterDocentes;
