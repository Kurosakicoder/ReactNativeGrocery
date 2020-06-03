import React, { useState } from 'react';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, Text, View, TextInput, Linking, ScrollView, Image, TouchableHighlight, Modal } from 'react-native';

function App() {
  const baseUrl = 'https://api.spoonacular.com/food/products/'
  const apiKey = ''

  const [state, setState] = useState({
    s: '',
    results: [],
    selected: {}
  })

  const search = () => {
    axios(baseUrl + "search?query=" + state.s + "&apiKey=" + apiKey).then(({ data }) => {
      let results = data.products
      console.log(results)
      setState(prevState => {
        return { ...prevState, results: results }

      })
    })
  }

  const openPopup = (id) => {
    axios(baseUrl + id + "?apiKey=" + apiKey).then(({ data }) => {
      let result = data
      setState(prevState => {
        return { ...prevState, selected: result }
      })
    })
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Grocery Products</Text>
        <TextInput
          placeholder="Search Grocery"
          placeholderTextColor="black"
          style={styles.searchbox}
          onChangeText={text => setState(prevState => {
            return { ...prevState, s: text }
          })}
          onSubmitEditing={search}
          value={state.s}
        />

        <ScrollView style={styles.results}>

          {state.results.map(result => (
            <TouchableHighlight key={result.id} onPress={() => openPopup(result.id)}>
              <View key={result.id} style={styles.result}>
                <Image
                  source={{ uri: result.image }}
                  style={{
                    width: '100%',
                    height: 400
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.heading}>
                  {result.title}
                </Text>
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={false}
          visible={(typeof state.selected.title != "undefined") ? true : false}
        >
          <ScrollView>
            <View style={styles.popup}>
              <Text style={styles.poptitle}>
                {state.selected.title}
              </Text>
              <Text>Rating: {state.selected.spoonacular_score}</Text>
              <Text>Price: Rs. {state.selected.price}</Text>
              <Text>Serving size: {state.selected.serving_size || 'null'}</Text>
              <Text>Ingredient Count: {state.selected.ingredientCount}</Text>
              <Text style={{ paddingBottom: 20 }}>Likes: {state.selected.likes}</Text>
              <Text style={{ fontWeight: '500', fontSize: 20 }}>Description:</Text>
              <Text style={{ paddingBottom: 20 }}>{state.selected.description || 'null'}</Text>
              <Text style={{ fontWeight: '500', fontSize: 20 }}>Ingredient List:</Text>
              <Text>{state.selected.ingredientList}</Text>
            </View>
            <TouchableHighlight
              onPress={() => setState(prevState => {
                return { ...prevState, selected: {} }
              })}
            >
              <Text style={styles.closeBtn}>RETURN</Text>
            </TouchableHighlight>
          </ScrollView>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(34,51,67, 0.1)',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 70,
    paddingHorizontal: 20
  },
  title: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 32,
    fontWeight: '700',
    textAlign: "center",
    marginBottom: 20
  },
  searchbox: {
    fontSize: 20,
    fontWeight: '300',
    padding: 20,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20
  },
  results: {
    flex: 1
  },
  result: {
    flex: 1,
    width: '100%',
    marginBottom: 20
  },
  heading: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Lucida Sans',
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.8)'
  },
  popup: {
    padding: 20,
    fontFamily: 'Lucida Sans',
  },
  poptitle: {
    fontSize: 24,
    fontWeight: '500',

    marginBottom: 5
  },
  closeBtn: {
    padding: 20,
    fontSize: 20,
    fontWeight: '700',
    backgroundColor: '#2484C4',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Lucida Sans'
  }
});

export default App;
