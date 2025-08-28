import { Avatar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface CharacterAvatarProps {
  name: string;
  size?: number; // optional, default to 40
  sx?: SxProps<Theme>;
}

function toKebabCase(str: string): string {
  return str
    .replace(/["']/g, "")
    .replace(/\./g, "-")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
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
