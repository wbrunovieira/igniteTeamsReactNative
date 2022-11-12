import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/HightLight";
import { Input } from "@components/Input";
import { ListEmpty } from "@components/ListEmpty";
import { PlayerCard } from "@components/PlayerCard";
import { useRoute } from "@react-navigation/native";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroup } from "@storage/player/playersGetByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { AppError } from "@utils/AppError";
import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

type RouteParams = {
  group: string
}

export function Players() {


  const [ newPlayerName, setNewPlayerName ] = useState('')
  const [ team, setTeam ] = useState('Time A')
  const [ players, setPlayers ] = useState<PlayerStorageDTO[]>([])

  const route = useRoute()
  const { group } = route.params as RouteParams;

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

      setPlayers(playersByTeam)

    } catch (error) {

      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.');

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
          onChangeText={setNewPlayerName} 
          placeholder="Nome da pessoa"
          autoCorrect={false}
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
            onRemove={() => {}}
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