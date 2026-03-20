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
    <header className="mb-14 border-b border-border pb-14">
      <h1 className="text-center text-2xl font-bold leading-tight md:text-3xl">
        {title}
      </h1>
      <div className="mt-6 flex items-center justify-center gap-5 text-sm text-muted-foreground">
        <span className="text-[#305CEC] dark:text-[#5B7FFF]">{category}</span>
        <span>{createdAt}</span>
      </div>
    </header>
  );
}
