import { Link, Route, Routes } from "react-router";
import Home from "./pages/Home";
import CityDetail from "./pages/CityDetail";
import NotFound from "./pages/NotFound";


function App() {

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route path="/city" element={<CityDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
