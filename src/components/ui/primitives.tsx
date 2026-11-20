export function Separator() { return <hr data-slot="separator" /> }
export function Kicker({ children }: { children: React.ReactNode }) { return <div data-slot="kicker">{children}</div> }
