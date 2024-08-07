import { Box } from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import { useDrag, useDrop } from "react-dnd"
import { GuildBase } from "types"

type Props = {
  guild: GuildBase
  index: number
  setGrabbedIndex: (index: number) => void
  droppableData?: GuildBase
  dropEvent?: (placeName: string, droppedGuild: GuildBase) => void
}

const GuessGuildLogo = ({
  guild,
  index,
  setGrabbedIndex,
  droppableData,
  dropEvent,
}: Props) => {
  const ItemTypes = {
    ICON: "icon",
  }

  const [{ opacity }, dragRef] = useDrag(() => ({
    type: ItemTypes.ICON,
    item: { guild: guild },
    collect: (monitor) => (
      monitor.isDragging() ? setGrabbedIndex(index) : "",
      {
        opacity: monitor.isDragging() ? 0.5 : 1,
      }
    ),
  }))

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.ICON,
    drop: (item: { guild: GuildBase }, monitor) => {
      dropEvent && dropEvent(droppableData!.name, item.guild)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))
  if (droppableData) {
    return (
      <>
        {drop(
          dragRef(
            <div>
              <GuildLogo imageUrl={guild.imageUrl} highlight={isOver} />
            </div>
          )
        )}
      </>
    )
  } else {
    return (
      <>
        {dragRef(
          <div>
            <Box cursor="pointer" style={{ opacity }}>
              <GuildLogo imageUrl={guild.imageUrl} />
            </Box>
          </div>
        )}
      </>
    )
  }
}

export default GuessGuildLogo
