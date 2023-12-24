import { Heading, Text } from '@ignite-ui/react'

import * as S from './styles'

import previewImg from '../../assets/app-preview.png'
import Image from 'next/image'
import { ClaimUsernameForm } from './components/claim-username-form'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Ignite Call"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos
        no seu tempo livre."
      />
      <S.Container>
        <S.Hero>
          <Heading size="4xl">Agendamento descomplicado</Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>

          <ClaimUsernameForm />
        </S.Hero>
        <S.Preview>
          <Image
            src={previewImg}
            alt="Calendário simbolizando aplicação em funcionanmento"
            height={400}
            quality={100}
            priority
          />
        </S.Preview>
      </S.Container>
    </>
  )
}
