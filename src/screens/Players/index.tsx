import React, { useEffect, useState, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert, FlatList, TextInput } from "react-native";

import { AppError } from "@utils/AppError";

import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/HightLight";
import { Input } from "@components/Input";
import { ListEmpty } from "@components/ListEmpty";
import { PlayerCard } from "@components/PlayerCard";
import { Button } from "@components/Button";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroup } from "@storage/player/playersGetByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { Loading } from "@components/Loading";

type RouteParams = {
  group: string
}

export function Players() {


  const [ newPlayerName, setNewPlayerName ] = useState('')
  const [ team, setTeam ] = useState('Time A')
  const [ players, setPlayers ] = useState<PlayerStorageDTO[]>([])
  const [ isLoading, setIsLoading ] = useState(true);

  const route = useRoute()
  const navigation = useNavigation();
  
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null)

  async function handleAddPlayer(){

    if(newPlayerName.trim().length === 0 ){

      return Alert.alert('Novo Player', 'digite o nome do jogador')

    }


    const newPlayer = {

      name: newPlayerName,
      team
    }

    try {

      await playerAddByGroup(newPlayer, group);
      setNewPlayerName('')

      fetchPlayersByTeam()

      
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert('Nova pessoa', error.message)
      } else {
        console.log (error);
        Alert.alert('Nova pessoa', 'Nao foi possivel adcionar')
      }
      
    }

  }

  async function fetchPlayersByTeam() {

    try {

      setIsLoading(true)

      const playersByTeam = await playersGetByGroupAndTeam(group, team);

      newPlayerNameInputRef.current?.blur();

      setPlayers(playersByTeam)

    } catch (error) {

      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.');

    } finally {

      setIsLoading(false)
    }

  }

  async function handlePlayerRemove(playerName: string){

    try {

      await playerRemoveByGroup(playerName, group)
      fetchPlayersByTeam();
      
    } catch (error) {
      console.log (error);
      Alert.alert('Remover pessoa', 'Nao foi possivel remover essa pessoa')
      
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate('groups');

    } catch (error) {
      console.log(error);
      Alert.alert('Remover Grupo', 'Não foi posível remover o grupo');
    }
  }

  async function handleGroupRemove() {
    Alert.alert(
      'Remover',
      'Deseja remover o grupo?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => groupRemove() }
      ]
    )
  }

  useEffect(() => {

    fetchPlayersByTeam();

  },[team])

  
  return (
    <Container>
      <Header showBackButton />

      <Highlight 
        title={group}
        subtitle="adicione a galera e separe os times"
      />

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName} 
          value={newPlayerName}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon 
          icon="add" 
          onPress={handleAddPlayer}
        />

        
      </Form>


    <HeaderList>

    <FlatList 
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter 
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />

      

        <NumberOfPlayers>
          {players.length}
        </NumberOfPlayers>
      </HeaderList>

    { isLoading ? <Loading /> : 


      <FlatList 
        data={players}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <PlayerCard 
            name={item.name} 
            onRemove={() => handlePlayerRemove(item.name)}
          />
        )}
        ListEmptyComponent={() => (
          <ListEmpty message="Não há pessoas nesse time" />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
      />

        }

      <Button 
        title="Remover Turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  )
}