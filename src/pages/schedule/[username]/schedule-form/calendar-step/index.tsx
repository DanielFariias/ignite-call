import { Calendar } from '@/components/calendar'
import * as S from './styles'
import { useState } from 'react'
import dayjs from 'dayjs'
import { api } from '@/lib/axios'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

interface IAvailability {
  possibleTimes: number[]
  availableTimes: number[]
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const params = useParams()
  const username = params?.username

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  async function getAvailability() {
    const response = await api.get(`/users/${username}/availability`, {
      params: {
        date: selectedDateWithoutTime,
      },
    })

    return response.data
  }

  const { data: availability } = useQuery<IAvailability>({
    queryKey: ['availability', selectedDateWithoutTime],
    queryFn: getAvailability,
    enabled: !!selectedDateWithoutTime,
  })

  const isDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  console.log(availability)
  return (
    <S.Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <S.TimePickerContainer>
          <S.TimePickerHeader>
            {weekDay}, <span>{describedDate}</span>
          </S.TimePickerHeader>

          <S.TimePickerList>
            {availability?.possibleTimes.map((time) => {
              return (
                <S.TimePickerItem
                  key={time}
                  disabled={!availability?.availableTimes.includes(time)}
                >
                  {String(time).padStart(2, '0')}:00
                </S.TimePickerItem>
              )
            })}
          </S.TimePickerList>
        </S.TimePickerContainer>
      )}
    </S.Container>
  )
}
