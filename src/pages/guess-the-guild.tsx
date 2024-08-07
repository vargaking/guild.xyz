import { Box, Container, useColorModeValue } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import GameKickOff from "components/guess-the-guild/GameKickOff"
import GuildPair from "components/guess-the-guild/GuildPair"
import NameGuess from "components/guess-the-guild/NameGuess"
import useLocalStorage from "hooks/useLocalStorage"
import { GetStaticProps } from "next"
import { HTML5toTouch } from "rdndmb-html5-to-touch"
import { useState } from "react"
import { DndProvider } from "react-dnd-multi-backend"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

type Props = {
  guilds: GuildBase[]
}

const Page = ({ guilds: guildsInitial }: Props) => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-100)", "#343439")

  const [playableGuilds, setPlayableGuilds] = useState<GuildBase[]>(guildsInitial)

  const [highScore, setHighScore] = useLocalStorage("highScore", 0)

  const [gameScore, setGameScore] = useState(-1) // -1 = kick off, >=0 = score
  const [gameMode, setGameMode] = useState(-1) // 0 = name, 1 = pairing

  const [difficulty, setDifficulty] = useState("easy")

  // name game states
  const [correctGuild, setCorrectGuild] = useState<GuildBase>()
  const [nameOptions, setNameOptions] = useState<string[]>([])

  // pairing game states
  const [guildPlaces, setGuildPlaces] = useState<GuildBase[]>([])

  const forwardGame = () => {
    // choose game mode randomly
    const randomGameMode = Math.floor(Math.random() * 2)

    if (randomGameMode === 0) {
      // Name game

      const guildNameGameData = getGuildsNameGame()

      setCorrectGuild(guildNameGameData.correctGuild)
      setNameOptions(guildNameGameData.nameOptions)
    } else {
      // Pairing game
      const randomGuilds = getGuildsPairingGame()
      setGuildPlaces(randomGuilds)
    }

    setGameMode(randomGameMode)
  }

  const startGame = () => {
    if (difficulty === "easy") {
      // set playable guilds to the first 10% of the total guilds
      setPlayableGuilds(
        guildsInitial.slice(0, Math.floor(guildsInitial.length * 0.1))
      )
    } else if (difficulty === "medium") {
      // set playable guilds to the first 50% of the total guilds
      setPlayableGuilds(
        guildsInitial.slice(0, Math.floor(guildsInitial.length * 0.5))
      )
    } else {
      // set playable guilds to all guilds
      setPlayableGuilds(guildsInitial)
    }

    // reset game states
    setGameScore(0)

    setNameOptions([])
    setGuildPlaces([])
    setCorrectGuild(undefined)
    setGameMode(-1)

    forwardGame()
  }

  const restartGame = () => {
    if (gameScore > highScore) {
      setHighScore(gameScore)
    }

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

    let correctGuildChoice: GuildBase

    while (names.length < 4) {
      const randomIndex = Math.floor(Math.random() * playableGuilds.length)
      const randomName = playableGuilds[randomIndex].name
      if (!names.includes(randomName)) {
        if (!playableGuilds[randomIndex].imageUrl?.match("guildLogos")) {
          names.push(randomName)

          if (names.length === 1) {
            correctGuildChoice = playableGuilds[randomIndex]
          }

          playableGuilds.splice(randomIndex, 1)
        }
      }
    }

    return {
      correctGuild: correctGuildChoice!,
      nameOptions: names.sort(() => Math.random() - 0.5),
    }
  }

  const getGuildsPairingGame = () => {
    const guildsCopy = [...playableGuilds]
    const randomGuilds = []
    while (randomGuilds.length < 4) {
      const randomIndex = Math.floor(Math.random() * guildsCopy.length)
      randomGuilds.push(guildsCopy.splice(randomIndex, 1)[0])
      playableGuilds.splice(randomIndex, 1)
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

  return (
    <DndProvider options={HTML5toTouch}>
      <LinkPreviewHead path="" />
      <Layout
        title={"Guess the Guild"}
        ogDescription="Test your knowledge of the Guildhall community!"
      >
        {gameScore >= 0 ? (
          <Box position="relative" width="80%" margin="0 auto">
            <Container
              backgroundColor={bgColor}
              borderRadius="var(--chakra-radii-lg)"
              position={{ base: "relative", lg: "absolute" }}
              top="0"
              right="0"
              marginBottom={{ base: 4, lg: 0 }}
              width="fit-content"
              padding="var(--chakra-space-2) var(--chakra-space-4)"
            >
              Score: {gameScore}
            </Container>

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
          </Box>
        ) : (
          <Box position="relative" width="90%" margin="0 auto">
            <Container
              backgroundColor={bgColor}
              borderRadius="var(--chakra-radii-lg)"
              position={{ base: "relative", lg: "absolute" }}
              top="0"
              right="0"
              marginBottom={{ base: 4, lg: 0 }}
              width="fit-content"
              padding="var(--chakra-space-2) var(--chakra-space-4)"
              suppressHydrationWarning={true}
            >
              Highscore: {highScore || 0}
            </Container>

            <GameKickOff
              startGame={startGame}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
          </Box>
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
