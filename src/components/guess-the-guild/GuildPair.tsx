import {
  Button,
  Container,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { GuildBase } from "types"
import GuessGuildCard from "./GuessGuildCard"
import GuessGuildLogo from "./GuessGuildLogo"

type Props = {
  guildPlaces: GuildBase[]
  guildsToDrop: GuildBase[]
}

const GuildPair = ({ guildPlaces, guildsToDrop }: Props) => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-100)", "#343439")

  const [correctIndexes, setCorrectIndexes] = useState([] as number[])

  const [incorrectIndexes, setIncorrectIndexes] = useState([] as number[])

  const grabbedIndexRef = useRef(-1)

  const updateGrabbedIndex = (index: number) => {
    grabbedIndexRef.current = index
  }

  console.log(guildsToDrop, "guildsToDrop")
  console.log(guildPlaces, "guildPlaces")

  const [guildGuesses, setGuildGuesses] = useState(
    guildPlaces.map((item) => {
      return { ...item, guess: -1 }
    })
  )

  const dropEvent = async (placeName: string) => {
    let newGuildGuesses = [...guildGuesses]

    // find the guild with the placeName and add the droppedName to the guess
    const index = newGuildGuesses.findIndex((item) => item.name === placeName)

    newGuildGuesses[index].guess = -1

    // if the droppedGuild is already in the guesses, remove it
    if (newGuildGuesses.some((guess) => guess.guess === grabbedIndexRef.current)) {
      const removeIndex = newGuildGuesses.findIndex(
        (guess) => guess.guess === grabbedIndexRef.current
      )
      newGuildGuesses[removeIndex].guess = -1
    }

    newGuildGuesses[index].guess = grabbedIndexRef.current

    setGuildGuesses(newGuildGuesses)
  }

  const checkResults = () => {
    let correctIndexes: number[] = []
    let incorrectIndexes: number[] = []

    guildGuesses.forEach((guess, index) => {
      if (
        guess.guess === guildsToDrop.findIndex((guild) => guild.name === guess.name)
      ) {
        correctIndexes.push(index)
      } else {
        incorrectIndexes.push(index)
      }
    })

    setCorrectIndexes(correctIndexes)
    setIncorrectIndexes(incorrectIndexes)
  }

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)

  useEffect(() => {
    if (guildGuesses.every((guess) => guess.guess !== -1)) {
      setIsSubmitButtonDisabled(false)
    } else {
      setIsSubmitButtonDisabled(true)
    }
  }, [guildGuesses])

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
        <Button
          isDisabled={isSubmitButtonDisabled}
          width="100%"
          colorScheme="green"
          onClick={checkResults}
        >
          Submit
        </Button>
      </Flex>
    </Container>
  )
}

export default GuildPair
