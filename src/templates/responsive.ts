/** Compact preview helpers. Templates are rendered inside a 390px window while
 * the browser viewport stays wide, so CSS media queries do not fire. The
 * TemplatesPage passes `compact` down and these helpers pick mobile values. */

export const cols = (compact: boolean, mobile: number, desktop: number) => compact ? mobile : desktop

export const grid = (compact: boolean, template: string) => compact ? '1fr' : template

export const gap = (compact: boolean, mobile: number, desktop: number) => compact ? mobile : desktop

export const pad = (compact: boolean, mobile: string | number, desktop: string | number) => compact ? mobile : desktop

export const show = (compact: boolean, mobileVisible: boolean) => compact ? (mobileVisible ? 'flex' : 'none') : 'flex'

export const text = (compact: boolean, mobile: number, desktop: number) => compact ? mobile : desktop

export const full = (compact: boolean) => compact ? '100%' : undefined
