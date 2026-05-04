import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RiSearchLine,
  RiMoonLine,
  RiSunLine,
  RiKey2Line,
  RiMenuLine,
  RiCloseLine,
  RiQuillPenLine,
  RiLogoutBoxLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useThemeStore } from "@/core/stores/use-theme-store";
import { useCategoryStore } from "@/core/stores/use-category-store";
import { useAuthStatus } from "@/features/admin-auth/hooks/queries/use-auth-status";
import { useLogoutMutation } from "@/features/admin-auth/hooks/mutations/use-logout-mutation";

const NAV_ITEMS = [
  { label: "ABOUT", path: "/about" },
  { label: "POST", path: "/posts" },
] as const;

const NAV_LINK_CLASS =
  "text-sm font-medium text-[#666666] transition-colors hover:font-bold hover:underline hover:decoration-[#305CEC] hover:decoration-2 hover:underline-offset-8 dark:text-[#9C9C9C] dark:hover:decoration-[#5B7FFF]";

const MOBILE_NAV_LINK_CLASS =
  "rounded-lg px-3 py-2 text-sm font-medium text-[#666666] transition-colors hover:bg-secondary hover:font-bold hover:underline hover:decoration-[#305CEC] hover:decoration-2 hover:underline-offset-8 dark:text-[#9C9C9C] dark:hover:decoration-[#5B7FFF]";

const ICON_BUTTON_CLASS =
  "flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground";

const SEARCH_ICON_CLASS =
  "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground";

const WritePostLink = (
  <Link to="/posts/write" className={ICON_BUTTON_CLASS} aria-label="게시글 작성">
    <RiQuillPenLine size={20} />
  </Link>
);

export function Header(): React.ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const isLightTheme = useThemeStore((state) => state.theme === "light");
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { data: authStatus } = useAuthStatus();
  const isAuthenticated = authStatus?.step === "AUTHENTICATED";
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  function handleLogoClick(): void {
    useCategoryStore.getState().setSelectedCategory("ALL");
  }

  function handleLogin(): void {
    navigate("/admin");
  }

  function handleLogout(): void {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/", { replace: true }),
    });
  }

  function handleMobileLogin(): void {
    handleLogin();
    handleMobileMenuClose();
  }

  function handleMobileLogout(): void {
    handleLogout();
    handleMobileMenuClose();
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearchValue(e.target.value);
  }

  function handleMobileMenuToggle(): void {
    setIsMobileMenuOpen((prev) => !prev);
  }

  function handleMobileMenuClose(): void {
    setIsMobileMenuOpen(false);
  }

  const themeAriaLabel = isLightTheme ? "다크 모드로 전환" : "라이트 모드로 전환";
  const ThemeIcon = isLightTheme ? RiMoonLine : RiSunLine;
  const themeLabel = isLightTheme ? "다크 모드" : "라이트 모드";
  const MenuIcon = isMobileMenuOpen ? RiCloseLine : RiMenuLine;
  const menuAriaLabel = isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background ">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        <Link to="/" className="flex-shrink-0" onClick={handleLogoClick}>
          <img src="/logo.svg" alt="ParkHyunSOO" className="h-7 dark:invert" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-8">
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} to={item.path} className={NAV_LINK_CLASS}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Search Input */}
          <div className="relative mr-8">
            <RiSearchLine size={18} className={SEARCH_ICON_CLASS} />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder=""
              className="h-9 w-52 rounded-full bg-secondary pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={ICON_BUTTON_CLASS}
            aria-label={themeAriaLabel}
          >
            <ThemeIcon size={20} />
          </button>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={ICON_BUTTON_CLASS}
                aria-label="계정 메뉴"
              >
                <RiKey2Line size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {isAuthenticated ? (
                <DropdownMenuItem onSelect={handleLogout}>
                  <RiLogoutBoxLine size={16} />
                  로그아웃
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={handleLogin}>
                  <RiKey2Line size={16} />
                  로그인
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {isAuthenticated && WritePostLink}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={handleMobileMenuToggle}
          className={cn(ICON_BUTTON_CLASS, "md:hidden")}
          aria-label={menuAriaLabel}
        >
          <MenuIcon size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background transition-all duration-300 md:hidden ",
          isMobileMenuOpen ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <div className="space-y-4 px-4 py-4">
          {/* Mobile Search */}
          <div className="relative">
            <RiSearchLine size={18} className={SEARCH_ICON_CLASS} />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              className="h-10 w-full rounded-full bg-secondary pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Mobile Navigation */}
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMobileMenuClose}
                className={MOBILE_NAV_LINK_CLASS}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-secondary text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              <ThemeIcon size={18} />
              {themeLabel}
            </button>
            {isAuthenticated && (
              <Link
                to="/posts/write"
                onClick={handleMobileMenuClose}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-secondary text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                <RiQuillPenLine size={18} />
                글쓰기
              </Link>
            )}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleMobileLogout}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-secondary text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                <RiLogoutBoxLine size={18} />
                로그아웃
              </button>
            ) : (
              <button
                type="button"
                onClick={handleMobileLogin}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-secondary text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                <RiKey2Line size={18} />
                로그인
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
