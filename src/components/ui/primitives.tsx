import * as React from 'react'

/** A plain 1px horizontal rule. For a labelled or vertical rule, use Divider. */
export function Separator(props: React.HTMLAttributes<HTMLHRElement>) { return <hr data-slot="separator" {...props} /> }
/** The grey line above a heading. */
export function Kicker(props: React.HTMLAttributes<HTMLDivElement>) { return <div data-slot="kicker" {...props} /> }
