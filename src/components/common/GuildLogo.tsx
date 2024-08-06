import { Circle, Img, ResponsiveValue, useColorMode } from "@chakra-ui/react"
import Image from "next/image"
import { memo } from "react"
import { Rest } from "types"

type Props = {
  imageUrl?: string
  imageQuality?: number
  size?: ResponsiveValue<number | string>
  priority?: boolean
  highlight?: boolean
  loadedEvent?: () => void
} & Rest

const GuildLogo = memo(
  ({
    imageUrl,
    imageQuality = 70,
    size = "48px",
    priority = false,
    highlight = false,
    loadedEvent,
    ...rest
  }: Props): JSX.Element => {
    const { colorMode } = useColorMode()

    return (
      <Circle
        position="relative"
        bgColor={
          highlight ? "gray.400" : colorMode === "light" ? "gray.700" : "gray.600"
        }
        size={size}
        overflow="hidden"
        {...rest}
      >
        {imageUrl &&
          (imageUrl?.match("guildLogos") ? (
            <Img src={imageUrl} alt="Guild logo" boxSize="40%" />
          ) : (
            <Image
              src={imageUrl}
              quality={imageQuality}
              alt="Guild logo"
              priority={priority}
              fill
              sizes={typeof size === "string" ? size : Object.values(size).at(-1)}
              style={{
                objectFit: "cover",
              }}
              onLoad={loadedEvent}
            />
          ))}
      </Circle>
    )
  }
)

export default GuildLogo
