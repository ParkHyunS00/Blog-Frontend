type PostDetailHeaderProps = {
  title: string;
  category: string;
  createdAt: string;
};

export function PostDetailHeader({
  title,
  category,
  createdAt,
}: PostDetailHeaderProps): React.ReactElement {
  return (
    <header className="relative mb-14 pb-14">
      <h1 className="text-center text-2xl font-bold leading-tight md:text-3xl">
        {title}
      </h1>
      <div className="mt-6 flex items-center justify-center gap-5 text-sm text-muted-foreground">
        <span className="text-[#305CEC] dark:text-[#5B7FFF]">{category}</span>
        <span>{createdAt}</span>
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 w-dvw -translate-x-1/2 border-b border-border"
      />
    </header>
  );
}
