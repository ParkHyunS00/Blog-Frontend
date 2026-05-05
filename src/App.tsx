import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ErrorPage } from "@/components/shared/error-page";
import { HomePage } from "@/routes/index";
import { PostDetailPage } from "@/routes/posts/[id]";
import { PostWritePage } from "@/routes/posts/write";
import { AdminPage } from "@/routes/admin/index";
import { useApiErrorStore } from "@/core/stores/use-api-error-store";

function ApiErrorBridge(): null {
  const navigate = useNavigate();
  const location = useLocation();
  const shouldRedirectToLogin = useApiErrorStore((state) => state.shouldRedirectToLogin);

  useEffect(() => {
    if (shouldRedirectToLogin) {
      useApiErrorStore.getState().reset();
      navigate("/admin", { replace: true });
    }
  }, [shouldRedirectToLogin, navigate]);

  useEffect(() => {
    useApiErrorStore.getState().reset();
  }, [location.pathname]);

  return null;
}

function App() {
  const errorKind = useApiErrorStore((state) => state.errorKind);

  return (
    <div className="flex min-h-screen flex-col">
      <ApiErrorBridge />
      <Header />
      <main className="flex flex-1 flex-col">
        {errorKind ? (
          <ErrorPage kind={errorKind} />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/write" element={<PostWritePage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
