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
  onFilesChange?: (files: File[]) => void
  onReject?: (files: File[]) => void
}

const size = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`)

/** Drop zone plus a file list. Click or drop; it only collects files, uploading is up to you. */
export function FileInput({ accept, multiple, maxSize, title = 'Drop files here or click to browse', hint, disabled, onFilesChange, onReject }: FileInputProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [dragging, setDragging] = React.useState(false)

  const add = (list: FileList | null) => {
    if (!list) return
    const all = Array.from(list)
    const ok = all.filter((f) => !maxSize || f.size <= maxSize)
    const bad = all.filter((f) => maxSize && f.size > maxSize)
    if (bad.length) onReject?.(bad)
    const next = multiple ? [...files, ...ok] : ok.slice(0, 1)
    setFiles(next)
    onFilesChange?.(next)
  }
  const remove = (i: number) => {
    const next = files.filter((_, j) => j !== i)
    setFiles(next)
    onFilesChange?.(next)
  }

  return (
    <div style={{ width: '100%' }}>
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
        <input type="file" accept={accept} multiple={multiple} disabled={disabled} onChange={(e) => { add(e.target.files); e.target.value = '' }} />
      </label>
      {files.length > 0 && (
        <ul data-slot="file-list">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} data-slot="file-list-item">
              <FileIcon size={16} />
              <span>{f.name}</span>
              <span data-slot="file-list-size">{size(f.size)}</span>
              <button type="button" data-slot="button" data-variant="ghost" data-size="icon" aria-label={`Remove ${f.name}`} onClick={() => remove(i)} style={{ width: 'var(--fp-control-sm)', height: 'var(--fp-control-sm)' }}><X size={16} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
