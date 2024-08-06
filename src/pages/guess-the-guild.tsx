import { Box, Container, useColorModeValue } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import GameKickOff from "components/guess-the-guild/GameKickOff"
import GuildPair from "components/guess-the-guild/GuildPair"
import NameGuess from "components/guess-the-guild/NameGuess"
import { GetStaticProps } from "next"
import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

type Props = {
  guilds: GuildBase[]
}

const Page = ({ guilds: guildsInitial }: Props) => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-100)", "#343439")

  const [gameScore, setGameScore] = useState(-1) // -1 = kick off, >=0 = score
  const [gameMode, setGameMode] = useState(-1) // 0 = name, 1 = pairing

  // name game states
  const [correctGuild, setCorrectGuild] = useState<GuildBase>()
  const [nameOptions, setNameOptions] = useState<string[]>([])

  // pairing game states
  const [guildPlaces, setGuildPlaces] = useState<GuildBase[]>([])

  const forwardGame = () => {
    // choose game mode randomly
    //const randomGameMode = Math.floor(Math.random() * 2)

    const randomGameMode = 0

    if (randomGameMode === 0) {
      // Name game
      const { correctGuild, nameOptions } = getGuildsNameGame()
      console.log(correctGuild, nameOptions)
      setCorrectGuild(correctGuild)
      setNameOptions(nameOptions)
    } else {
      // Pairing game
      const randomGuilds = getGuildsPairingGame()
      setGuildPlaces(randomGuilds)
    }

    setGameMode(randomGameMode)
  }

  const startGame = () => {
    // reset game states
    setGameScore(0)

    setNameOptions([])
    setGuildPlaces([])
    setCorrectGuild(undefined)
    setGameMode(-1)

    forwardGame()
  }

  const restartGame = () => {
    // reset game states
    setGameScore(-1)

    setNameOptions([])
    setGuildPlaces([])
    setCorrectGuild(undefined)
    setGameMode(-1)
  }

  const correctAction = (score: number) => {
    setGameScore(gameScore + score)

    forwardGame()
  }

  const getGuildsNameGame = () => {
    const names: string[] = []

    let correctGuild: GuildBase

    while (names.length < 4) {
      const randomIndex = Math.floor(Math.random() * guildsInitial.length)
      const randomName = guildsInitial[randomIndex].name
      if (!names.includes(randomName)) {
        names.push(randomName)

        if (names.length === 1) {
          correctGuild = guildsInitial[randomIndex]
        }

        guildsInitial.slice(randomIndex, 1)
      }
    }

    return {
      correctGuild: correctGuild!,
      nameOptions: names.sort(() => Math.random() - 0.5),
    }
  }

  const getGuildsPairingGame = () => {
    const guildsCopy = [...guildsInitial]
    const randomGuilds = []
    while (randomGuilds.length < 4) {
      const randomIndex = Math.floor(Math.random() * guildsCopy.length)
      randomGuilds.push(guildsCopy.splice(randomIndex, 1)[0])
      guildsInitial.splice(randomIndex, 1)
    }
    return randomGuilds
  }

  const mixGuilds = (guilds: GuildBase[]) => {
    const guildsCopy = [...guilds]
    const mixedGuilds = []
    while (guildsCopy.length > 0) {
      const randomIndex = Math.floor(Math.random() * guildsCopy.length)
      mixedGuilds.push(guildsCopy.splice(randomIndex, 1)[0])
    }
    return mixedGuilds
  }

  console.log(guildsInitial)

  return (
    <DndProvider backend={HTML5Backend}>
      <LinkPreviewHead path="" />
      <Layout
        title={"Guess the Guild"}
        ogDescription="Test your knowledge of the Guildhall community!"
      >
        {gameScore >= 0 ? (
          <Box position="relative" width="80%" margin="0 auto">
            {gameMode === 0 ? (
              <NameGuess
                guild={correctGuild!}
                guildOptions={nameOptions}
                correctAction={correctAction}
                restartEvent={restartGame}
              />
            ) : (
              <GuildPair
                guildPlaces={guildPlaces}
                guildsToDrop={mixGuilds(guildPlaces)}
                correctAction={correctAction}
                restartEvent={restartGame}
              />
            )}

            <Container
              backgroundColor={bgColor}
              borderRadius="var(--chakra-radii-lg)"
              position="absolute"
              top="0"
              right="0"
              width="fit-content"
              padding="var(--chakra-space-2) var(--chakra-space-4)"
            >
              Score: {gameScore}
            </Container>
          </Box>
        ) : (
          <GameKickOff startGame={startGame} />
        )}
      </Layout>
    </DndProvider>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await fetcher(`/v2/guilds?sort=members&limit=1000`).catch((_) => [])

  return {
    props: { guilds },
  }
}

export default Page
