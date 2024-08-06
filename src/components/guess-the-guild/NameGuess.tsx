import {
  Button,
  Container,
  Flex,
  Heading,
  Skeleton,
  SkeletonCircle,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import { useEffect, useRef, useState } from "react"
import { GuildBase } from "types"

type Props = {
  guild: GuildBase
  guildOptions: string[]
  correctAction: (score: number) => void
  restartEvent: () => void
}

const NameGuess = ({ guild, guildOptions, correctAction, restartEvent }: Props) => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-100)", "#343439")

  const [correctButtonIndex, setCorrectButtonIndex] = useState(-1)

  const [incorrectButtonIndex, setIncorrectButtonIndex] = useState(-1)

  const imageLoaded = useRef(false)

  useEffect(() => {
    console.log("img loaded")
  }, [imageLoaded.current])

  // for debugging
  console.log(guild, "current guild")

  const guessName = (name: string, index: number) => {
    if (name === guild.name) {
      setCorrectButtonIndex(index)

      setTimeout(() => {
        setCorrectButtonIndex(-1)
        imageLoaded.current = false
        correctAction(1)
      }, 1000)
    } else {
      setIncorrectButtonIndex(index)
      setCorrectButtonIndex(
        guildOptions.findIndex((option) => option === guild.name)
      )
    }
  }

  return (
    <>
      <Stack hidden={!imageLoaded.current} w="fit-content" margin="0 auto">
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="8px"
        >
          <Heading visibility="hidden" size={"lg"}>
            Guess the guild by the logo
          </Heading>

          <SkeletonCircle size="100px" />
          <Flex
            gap={2}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems="center"
            width="100%"
          >
            <Skeleton height="44px" width="100%" />
            <Skeleton height="44px" width="100%" />
            <Skeleton height="44px" width="100%" />
            <Skeleton height="44px" width="100%" />
          </Flex>
        </Flex>
      </Stack>

      <Container
        hidden={imageLoaded.current}
        w="fit-content"
        borderRadius="lg"
        bg={bgColor}
        p={8}
      >
        <Flex
          gap={8}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems="center"
        >
          <Heading size={"lg"}>Guess the guild by the logo</Heading>
          <GuildLogo
            loadedEvent={() => (imageLoaded.current = true)}
            imageUrl={guild.imageUrl}
            size={"100px"}
          />
          <Flex
            gap={2}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems="center"
            width="100%"
          >
            {guildOptions.map((option, index) => (
              <Button
                onClick={() => guessName(option, index)}
                key={index}
                width="100%"
                colorScheme={
                  index === correctButtonIndex
                    ? "green"
                    : index === incorrectButtonIndex
                    ? "red"
                    : "gray"
                }
              >
                {option}
              </Button>
            ))}

            {incorrectButtonIndex !== -1 && (
              <Button onClick={restartEvent} colorScheme="blue" width="100%">
                Restart game
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </>
  )
}

export default NameGuess
