import { Outlet } from "react-router-dom"
import { Navbar } from "../components/Navbar"


export const UserLayout = () => {
  return (
    <>
      <Navbar />
      <main className="@container m-8 p-8">
      <Outlet/>
      </main>
    </>
  )
}
