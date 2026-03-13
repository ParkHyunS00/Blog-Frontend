import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { HomePage } from "@/routes/index";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
