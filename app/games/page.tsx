import { allGames } from "@/lib/games"
import PathwayPage from "@/components/ui/PathwayPage"
import Nav from "@/components/ui/Nav"
import Footer from "@/components/ui/Footer"

export default function GamesPage() {
  return (
    <>
      <Nav />
      <PathwayPage games={allGames} />
      <Footer />
    </>
  )
}
