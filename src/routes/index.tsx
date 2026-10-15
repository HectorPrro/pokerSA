import { createFileRoute } from "@tanstack/react-router";
import { Room } from "@/components/poker/room";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Room />;
}
