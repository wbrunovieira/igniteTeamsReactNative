import { useEffect, useState, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import { Alert, FlatList, TextInput } from "react-native";
import { AppError } from "@utils/AppError";

import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/HightLight";
import { Input } from "@components/Input";
import { ListEmpty } from "@components/ListEmpty";
import { PlayerCard } from "@components/PlayerCard";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroup } from "@storage/player/playersGetByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";

type RouteParams = {
  group: string
}

export function Players() {


  const [ newPlayerName, setNewPlayerName ] = useState('')
  const [ team, setTeam ] = useState('Time A')
  const [ players, setPlayers ] = useState<PlayerStorageDTO[]>([])

  const route = useRoute()
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

      const playersByTeam = await playersGetByGroupAndTeam(group, team);

      newPlayerNameInputRef.current?.blur();

      setPlayers(playersByTeam)

    } catch (error) {

      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.');

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
    </Container>
  )
}