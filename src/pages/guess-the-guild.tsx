import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import GameKickOff from "components/guess-the-guild/GameKickOff"
import GuildPair from "components/guess-the-guild/GuildPair"
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
  // -1 = kick off, >=0 = score
  const [isGameStarted, setIsGameStarted] = useState(false)

  const startGame = () => {
    setIsGameStarted(true)
  }

  const getRandomNames = (guilds: GuildBase[], correctName: string) => {
    const names = [correctName]
    while (names.length < 4) {
      const randomName = guilds[Math.floor(Math.random() * guilds.length)].name
      if (!names.includes(randomName)) {
        names.push(randomName)
      }
    }
    return names.sort(() => Math.random() - 0.5)
  }

  const getRandomGuilds = (guilds: GuildBase[]) => {
    const guildsCopy = [...guilds]
    const randomGuilds = []
    while (randomGuilds.length < 4) {
      const randomIndex = Math.floor(Math.random() * guildsCopy.length)
      randomGuilds.push(guildsCopy.splice(randomIndex, 1)[0])
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

  let chosenGuilds = getRandomGuilds(guildsInitial)
  console.log(chosenGuilds)
  console.log(mixGuilds(chosenGuilds))

  console.log(guildsInitial)

  return (
    <DndProvider backend={HTML5Backend}>
      <LinkPreviewHead path="" />
      <Layout
        title={"Guess the Guild"}
        ogDescription="Test your knowledge of the Guildhall community!"
      >
        {isGameStarted == true ? (
          //<NameGuess guild={guildsInitial[0]} guildOptions={getRandomNames(guildsInitial, guildsInitial[0].name)} />
          <GuildPair
            guildPlaces={chosenGuilds}
            guildsToDrop={mixGuilds(chosenGuilds)}
          />
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
