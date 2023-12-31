import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import * as S from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { NextSeo } from 'next-seo'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O nome de usuário deve conter apenas letras e hifens.',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),
})

type TRegisterFormData = z.infer<typeof registerFormSchema>

export default function RegisterPage() {
  const query = useSearchParams()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<TRegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  useEffect(() => {
    const username = query.get('username')

    if (username) {
      setValue('username', username)
    }
  }, [query, setValue])

  async function handleRegister(data: TRegisterFormData) {
    const { username, name } = data

    try {
      await api.post('/users', {
        username,
        name,
      })

      router.push('/register/connect-calendar')
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data.message) {
        alert(err.response.data.message)
        return
      }
      console.log(err)
    }
  }

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />
      <S.Container>
        <S.Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </S.Header>

        <S.Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size={'sm'}>Nome de usuário</Text>
            <TextInput
              prefix="ignite.com/"
              placeholder="seu-usuário"
              crossOrigin=""
              {...register('username')}
            />
            {errors.username && (
              <S.FormError size="sm">{errors.username.message}</S.FormError>
            )}
          </label>

          <label>
            <Text size={'sm'}>Nome completo</Text>
            <TextInput
              placeholder="Seu nome"
              crossOrigin=""
              {...register('name')}
            />
            {errors.name && (
              <S.FormError size="sm">{errors.name.message}</S.FormError>
            )}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo <ArrowRight />
          </Button>
        </S.Form>
      </S.Container>
    </>
  )
}
