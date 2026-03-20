import type { PostDetail } from "@/features/post/types/post.types";

export const mockPostDetail: PostDetail = {
  id: 1,
  title: "ghostty 터미널을 3개월 사용해본 솔직 후기",
  category: "DX",
  createdAt: "2026.02.01 18:25",
  content: `
    <p>최근 개발자 커뮤니티에서 ghostty라는 터미널 에뮬레이터가 화제입니다. Zig 언어로 작성되었고, GPU 가속 렌더링을 지원하며, 기존 iTerm2나 Alacritty 대비 성능이 크게 향상되었다는 평가를 받고 있죠. 저도 약 3개월 전부터 메인 터미널을 ghostty로 교체하여 실무에서 사용해왔습니다.</p>

    <p>이 글에서는 ghostty를 실제로 사용하면서 느낀 장점과 단점, 설정 방법, 그리고 다른 터미널과의 비교를 솔직하게 공유하려 합니다. 특히 AI 코딩 도구(Claude Code, GitHub Copilot CLI 등)와 함께 사용할 때의 경험에 초점을 맞추었습니다.</p>

    <h2 id="why-ghostty">왜 ghostty를 선택했는가</h2>

    <p>iTerm2를 5년 넘게 사용해왔지만, 최근 들어 몇 가지 불편함이 생기기 시작했습니다. 가장 큰 문제는 <strong><u>Claude Code 같은 AI 에이전트를 병렬로 실행할 때 터미널 렌더링이 눈에 띄게 느려진다는 점</u></strong>이었습니다. 탭을 6~7개 열고 각각에서 에이전트를 실행하면, 출력이 밀리거나 스크롤이 끊기는 현상이 자주 발생했죠.</p>

    <p>동료 개발자가 ghostty를 추천해줬고, "GPU 렌더링이라 출력이 많아도 버벅이지 않는다"는 말에 한번 시도해보기로 했습니다. 처음에는 설정이 좀 낯설었지만, 일주일 정도 적응하니 iTerm2로 돌아갈 수 없게 되었습니다.</p>

    <p>물론 모든 도구가 그렇듯 ghostty도 완벽하지는 않습니다. 아직 초기 단계인 프로젝트이다 보니 부족한 기능도 있고, 특정 환경에서는 오히려 기존 터미널이 더 나은 경우도 있었습니다. 이런 부분들을 아래에서 자세히 다루겠습니다.</p>

    <div data-type="callout">
      <span class="callout-emoji">💡</span>
      <div class="callout-content">
        <p>이 글은 macOS 환경 기준으로 작성되었습니다. Linux에서는 일부 기능이 다르게 동작할 수 있으니, 공식 문서를 함께 참고해주세요.</p>
      </div>
    </div>

    <h2 id="advantages-disadvantages">장점과 단점</h2>

    <blockquote>
      <h3 id="advantages">장점</h3>
    </blockquote>

    <p>ghostty의 가장 큰 장점은 압도적인 렌더링 성능입니다. iTerm2 대비 CPU 사용량이 약 30~40% 낮고, 메모리 사용량도 절반 수준입니다. 체감상으로도 확실히 차이가 나는데, 특히 <strong><u>로그가 빠르게 쏟아지거나 빌드 출력이 많을 때 iTerm2에서는 프레임 드롭이 발생하지만 ghostty에서는 전혀 끊김이 없습니다.</u></strong></p>

    <p>실제로 제가 측정한 결과를 공유하면, 10만 줄의 로그를 <code>cat</code>으로 출력했을 때 iTerm2는 약 4.2초, ghostty는 약 2.5초가 걸렸습니다. 단순히 빨라진 것 뿐만 아니라, 출력 중에도 다른 작업을 할 수 있을 정도로 반응성이 좋았습니다.</p>

    <p>두 번째 장점은 설정 파일의 단순함입니다. ghostty는 단일 설정 파일(<code>~/.config/ghostty/config</code>)로 모든 설정을 관리합니다. TOML이나 JSON이 아닌 독자적인 key-value 형식인데, 직관적이고 군더더기가 없습니다. iTerm2의 복잡한 프로파일 시스템에 비하면 훨씬 관리하기 쉽습니다.</p>

    <p>세 번째로, <mark>네이티브 macOS 탭과 분할 화면을 완벽하게 지원합니다.</mark> tmux 없이도 터미널 내에서 화면을 자유롭게 분할할 수 있고, macOS의 네이티브 탭 시스템과 통합되어 있어서 Mission Control이나 Stage Manager에서도 자연스럽게 동작합니다.</p>

    <blockquote>
      <h3 id="disadvantages">단점</h3>
    </blockquote>

    <p>MacOS 기준 2026년 2월 현재, <strong><u>ghostty는 아직 검색 기능(Ctrl+F / Cmd+F)이 없습니다.</u></strong> 터미널 출력에서 특정 텍스트를 찾아야 할 때 상당히 불편합니다. 저는 이 문제를 우회하기 위해 출력을 파일로 리다이렉션하거나, tmux의 검색 기능을 활용하고 있습니다.</p>

    <p>다행히 리눅스 버전에서는 이미 검색 기능이 구현되었고(<code>ghostty 1.3</code>), macOS도 2026년 상반기 중으로 지원될 예정이라고 합니다. 이 기능만 추가되면 사실상 iTerm2를 완전히 대체할 수 있을 것으로 기대합니다.</p>

    <p>또 다른 단점은 <mark>플러그인이나 확장 생태계가 아직 존재하지 않는다는 점입니다.</mark> iTerm2의 Python API나 Shell Integration 같은 고급 기능을 활용하고 있었다면, ghostty로의 전환이 쉽지 않을 수 있습니다. 물론 ghostty도 Shell Integration을 지원하지만, iTerm2만큼 성숙하지는 않습니다.</p>

    <p>마지막으로, 한글 입력 시 가끔 글자가 깨지는 현상이 있습니다. 한글을 조합하는 도중에 빠르게 다른 키를 입력하면 조합이 풀리는 경우가 있는데, 일상적인 사용에서는 크게 문제되지 않지만 알아두면 좋습니다.</p>

    <h2 id="configuration">설정 가이드</h2>

    <h3 id="config-file">설정 파일 구조</h3>

    <p>ghostty의 설정은 <code>~/.config/ghostty/config</code> 파일 하나로 관리됩니다. 별도의 GUI 설정 화면 없이 텍스트 에디터로 직접 수정하는 방식입니다. 처음에는 불편하게 느껴질 수 있지만, 익숙해지면 오히려 설정을 Git으로 관리할 수 있어서 더 편리합니다.</p>

    <p>기본적인 설정 예시를 보여드리겠습니다. 폰트, 테마, 창 크기 등 자주 변경하는 옵션들입니다. 각 옵션은 <code>key = value</code> 형태로 작성하며, 주석은 <code>#</code>으로 시작합니다.</p>

    <pre><code class="language-bash">$ cat ~/.config/ghostty/config
window-theme = dark
theme = dark:Catppuccin Mocha,light:Catppuccin Latte
keybind = super+left=previous_tab
keybind = super+right=next_tab
split-divider-color = #ff6600</code></pre>

    <p>설정 파일을 수정한 후에는 터미널을 재시작하거나, <code>ghostty +reload-config</code> 명령어로 즉시 반영할 수 있습니다. 실시간 리로드가 되기 때문에 폰트나 테마를 실험할 때 매우 편리합니다.</p>

    <h3 id="shortcut-keys">단축키 설정</h3>

    <p>ghostty는 기본 단축키가 macOS 네이티브 앱과 유사하게 설정되어 있습니다. <code>Cmd+T</code>로 새 탭, <code>Cmd+D</code>로 화면 분할, <code>Cmd+W</code>로 탭 닫기 등 직관적인 구성입니다.</p>

    <p>커스텀 단축키도 설정 파일에서 지정할 수 있습니다. 저는 tmux와 비슷한 키바인딩을 선호해서, <code>Ctrl+B</code> 프리픽스 기반의 단축키를 설정해서 사용하고 있습니다. 화면 분할 이동이나 탭 전환을 키보드만으로 빠르게 할 수 있어서 마우스 사용을 최소화할 수 있습니다.</p>

    <p><strong><u>특히 유용한 단축키는 <code>Cmd+Shift+Enter</code>로 현재 패널을 전체 화면으로 토글하는 기능입니다.</u></strong> 분할 화면에서 작업하다가 특정 패널의 출력을 자세히 보고 싶을 때 자주 사용합니다. 다시 누르면 원래 레이아웃으로 돌아옵니다.</p>

    <div data-type="callout">
      <span class="callout-emoji">⚠️</span>
      <div class="callout-content">
        <p>단축키를 커스터마이징할 때 기존 시스템 단축키와 충돌하지 않도록 주의하세요. 충돌이 발생하면 ghostty 단축키가 무시될 수 있습니다.</p>
      </div>
    </div>

    <h2 id="dark-mode">다크모드 설정</h2>

    <h3 id="theme-change">테마 변경</h3>

    <p>ghostty는 내장 테마를 다수 포함하고 있으며, 커스텀 테마도 쉽게 적용할 수 있습니다. 아래는 자동 테마 전환 설정 예시입니다.</p>

    <pre><code class="language-typescript">// theme-config.ts
interface ThemeConfig {
  light: string;
  dark: string;
  autoSwitch: boolean;
}

const ghosttyTheme: ThemeConfig = {
  light: "Catppuccin Latte",
  dark: "Catppuccin Mocha",
  autoSwitch: true,
};

export function getThemeCommand(config: ThemeConfig): string {
  if (config.autoSwitch) {
    return \`theme = dark:\${config.dark},light:\${config.light}\`;
  }
  return \`theme = \${config.dark}\`;
}</code></pre>

    <p>ghostty는 내장 테마를 다수 포함하고 있으며, 커스텀 테마도 쉽게 적용할 수 있습니다. 설정 파일에서 <code>theme</code> 옵션으로 내장 테마를 선택하거나, 직접 색상 값을 지정할 수 있습니다.</p>

    <p>저는 개인적으로 <mark>Catppuccin Mocha 테마를 기본으로 사용하면서, 배경 투명도를 약간 조절하여 사용하고 있습니다.</mark> ghostty는 macOS의 vibrancy 효과를 네이티브로 지원하기 때문에, 배경을 반투명으로 설정하면 다른 앱 위에서 자연스럽게 블렌딩되는 효과를 얻을 수 있습니다.</p>

    <p>주의할 점은, 배경 투명도를 너무 높이면 텍스트 가독성이 떨어질 수 있다는 것입니다. 저는 <code>background-opacity = 0.92</code> 정도로 설정하여 약간의 투명 효과만 주고 있습니다. 이 정도면 가독성을 해치지 않으면서도 시각적으로 세련된 느낌을 줍니다.</p>

    <h3 id="auto-theme-switch">자동 테마 전환</h3>

    <p>ghostty의 킬러 기능 중 하나는 <strong><u>macOS의 다크모드 전환을 감지하여 자동으로 테마를 변경하는 기능입니다.</u></strong> 라이트 테마와 다크 테마를 각각 지정해두면, 시스템 설정이 바뀔 때 터미널 테마도 자동으로 전환됩니다.</p>

    <p>이 기능이 유용한 이유는, 낮에는 밝은 환경에서 라이트 테마로 작업하고 저녁에는 다크 테마로 자동 전환되기 때문입니다. macOS의 자동 다크모드 스케줄과 결합하면 별도의 설정 없이도 시간대에 맞는 테마를 사용할 수 있습니다.</p>

    <p>iTerm2에서도 비슷한 기능이 있었지만, 프로파일 기반으로 동작해서 설정이 복잡했습니다. ghostty는 설정 파일 두 줄이면 끝나기 때문에 훨씬 간편합니다.</p>

    <h2 id="ai-tools-integration">AI 코딩 도구와의 시너지</h2>

    <h3 id="claude-code-experience">Claude Code 사용 경험</h3>

    <p>제가 ghostty로 전환한 가장 큰 이유가 바로 Claude Code 때문입니다. Claude Code는 터미널에서 동작하는 AI 코딩 에이전트인데, <strong><u>출력량이 상당히 많고 실시간으로 스트리밍되기 때문에 터미널의 렌더링 성능이 직접적으로 사용 경험에 영향을 줍니다.</u></strong></p>

    <p>iTerm2에서 Claude Code를 사용할 때는 긴 응답이 출력되는 동안 터미널이 잠시 멈추거나, 스크롤이 뚝뚝 끊기는 느낌이 있었습니다. 특히 코드 블록이 포함된 긴 응답에서 이런 현상이 두드러졌죠. ghostty로 바꾸고 나서는 이런 문제가 완전히 사라졌습니다.</p>

    <p>또한 <mark>여러 프로젝트에서 동시에 Claude Code를 실행하는 "병렬 에이전트" 워크플로우를 사용할 때, ghostty의 장점이 극대화됩니다.</mark> 6개 탭에서 각각 에이전트를 실행해도 모든 탭이 부드럽게 동작합니다. iTerm2에서는 3개만 넘어가도 눈에 띄게 느려졌던 것과 대조적입니다.</p>

    <p>다만 Claude Code의 대화 내역을 검색하고 싶을 때 ghostty에 검색 기능이 없다는 것이 아쉽습니다. 이때는 Claude Code 자체의 대화 이력 기능을 활용하거나, <code>script</code> 명령어로 세션을 기록해두는 방법을 사용합니다.</p>

    <h3 id="copilot-cli-experience">GitHub Copilot CLI 경험</h3>

    <p>GitHub Copilot CLI도 ghostty에서 잘 동작합니다. 명령어 제안이 인라인으로 표시되는데, 렌더링이 빠르다 보니 제안이 나타나는 속도체감이 더 빠르게 느껴집니다. 실제로 빨라진 건지 체감의 차이인지는 모르겠지만, 확실히 더 쾌적한 경험입니다.</p>

    <p>한 가지 팁을 드리자면, ghostty에서 Copilot CLI의 고스트 텍스트(회색으로 표시되는 제안)가 잘 보이도록 터미널 테마의 회색 계열 색상을 조절하는 것이 좋습니다. 기본 테마에서는 제안 텍스트가 너무 어둡게 보여서 놓치기 쉬운 경우가 있습니다.</p>

    <h2 id="conclusion">결론</h2>

    <p>3개월간 ghostty를 메인 터미널로 사용한 결론은, <strong><u>AI 코딩 도구를 적극적으로 사용하는 개발자라면 ghostty로의 전환을 강력히 추천한다</u></strong>는 것입니다. 렌더링 성능의 차이는 단순히 "빠르다"를 넘어서 작업 흐름 자체를 바꿔줍니다.</p>

    <p>물론 검색 기능 부재나 플러그인 생태계 부족 같은 단점이 있지만, 이는 시간이 해결해줄 문제입니다. ghostty 프로젝트는 활발하게 개발되고 있고, 커뮤니티의 관심도 점점 커지고 있습니다.</p>

    <p><mark>만약 현재 터미널에서 AI 도구 사용 시 렌더링 지연이나 버벅임을 느끼고 있다면, ghostty를 한번 시도해보세요.</mark> 일주일만 사용해보면 이전 터미널로 돌아가기 어려울 것입니다. 설정이 어렵게 느껴진다면, 위에서 소개한 기본 설정만으로도 충분히 쾌적한 환경을 구성할 수 있습니다.</p>
  `,
};

export function findPostDetailById(id: number): PostDetail | undefined {
  if (mockPostDetail.id === id) {
    return mockPostDetail;
  }
  return undefined;
}
