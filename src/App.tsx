import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/shared/header";
import { HomePage } from "@/routes/index";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
