import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Norwegian from "./pages/Norwegian";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="norwegian" element={<Norwegian />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
