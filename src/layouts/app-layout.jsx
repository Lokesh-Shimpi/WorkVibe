import  Header  from "../components/header"
import { Outlet } from "react-router-dom"


const AppLayout = () => {
  return (
    <div>
        <div className="grid-background"></div>
        <main className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
          <Outlet />
        </main>
        <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💗 by Lokesh Shimpi
      </div>
    </div>
  )
}

export default AppLayout