type PostDetailLayoutProps = {
  children: React.ReactNode;
  toc: React.ReactNode;
  tocMobile: React.ReactNode;
};

export function PostDetailLayout({
  children,
  toc,
  tocMobile,
}: PostDetailLayoutProps): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-screen-xl lg:gap-8 px-4 pt-24 pb-8">
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-3xl px-2 sm:px-4 lg:px-0">{children}</div>
      </div>
      {toc}
      {tocMobile}
    </div>
  );
}
