import {
  Button,
  Container,
  Flex,
  Heading,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { GuildBase } from "types"
import GuessGuildCard from "./GuessGuildCard"
import GuessGuildLogo from "./GuessGuildLogo"

type Props = {
  guildPlaces: GuildBase[]
  guildsToDrop: GuildBase[]
  correctAction: (score: number) => void
  restartEvent: () => void
}

const GuildPair = ({
  guildPlaces,
  guildsToDrop,
  correctAction,
  restartEvent,
}: Props) => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-100)", "#343439")

  const toast = useToast()

  const [incorrectIndexes, setIncorrectIndexes] = useState([] as number[])

  const grabbedIndexRef = useRef(-1)

  const updateGrabbedIndex = (index: number) => {
    grabbedIndexRef.current = index
  }

  //for debugging
  console.log(guildsToDrop, "guildsToDrop")
  console.log(guildPlaces, "guildPlaces")

  const [guildGuesses, setGuildGuesses] = useState(
    guildPlaces.map((item) => {
      return { ...item, guess: -1 }
    })
  )

  const dropEvent = (placeName: string) => {
    setGuildGuesses((prevGuildGuesses) => {
      let newGuildGuesses = [...prevGuildGuesses]

      console.log(prevGuildGuesses, "debugggggg")
      console.log(placeName, "placeName")

      // find the guild with the placeName and add the droppedName to the guess
      const index = newGuildGuesses.findIndex((item) => item.name === placeName)
      console.log(index, "index")

      newGuildGuesses[index].guess = -1

      // if the droppedGuild is already in the guesses, remove it
      if (newGuildGuesses.some((guess) => guess.guess === grabbedIndexRef.current)) {
        const removeIndex = newGuildGuesses.findIndex(
          (guess) => guess.guess === grabbedIndexRef.current
        )
        newGuildGuesses[removeIndex].guess = -1
      }

      newGuildGuesses[index].guess = grabbedIndexRef.current

      return newGuildGuesses
    })
  }

  const checkResults = () => {
    let incorrectIndexes: number[] = []

    guildGuesses.forEach((guess, index) => {
      if (
        guess.guess !== guildsToDrop.findIndex((guild) => guild.name === guess.name)
      ) {
        incorrectIndexes.push(index)
      }
    })

    setIncorrectIndexes(incorrectIndexes)

    if (incorrectIndexes.length === 0) {
      toast({
        title: "Correct answer!",
        description: "You paired all the logos correctly",
        status: "success",
        duration: 3000,
        isClosable: false,
      })

      setTimeout(() => {
        setIncorrectIndexes([])

        correctAction(2)
      }, 1000)
    }
  }

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)

  useEffect(() => {
    console.log("guildguesses changed", guildGuesses)

    if (guildGuesses.every((guess) => guess.guess !== -1)) {
      setIsSubmitButtonDisabled(false)
    } else {
      setIsSubmitButtonDisabled(true)
    }
  }, [guildGuesses])

  useEffect(() => {
    console.log("resetting guesses")
    setIncorrectIndexes([])
    setGuildGuesses(
      guildPlaces.map((item) => {
        return { ...item, guess: -1 }
      })
    )
  }, [guildPlaces])

  return (
    <Container w="fit-content" borderRadius="lg" bg={bgColor} p={8}>
      <Flex
        gap={8}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems="center"
      >
        <Heading size={"lg"}>Pair the logos to their guils</Heading>
        <Flex
          gap={4}
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems="center"
          width="100%"
        >
          {guildsToDrop.map((guild, index) => {
            return (
              !guildGuesses.some((guess) => guess.guess === index) && (
                <GuessGuildLogo
                  guild={guild}
                  key={index}
                  index={index}
                  setGrabbedIndex={updateGrabbedIndex}
                />
              )
            )
          })}
        </Flex>
        <Flex
          gap={2}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems="center"
          width="100%"
        >
          {guildPlaces.map((guild, index) => (
            <GuessGuildCard
              guildData={guild}
              key={index}
              dropEvent={dropEvent}
              grabbedIndex={grabbedIndexRef.current}
              isCorrect={!incorrectIndexes.includes(index)}
            >
              {guildGuesses[index].guess != -1 ? (
                <GuessGuildLogo
                  guild={guildsToDrop[guildGuesses[index].guess]}
                  key={guildGuesses[index].guess}
                  index={guildGuesses[index].guess}
                  dropEvent={dropEvent}
                  droppableData={guild}
                  setGrabbedIndex={updateGrabbedIndex}
                />
              ) : (
                ""
              )}
            </GuessGuildCard>
          ))}
        </Flex>
        {incorrectIndexes.length === 0 ? (
          <Button
            isDisabled={isSubmitButtonDisabled}
            width="100%"
            colorScheme="green"
            onClick={checkResults}
          >
            Submit
          </Button>
        ) : (
          <Button onClick={restartEvent} colorScheme="blue" width="100%">
            Restart game
          </Button>
        )}
      </Flex>
    </Container>
  )
}

export default GuildPair
