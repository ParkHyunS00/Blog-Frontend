import { TABLE_THEMES, type TableTheme } from "@/features/post/lib/table-theme";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  value: TableTheme;
  withHeader: boolean;
  onChange: (theme: TableTheme) => void;
};

export function TableThemePicker({ name, value, withHeader, onChange }: Props): React.ReactElement {
  return (
    <fieldset className="mb-4">
      <legend className="mb-2 text-xs font-medium text-muted-foreground">표 테마</legend>
      <div className="grid grid-cols-3 gap-2">
        {TABLE_THEMES.map((theme) => (
          <label key={theme.value} className={cn(
            "min-w-0 cursor-pointer rounded-lg border p-1.5 text-center transition-colors has-focus-visible:outline-2 has-focus-visible:outline-ring",
            value === theme.value ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-secondary",
          )}>
            <input type="radio" name={name} value={theme.value} checked={value === theme.value}
              className="sr-only" onChange={() => onChange(theme.value)} />
            <div className="post-content table-theme-preview" aria-hidden="true">
              <div className="tableWrapper">
                <table data-table-theme={theme.value === "default" ? undefined : theme.value}>
                  <tbody>
                    {[0, 1, 2].map((row) => (
                      <tr key={row}>
                        {[0, 1, 2].map((column) => {
                          const Cell = withHeader && row === 0 ? "th" : "td";
                          return <Cell key={column}><span /></Cell>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <span className="mt-1.5 block text-xs font-medium">{theme.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
