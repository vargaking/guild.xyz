import {
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"

const GameKickOff = ({
  startGame,
  difficulty,
  setDifficulty,
}: {
  startGame: () => void
  difficulty: string
  setDifficulty: (difficulty: string) => void
}) => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-100)", "#343439")

  return (
    <Container w="fit-content" borderRadius="lg" bg={bgColor} p={8}>
      <Flex
        gap={8}
        h="fit-content"
        w="fit-content"
        flexDirection={{ base: "column", xl: "row" }}
        justifyContent={"center"}
      >
        <Flex justifyContent={"center"} flexDirection="column">
          <Button onClick={startGame} colorScheme="indigo">
            Start game
          </Button>
        </Flex>
        <Divider orientation="vertical" />
        <Flex justifyContent={"center"} flexDirection="column">
          <Heading size={"xl"} mb={8}>
            Select difficulty
          </Heading>
          <Stack direction={"column"} spacing={4}>
            <Button
              colorScheme="green"
              variant={difficulty == "easy" ? "solid" : "outline"}
              onClick={() => setDifficulty("easy")}
            >
              Easy
            </Button>
            <Button
              colorScheme="orange"
              variant={difficulty == "medium" ? "solid" : "outline"}
              onClick={() => setDifficulty("medium")}
            >
              Medium
            </Button>
            <Button
              colorScheme="red"
              variant={difficulty == "hard" ? "solid" : "outline"}
              onClick={() => setDifficulty("hard")}
            >
              Hard
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Container>
  )
}

export default GameKickOff
