import {
  Box,
  HStack,
  SimpleGrid,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import { Users } from "@phosphor-icons/react"
import DisplayCard from "components/common/DisplayCard"
import GuildLogo from "components/common/GuildLogo"
import React from "react"
import { useDrop } from "react-dnd"
import { GuildBase } from "types"
import pluralize from "utils/pluralize"

type Props = {
  guildData: GuildBase
  children?: React.ReactNode
  grabbedIndex: number
  dropEvent: (placeName: string) => void
  isCorrect?: boolean
}

const GuessGuildCard = ({
  guildData,
  children,
  grabbedIndex,
  dropEvent,
  isCorrect,
}: Props): JSX.Element => {
  const ItemTypes = {
    ICON: "icon",
  }

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.ICON,
    drop: (item: { guild: GuildBase }, monitor) => {
      dropEvent(guildData.name)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <Box
      borderRadius="2xl"
      w="full"
      h="full"
      border="2px solid"
      borderColor={isCorrect ? "transparent" : "red"}
    >
      <DisplayCard>
        <SimpleGrid templateColumns="1fr" gap={4} alignItems="center">
          {children ||
            drop(
              <div>
                <GuildLogo imageUrl="" highlight={isOver} />
              </div>
            )}

          <VStack
            spacing={2}
            alignItems="start"
            w="full"
            maxW="full"
            mb="0.5"
            mt="-1"
          >
            <HStack spacing={1}>
              <Text
                as="span"
                fontFamily="display"
                fontSize="lg"
                fontWeight="bold"
                letterSpacing="wide"
                maxW="full"
                noOfLines={1}
                wordBreak="break-all"
              >
                {guildData.name}
              </Text>
            </HStack>

            <Wrap zIndex="1">
              <Tag as="li">
                <TagLeftIcon as={Users} />
                <TagLabel>
                  {new Intl.NumberFormat("en", { notation: "compact" }).format(
                    guildData.memberCount ?? 0
                  )}
                </TagLabel>
              </Tag>
              <Tag as="li">
                <TagLabel>{pluralize(guildData.rolesCount ?? 0, "role")}</TagLabel>
              </Tag>
            </Wrap>
          </VStack>
        </SimpleGrid>
      </DisplayCard>
    </Box>
  )
}

export default GuessGuildCard
