import { RiFileList3Line } from "@remixicon/react";

type CategoryFloatingButtonProps = {
  onClick: () => void;
};

export function CategoryFloatingButton({
  onClick,
}: CategoryFloatingButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed top-18 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#305CEC] text-white shadow-lg transition-colors hover:bg-[#2549c4] md:hidden dark:bg-[#5B7FFF] dark:hover:bg-[#4a6be0]"
      aria-label="카테고리 열기"
    >
      <RiFileList3Line size={20} />
    </button>
  );
}
