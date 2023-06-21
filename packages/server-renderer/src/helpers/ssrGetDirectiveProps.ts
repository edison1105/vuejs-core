import {
  ComponentPublicInstance,
  Directive,
  mergeProps
} from '@vue/runtime-core'
import { escapeHtml } from '@vue/shared'

type DirType = {
  dir: Directive
  value?: any
  arg?: string
  modifiers: Record<string, boolean>
}

export function ssrGetDirectiveProps(
  instance: ComponentPublicInstance,
  tag: string,
  dirs: DirType[]
): [string | undefined, Record<string, any>] {
  const dirProps: Record<string, any> = {}

  dirs.forEach(({ dir, value, arg, modifiers = {} }) => {
    if (typeof dir !== 'function' && dir.getSSRProps) {
      return mergeProps(
        dirProps,
        dir.getSSRProps(
          {
            dir,
            instance,
            value,
            oldValue: undefined,
            arg,
            modifiers
          },
          null as any
        ) as Record<string, any>
      )
    }
  })

  let childrenOverride: string | undefined
  if (dirProps) {
    if (dirProps.innerHTML) {
      childrenOverride = dirProps.innerHTML
    } else if (dirProps.textContent) {
      childrenOverride = escapeHtml(dirProps.textContent)
    } else if (tag === 'textarea' && dirProps.value) {
      childrenOverride = escapeHtml(dirProps.value)
    }
  }

  return [childrenOverride, dirProps]
}
