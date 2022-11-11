import { Container, Content, Icon } from "./styles";

import { Header } from "@components/Header";
import { Button } from "@components/Button";
import { Highlight } from "@components/HightLight";
import { Input } from "@components/Input";
import { useNavigation } from "@react-navigation/native";

export function NewGroup() {

  const navigation =useNavigation()

  function handleNew(){
    navigation.navigate('players', { group: 'Galera'})
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
        placeholder="Nome da turma" />

        <Button 
          title="Criar"
          onPress={handleNew}
        />
      </Content>
    </Container>
  )
}