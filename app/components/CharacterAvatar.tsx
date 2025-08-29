import { Avatar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { toKebabCase } from "~/utils/string";

interface CharacterAvatarProps {
  name: string;
  size?: number; // optional, default to 40
  sx?: SxProps<Theme>;
}

export default function CharacterAvatar({
  name,
  size = 40,
  sx,
}: CharacterAvatarProps) {
  return (
    <Avatar
      src={`/images/characters/${toKebabCase(name)}.png`}
      alt={name}
      sx={{ width: size, height: size, ...sx }}
    />
  );
}
