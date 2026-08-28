import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ErrorPage } from "@/components/shared/error-page";
import { useApiErrorStore } from "@/core/stores/use-api-error-store";
import { HomePage } from "@/routes/index";

const PostDetailPage = lazy(() =>
  import("@/routes/posts/[id]").then((module) => ({ default: module.PostDetailPage })),
);
const PostWritePage = lazy(() =>
  import("@/routes/posts/write").then((module) => ({ default: module.PostWritePage })),
);
const AdminPage = lazy(() =>
  import("@/routes/admin/index").then((module) => ({ default: module.AdminPage })),
);

function RouteLoadingFallback(): React.ReactElement {
  return (
    <div
      className="min-h-[calc(100vh-3.5rem)]"
      role="status"
      aria-label="페이지를 불러오는 중"
    />
  );
}

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
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin/posts/write" element={<PostWritePage modeType="CREATE" />} />
              <Route path="/admin/posts/draft/:postId/edit" element={<PostWritePage modeType="EDIT_DRAFT" />} />
              <Route path="/admin/posts/:postId/edit" element={<PostWritePage modeType="EDIT_PUBLISHED" />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Suspense>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
