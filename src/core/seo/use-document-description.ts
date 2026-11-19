import { useEffect } from "react";

export const DEFAULT_DOCUMENT_DESCRIPTION = "현수의 성장 아카이브";

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
