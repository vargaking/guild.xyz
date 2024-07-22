import {
  Button,
  Container,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import { useState } from "react"
import { GuildBase } from "types"

type Props = {
  guild: GuildBase
  guildOptions: string[]
}

const NameGuess = ({ guild, guildOptions }: Props) => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-100)", "#343439")

  const [correctButtonIndex, setCorrectButtonIndex] = useState(-1)

  const [incorrectButtonIndex, setIncorrectButtonIndex] = useState(-1)

  const guessName = (name: string, index: number) => {
    if (name === guild.name) {
      setCorrectButtonIndex(index)
    } else {
      setIncorrectButtonIndex(index)
      setCorrectButtonIndex(
        guildOptions.findIndex((option) => option === guild.name)
      )
    }
  }

  return (
    <Container w="fit-content" borderRadius="lg" bg={bgColor} p={8}>
      <Flex
        gap={8}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems="center"
      >
        <Heading size={"lg"}>Guess the guild by the logo</Heading>
        <GuildLogo imageUrl={guild.imageUrl} size={"100px"} />
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
      </Flex>
    </Container>
  )
}

export default NameGuess
