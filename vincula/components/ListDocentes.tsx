import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { supabase } from '../supabaseClient';

type Docente = {
  ID_Docente: number;
  Nome: string;
  Regime: number;
  Ordem: number;
  updated_at: string;
  is_deleted: boolean;
  created_at: string;
};

const ListDocentes = () => {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    fetchDocentes();
  }, []);

  const fetchDocentes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Docentes')
        .select('*')
        .neq('is_deleted', true)
        .order('ID_Docente', { ascending: true });

      if (error) {
        throw error;
      }

      setDocentes(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar docentes:', err.message);
      setError('Não foi possível carregar os docentes.');
    } finally {
      setLoading(false);
    }
  };


  const filteredDocentes = docentes.filter(docente =>
    docente.Nome.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
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
      <Text style={styles.title}>Lista de Docentes</Text>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar docente..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <FlatList
        data={filteredDocentes}
        keyExtractor={(item) => item.ID_Docente.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.Nome}</Text>
            <Text>Regime: {item.Regime} horas</Text>
            <Text>Ordem: {item.Ordem}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  
  

export default ListDocentes;
