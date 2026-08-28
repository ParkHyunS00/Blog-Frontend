import { useEffect } from "react";

export const DEFAULT_DOCUMENT_DESCRIPTION =
  "웹 개발자 박현수의 기술 블로그입니다. 개발하며 배우고 고민한 내용을 기록하고 공유합니다.";

export function useDocumentDescription(description?: string | null): void {
  useEffect(() => {
    const metaDescription = document.head.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    if (!metaDescription) return;

    metaDescription.content = description?.trim() || DEFAULT_DOCUMENT_DESCRIPTION;

    return () => {
      metaDescription.content = DEFAULT_DOCUMENT_DESCRIPTION;
    };
  }, [description]);
}
