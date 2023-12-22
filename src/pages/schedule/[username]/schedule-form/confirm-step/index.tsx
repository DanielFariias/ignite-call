import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'

import { CalendarBlank, Clock } from 'phosphor-react'

import * as S from './styles'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter no mínimo 3 caracteres' }),
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  observations: z.string().optional(),
})

type TConfirmFormSchema = z.infer<typeof confirmFormSchema>

export default function ConfirmStep() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TConfirmFormSchema>({
    resolver: zodResolver(confirmFormSchema),
  })

  function handleConfirmScheduling(data: TConfirmFormSchema) {
    console.log(data)
  }

  return (
    <S.ConfirmContainer
      as="form"
      onSubmit={handleSubmit(handleConfirmScheduling)}
    >
      <S.FormHeader>
        <Text>
          <CalendarBlank />
          22 de Setembro de 2022
        </Text>
        <Text>
          <Clock />
          18:00h
        </Text>
      </S.FormHeader>

      <label>
        <Text size="sm">Nome completo*</Text>
        <TextInput
          placeholder="Seu nome"
          crossOrigin={''}
          {...register('name')}
        />
        {errors.name && (
          <S.FormError size={'sm'} color="red">
            {errors.name.message}
          </S.FormError>
        )}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail*</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          crossOrigin={''}
          {...register('email')}
        />
        {errors.email && (
          <S.FormError size={'sm'} color="red">
            {errors.email.message}
          </S.FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <S.FormActions>
        <Button type="button" variant="tertiary">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </S.FormActions>
    </S.ConfirmContainer>
  )
}
