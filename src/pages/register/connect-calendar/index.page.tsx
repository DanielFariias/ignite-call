import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { ArrowRight, Check } from 'phosphor-react'
import { signIn, useSession } from 'next-auth/react'

import { useRouter, useSearchParams } from 'next/navigation'

import * as S from './styles'

export default function ConnectCalendarPage() {
  const params = useSearchParams()
  const session = useSession()
  const router = useRouter()

  async function handleConnectCalendar() {
    await signIn('google')
  }

  function handleNavigateToNextStep() {
    router.push('/register/time-interval')
  }

  const hasAuthError = !!params.get('error')
  const isSignedIn = session.status === 'authenticated'

  return (
    <S.Container>
      <S.Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </S.Header>

      <S.ConnectBox>
        <S.ConnectItem>
          <Text>Google Calendar</Text>
          {!isSignedIn && (
            <Button
              variant={'secondary'}
              size={'sm'}
              onClick={() => signIn('google')}
            >
              Conectar
              <ArrowRight />
            </Button>
          )}
          {isSignedIn && (
            <Button
              variant={'secondary'}
              size={'sm'}
              onClick={handleConnectCalendar}
              disabled
            >
              Conectado <Check />
            </Button>
          )}
        </S.ConnectItem>

        {hasAuthError && (
          <S.AuthError size={'sm'}>
            Falha ao se conectar ao Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar
          </S.AuthError>
        )}
        <Button
          onClick={handleNavigateToNextStep}
          type="submit"
          disabled={!isSignedIn}
        >
          Próximo passo <ArrowRight />
        </Button>
      </S.ConnectBox>
    </S.Container>
  )
}
