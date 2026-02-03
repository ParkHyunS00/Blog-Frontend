import { useState } from "react";
import { Link } from "react-router-dom";
import {
  RiSearchLine,
  RiMoonLine,
  RiSunLine,
  RiKey2Line,
  RiMenuLine,
  RiCloseLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/core/stores/use-theme-store";

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

const Logo = (
  <Link to="/" className="flex-shrink-0">
    <img src="/logo.svg" alt="ParkHyunSOO" className="h-7 dark:invert" />
  </Link>
);

const AdminLink = (
  <Link to="/admin" className={ICON_BUTTON_CLASS} aria-label="로그인">
    <RiKey2Line size={20} />
  </Link>
);

export function Header(): React.ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearchValue(e.target.value);
  }

  function handleMobileMenuToggle(): void {
    setIsMobileMenuOpen((prev) => !prev);
  }

  function handleMobileMenuClose(): void {
    setIsMobileMenuOpen(false);
  }

  const isLightTheme = theme === "light";
  const themeAriaLabel = isLightTheme ? "다크 모드로 전환" : "라이트 모드로 전환";
  const ThemeIcon = isLightTheme ? RiMoonLine : RiSunLine;
  const themeLabel = isLightTheme ? "다크 모드" : "라이트 모드";
  const MenuIcon = isMobileMenuOpen ? RiCloseLine : RiMenuLine;
  const menuAriaLabel = isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background dark:bg-[#1C1D1E]">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        {Logo}

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

          {AdminLink}
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
          "overflow-hidden border-t border-border bg-background transition-all duration-300 md:hidden dark:bg-[#1C1D1E]",
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
            <Link
              to="/admin"
              onClick={handleMobileMenuClose}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-secondary text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              <RiKey2Line size={18} />
              관리자
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
