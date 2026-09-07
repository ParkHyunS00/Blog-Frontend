import { RiGithubFill, RiMailLine } from "@remixicon/react";
import { useDocumentDescription } from "@/core/seo/use-document-description";

const INTERESTS = [
  {
    name: "Web",
    description: "웹 서비스의 구조와 흐름, API 설계와 성능 개선",
  },
  {
    name: "AI",
    description: "AI를 활용한 생산성 향상과 최신 기술 트렌드",
  },
  {
    name: "Infrastructure",
    description: "애플리케이션을 뒷받침하는 서버 환경과 인프라 구축",
  },
] as const;

const CONTACT_LINK_CLASS =
  "inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function AboutPage(): React.ReactElement {
  useDocumentDescription(
    "개발자 박현수를 소개합니다. 개발자가 된 이야기와 Web, AI, Infrastructure에 대한 관심사를 담았습니다.",
  );

  return (
    <article className="mx-auto w-full max-w-3xl px-6 pt-12 sm:px-8 sm:pt-20">
      <header className="flex flex-col items-center text-center">
        <img
          src="/me.webp"
          alt="노트북을 사용하는 캐릭터 일러스트"
          width={1209}
          height={1301}
          className="h-52 w-52 rounded-full bg-white object-contain p-5 sm:h-64 sm:w-64 dark:brightness-[0.85] dark:saturate-[0.8]"
          fetchPriority="high"
        />
        <h1 className="mt-8 text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl">
          <span className="block sm:inline">안녕하세요, </span>
          <span className="block sm:inline">개발자 박현수입니다.</span>
        </h1>
        <div className="mt-4 flex items-center justify-center gap-5">
          <a
            href="https://github.com/ParkHyunS00"
            target="_blank"
            rel="noopener noreferrer"
            className={CONTACT_LINK_CLASS}
          >
            <RiGithubFill size={20} aria-hidden="true" />
            GitHub
          </a>
          <a href="mailto:parkhyuns00@naver.com" className={CONTACT_LINK_CLASS}>
            <RiMailLine size={20} aria-hidden="true" />
            Email
          </a>
        </div>
      </header>

      <section aria-labelledby="about-introduction" className="mt-12 border-t border-border pt-10 sm:mt-16 sm:pt-12">
        <h2 id="about-introduction" className="text-xl font-bold tracking-tight text-foreground">
          소개
        </h2>
        <div className="mt-6 space-y-5 break-keep text-base leading-8 text-foreground/80">
          <p>
            수학이 싫어 도망치듯 선택해 컴퓨터공학을 전공했지만 평소 아무 생각 없이 사용하던 서비스들이 어떻게
            움직이는지 알아가는 과정은 생각보다 재밌었습니다.
          </p>
          <p>
            그렇게 하나씩 이해하다 보니 기술이 누군가의 불편을 덜고 일상을 조금 더 나아지게 만들 수 있다는 매력에
            개발자가 되었습니다.
          </p>
          <p>
            앞으로도 모르는 것을 궁금해하고 배운 것을 다시 돌아보며 오래 성장하고 싶습니다. 시간이 흐른 뒤에도 여전히
            새로운 것을 배우는 일이 즐거운 사람이면 좋겠습니다.
          </p>
          <p>훗날 이 기록들이 제가 어디에서 출발해 어디까지 왔는지를 보여주는 작은 지도처럼 남아 있기를 바랍니다.</p>
        </div>
      </section>

      <section aria-labelledby="about-interests" className="mt-12 sm:mt-16">
        <h2 id="about-interests" className="text-xl font-bold tracking-tight text-foreground">
          관심사
        </h2>
        <dl className="mt-6 divide-y divide-border">
          {INTERESTS.map(({ name, description }) => (
            <div key={name} className="grid gap-2 py-5 first:pt-0 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-base font-semibold leading-8 text-[#305CEC] dark:text-[#5B7FFF]">{name}</dt>
              <dd className="break-keep text-base leading-8 text-foreground/80">{description}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
