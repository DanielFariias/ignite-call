import { Button, TextInput } from '@ignite-ui/react'
import * as S from './styles'
import { ArrowRight } from 'phosphor-react'

export function ClaimUsernameForm() {
  return (
    <S.Form as="form">
      <TextInput
        crossOrigin={''}
        size={'sm'}
        prefix="ignite.com/"
        placeholder="Seu nome de usuário"
      />
      <Button type="submit" size={'sm'}>
        Reservar
        <ArrowRight />
      </Button>
    </S.Form>
  )
}
