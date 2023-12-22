import { Avatar, Heading, Text } from '@ignite-ui/react'

import * as S from './styles'
import { GetStaticPaths, GetStaticProps } from 'next'
import { prisma } from '@/lib/prisma'
import { ScheduleForm } from './schedule-form'

interface ISchedulePageProps {
  user: {
    name: string
    avatarUrl: string
    bio: string
  }
}

export default function SchedulePage({ user }: ISchedulePageProps) {
  return (
    <S.Container>
      <S.UserHeader>
        <Avatar src={user.avatarUrl} alt={user.name} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </S.UserHeader>

      <ScheduleForm />
    </S.Container>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) return { notFound: true }

  return {
    props: {
      user: {
        name: user.name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
      },
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
