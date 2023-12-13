import { Button, Text, TextInput } from '@ignite-ui/react'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import * as S from './styles'
import { error } from 'console'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O nome de usuário deve conter apenas letras e hifens',
    })
    .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormSchemaData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormSchemaData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  function handleClaimUsername(data: ClaimUsernameFormSchemaData) {
    console.log(data)
  }

  return (
    <>
      <S.Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          crossOrigin={''}
          size={'sm'}
          prefix="ignite.com/"
          placeholder="Seu nome de usuário"
          {...register('username')}
        />
        <Button type="submit" size={'sm'}>
          Reservar
          <ArrowRight />
        </Button>
      </S.Form>
      <S.FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite um nome de usuário'}
        </Text>
      </S.FormAnnotation>
    </>
  )
}
