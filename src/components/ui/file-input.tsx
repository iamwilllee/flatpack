import * as React from 'react'
import { Upload, File as FileIcon, X } from 'lucide-react'

export type FileInputProps = {
  accept?: string
  multiple?: boolean
  /** Bytes. Larger files are rejected and reported through onReject. */
  maxSize?: number
  title?: React.ReactNode
  hint?: React.ReactNode
  disabled?: boolean
  /** Controlled list (`value` + `onFilesChange`) or uncontrolled. */
  value?: File[]
  onFilesChange?: (files: File[]) => void
  onReject?: (files: File[]) => void
  /** The chosen files are also set on the real <input>, so a surrounding <form> submits them under this name. */
  name?: string
  id?: string
  required?: boolean
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  /** Accessible name of each remove button, for localized products. */
  removeLabel?: (fileName: string) => string
}

const size = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`)

/** Drop zone plus a file list. Click or drop; it only collects files, uploading is up to you. */
export function FileInput({
  accept, multiple, maxSize, title = 'Drop files here or click to browse', hint, disabled, value, onFilesChange, onReject,
  name, id, required, className, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, removeLabel = (n) => `Remove ${n}`,
}: FileInputProps) {
  const [inner, setInner] = React.useState<File[]>([])
  const files = value ?? inner
  const [dragging, setDragging] = React.useState(false)
  const input = React.useRef<HTMLInputElement>(null)

  const commit = (next: File[]) => {
    if (value === undefined) setInner(next)
    onFilesChange?.(next)
  }
  // Keep the real input in step with the list so native form submission and validation see it.
  React.useEffect(() => {
    const el = input.current
    if (!el || typeof DataTransfer === 'undefined') return
    const dt = new DataTransfer()
    files.forEach((f) => dt.items.add(f))
    el.files = dt.files
  }, [files])

  const add = (list: FileList | null) => {
    if (!list) return
    const all = Array.from(list)
    const ok = all.filter((f) => !maxSize || f.size <= maxSize)
    const bad = all.filter((f) => maxSize && f.size > maxSize)
    if (bad.length) onReject?.(bad)
    commit(multiple ? [...files, ...ok] : ok.slice(0, 1))
  }
  const remove = (i: number) => commit(files.filter((_, j) => j !== i))

  return (
    <div style={{ width: '100%' }} className={className}>
      <label
        data-slot="file-input"
        data-dragging={dragging}
        aria-disabled={disabled}
        style={disabled ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); add(e.dataTransfer.files) }}
      >
        <Upload size={16} />
        <span data-slot="file-input-title">{title}</span>
        {hint && <span>{hint}</span>}
        <input
          ref={input}
          type="file"
          id={id}
          name={name}
          required={required}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => add(e.target.files)}
        />
      </label>
      {files.length > 0 && (
        <ul data-slot="file-list">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} data-slot="file-list-item">
              <FileIcon size={16} />
              <span>{f.name}</span>
              <span data-slot="file-list-size">{size(f.size)}</span>
              <button type="button" data-slot="button" data-variant="ghost" data-size="icon" aria-label={removeLabel(f.name)} onClick={() => remove(i)} style={{ width: 'var(--fp-control-sm)', height: 'var(--fp-control-sm)' }}><X size={16} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
