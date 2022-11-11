import { Container, Content, Icon } from "./styles";


import { Header } from "@components/Header";
import { Button } from "@components/Button";
import { Highlight } from "@components/HightLight";
import { Input } from "@components/Input";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { groupCreate } from "@storage/group/groupCreate";
import { AppError } from "@utils/AppError";
import { Alert } from "react-native";

export function NewGroup() {

  const [ group, setGroup ] = useState('')

  const navigation = useNavigation()

  async function handleNew(){
    try {
      if(group.trim().length === 0 ){
         return Alert.alert('Novo Group', 'digite o nome da turma')

      }
      await groupCreate(group)
      navigation.navigate('players', { group })
      
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert('Novo Group', error.message)
      } else {
        Alert.alert('Novo Group', 'nao foi possivel criar novo grupo')

        console.log(error)
      }
    }


  }
  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />
        
        <Highlight 
          title="Nova turma"
          subtitle="crie a turma para adicionar as pessoas"
        />

        <Input
          placeholder="Nome da turma"
          onChangeText={setGroup}
          />

        <Button 
          title="Criar"
          onPress={handleNew}
        />
      </Content>
    </Container>
  )
}