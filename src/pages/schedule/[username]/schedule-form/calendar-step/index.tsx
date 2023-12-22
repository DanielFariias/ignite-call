import { Calendar } from '@/components/calendar'
import * as S from './styles'

export function CalendarStep() {
  const isDateSelected = true

  return (
    <S.Container isTimePickerOpen={isDateSelected}>
      <Calendar />

      {isDateSelected && (
        <S.TimePickerContainer>
          <S.TimePickerHeader>
            Terça-Feira <span>20 de setembro</span>
          </S.TimePickerHeader>

          <S.TimePickerList>
            <S.TimePickerItem>08:00</S.TimePickerItem>
            <S.TimePickerItem>09:00</S.TimePickerItem>
            <S.TimePickerItem>10:00</S.TimePickerItem>
            <S.TimePickerItem>11:00</S.TimePickerItem>
            <S.TimePickerItem>12:00</S.TimePickerItem>
            <S.TimePickerItem>13:00</S.TimePickerItem>
          </S.TimePickerList>
        </S.TimePickerContainer>
      )}
    </S.Container>
  )
}
