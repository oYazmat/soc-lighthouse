import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sword of Convallaria - Lighthouse Calculator" },
    { name: "description", content: "Welcome to Sword of Convallaria - Lighthouse Calculator!" },
  ];
}

export default function Home() {
  return <>TEST</>;
}
