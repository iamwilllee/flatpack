import { Check } from 'lucide-react'

type Step = { title: string; description?: string }
type StepsProps = { steps: Step[]; current: number }

export function Steps({ steps, current }: StepsProps) {
  return (
    <div data-slot="steps">
      {steps.map((step, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'upcoming'
        return (
          <div data-slot="step" data-state={state} key={index}>
            <div data-slot="step-indicator">
              {state === 'done' ? <Check size={16} /> : <span>{index + 1}</span>}
            </div>
            <div data-slot="step-body">
              <div data-slot="step-title">{step.title}</div>
              {step.description && <div data-slot="step-description">{step.description}</div>}
            </div>
            {index < steps.length - 1 && <div data-slot="step-track" aria-hidden="true" />}
          </div>
        )
      })}
    </div>
  )
}
