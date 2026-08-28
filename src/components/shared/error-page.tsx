import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { ApiErrorKind } from "@/core/stores/use-api-error-store";

const ERROR_MESSAGES: Record<ApiErrorKind, string> = {
  FORBIDDEN: "권한이 없습니다",
  NOT_FOUND: "존재하지 않는 페이지 입니다",
};

type ErrorPageProps = {
  kind: ApiErrorKind;
};

export function ErrorPage({ kind }: ErrorPageProps): React.ReactElement {
  const navigate = useNavigate();

  function handleGoBack(): void {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
      <p className="text-xl font-medium text-foreground md:text-2xl">{ERROR_MESSAGES[kind]}</p>
      <Button
        onClick={handleGoBack}
        className="h-11 rounded-full bg-[#4F6AE8] px-14 text-base font-semibold text-white hover:bg-[#3D56D4] dark:bg-[#5B7FFF] dark:hover:bg-[#4A6EEE]"
      >
        이전화면
      </Button>
    </div>
  );
}
