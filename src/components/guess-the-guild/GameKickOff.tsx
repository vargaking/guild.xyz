import {
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"

const GameKickOff = ({ startGame }: { startGame: () => void }) => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-100)", "#343439")

  return (
    <Container w="fit-content" borderRadius="lg" bg={bgColor} p={8}>
      <Flex
        gap={8}
        h={64}
        w="fit-content"
        flexDirection="row"
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
            <Button colorScheme="green">Easy</Button>
            <Button colorScheme="yellow" variant="outline">
              Medium
            </Button>
            <Button colorScheme="red" variant="outline">
              Hard
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Container>
  )
}

export default GameKickOff
