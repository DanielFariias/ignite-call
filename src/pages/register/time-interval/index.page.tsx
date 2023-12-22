import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'

import * as S from './styles'
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getWeekDays } from '@/utils/get-week-days'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { api } from '@/lib/axios'
import { useRouter } from 'next/navigation'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) =>
      intervals.filter((interval) => interval.enabled === true),
    )
    .refine((intervals) => intervals.length > 0, {
      message: 'É necessário selecionar pelo menos um dia da semana!',
    })
    .transform((intervals) =>
      intervals.map((interval) => ({
        weekDay: interval.weekDay,
        startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
        endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
      })),
    )
    .refine(
      (intervals) =>
        intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        ),
      {
        message: 'O intervalo de horário deve ser de no mínimo 1 hora!',
      },
    ),
})

type TTimeIntervalsFormsInput = z.input<typeof timeIntervalsFormSchema>
type TTimeIntervalsFormsOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervalPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    watch,
  } = useForm<TTimeIntervalsFormsInput, unknown, TTimeIntervalsFormsOutput>({
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
    resolver: zodResolver(timeIntervalsFormSchema),
  })

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  const intervals = watch('intervals')

  async function handleSetTimeIntervals({
    intervals,
  }: TTimeIntervalsFormsOutput) {
    await api.post('/users/time-intervals', { intervals })

    router.push('/register/update-profile')
  }

  const weekDays = getWeekDays()
  return (
    <S.Container>
      <S.Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>

        <MultiStep size={4} currentStep={3} />
      </S.Header>

      <S.IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <S.IntervalContainer>
          {fields.map((field, index) => (
            <S.IntervalItem key={field.id}>
              <S.IntervalDay>
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      checked={field.value === true}
                    />
                  )}
                />
                <Text>{weekDays[field.weekDay]}</Text>
              </S.IntervalDay>
              <S.IntervalInputs>
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  crossOrigin={''}
                  disabled={intervals[index].enabled === false}
                  {...register(`intervals.${index}.startTime`)}
                />
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  crossOrigin={''}
                  disabled={intervals[index].enabled === false}
                  {...register(`intervals.${index}.endTime`)}
                />
              </S.IntervalInputs>
            </S.IntervalItem>
          ))}
        </S.IntervalContainer>

        {errors.intervals && (
          <S.FormError size={'sm'}>
            {errors.intervals.root?.message}
          </S.FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </S.IntervalBox>
    </S.Container>
  )
}
