import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { HomePage } from "@/routes/index";
import { PostDetailPage } from "@/routes/posts/[id]";
import { PostWritePage } from "@/routes/posts/write";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/write" element={<PostWritePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
