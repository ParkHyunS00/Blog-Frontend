type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function TitleInput({ value, onChange }: Props): React.ReactElement {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    onChange(e.target.value);
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="제목을 입력하세요"
      className="w-full border-b border-border bg-transparent py-4 text-3xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-ring md:text-4xl"
    />
  );
}
