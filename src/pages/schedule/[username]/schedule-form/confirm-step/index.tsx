import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'

import { CalendarBlank, Clock } from 'phosphor-react'

import * as S from './styles'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { api } from '@/lib/axios'
import { useParams } from 'next/navigation'

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter no mínimo 3 caracteres' }),
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  observations: z.string().optional(),
})

type TConfirmFormSchema = z.infer<typeof confirmFormSchema>

interface IConfirmStepProps {
  schedulingDate: Date
  onClearSelectedDateTime: () => void
}

export default function ConfirmStep({
  schedulingDate,
  onClearSelectedDateTime,
}: IConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TConfirmFormSchema>({
    resolver: zodResolver(confirmFormSchema),
  })

  const params = useParams()
  const username = params?.username

  async function handleConfirmScheduling(data: TConfirmFormSchema) {
    const { name, email, observations } = data

    await api.post(`/users/${username}/schedule`, {
      name,
      email,
      observations,
      date: schedulingDate,
    })

    onClearSelectedDateTime()
  }

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

  return (
    <S.ConfirmContainer
      as="form"
      onSubmit={handleSubmit(handleConfirmScheduling)}
    >
      <S.FormHeader>
        <Text>
          <CalendarBlank />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
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
        <Button
          type="button"
          variant="tertiary"
          onClick={onClearSelectedDateTime}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </S.FormActions>
    </S.ConfirmContainer>
  )
}
