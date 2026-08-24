type PostDetailLayoutProps = {
  children: React.ReactNode;
  header: React.ReactNode;
  toc: React.ReactNode;
  tocMobile: React.ReactNode;
};

export function PostDetailLayout({
  children,
  header,
  toc,
  tocMobile,
}: PostDetailLayoutProps): React.ReactElement {
  return (
    <div className="relative w-full pt-24 pb-8">
      <div className="w-full border-b border-border">
        <div className="mx-auto w-full max-w-screen-xl px-4">
          <div className="mx-auto min-w-0 max-w-3xl px-2 sm:px-4 min-[1344px]:px-0">
            {header}
          </div>
        </div>
      </div>
      <div className="relative mx-auto mt-14 w-full max-w-screen-xl px-4">
        <div className="relative">
          <div className="mx-auto min-w-0 max-w-3xl px-2 sm:px-4 min-[1344px]:px-0">{children}</div>
          <div className="absolute top-0 bottom-0 left-[calc(50%+30rem)] hidden min-[1344px]:block">
            {toc}
          </div>
        </div>
      </div>
      {tocMobile}
    </div>
  );
}
