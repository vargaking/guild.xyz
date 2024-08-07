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
import { useState } from "react"
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

  const [imageLoaded, setImageLoaded] = useState(false)

  const guessName = (name: string, index: number) => {
    if (name === guild.name) {
      setCorrectButtonIndex(index)

      setTimeout(() => {
        setCorrectButtonIndex(-1)
        setImageLoaded(false)
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
      <Stack hidden={imageLoaded} w="fit-content" margin="0 auto">
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
        visibility={imageLoaded ? "visible" : "hidden"}
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
            loadedEvent={() => {
              setImageLoaded(true)
            }}
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
          </Flex>
          {incorrectButtonIndex !== -1 && (
            <Button onClick={restartEvent} colorScheme="blue" width="100%">
              Restart game
            </Button>
          )}
        </Flex>
      </Container>
    </>
  )
}

export default NameGuess
