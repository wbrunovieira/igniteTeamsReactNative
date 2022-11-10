import { ButtonIcon } from "@components/ButtinIcon";
import { Header } from "@components/Header";
import { Highlight } from "@components/HightLight";
import { Input } from "@components/Input";

import { Container, Form } from "./styles";

export function Players() {
  return (
    <Container>
      <Header showBackButton />

      <Highlight 
        title="Nome da turma"
        subtitle="adicione a galera e separe os times"
      />

      <Form>
        <Input 
          placeholder="Nome da pessoa"
          autoCorrect={false}
        />

        <ButtonIcon 
          icon="add" 
        />
      </Form>
    </Container>
  )
}