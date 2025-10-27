"use client";

import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { toastVariants } from "@/components/ui/toast"

type ToastActionElement = React.ReactElement<
  React.ComponentPropsWithoutRef<"button">
>
type ToastDestructive = boolean

type ToastVariant = VariantProps<typeof toastVariants>["variant"]
interface Toast {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  destructive?: ToastDestructive
  duration?: number
  variant?: ToastVariant
}

interface ToastContextValue {
  toast: (props: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
  toasts: Toast[]
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToastState = {
  toasts: Toast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (id: string, dispatch: React.Dispatch<any>) => {
  const timeout = setTimeout(() => {
    dispatch({ type: "DISMISS_TOAST", id })
  }, TOAST_REMOVE_DELAY)
  toastTimeouts.set(id, timeout)
}

const reducer = (state: ToastState, action: any): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    case "DISMISS_TOAST":
      const { id } = action
      if (id) {
        const timeout = toastTimeouts.get(id)
        if (timeout) {
          clearTimeout(timeout)
        }
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== id),
        }
      }
      return {
        ...state,
        toasts: state.toasts.slice(1),
      }
    case "REMOVE_TOAST":
      if (action.id) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== action.id),
        }
      }
      return {
        ...state,
        toasts: state.toasts.slice(1),
      }
    default:
      return state
  }
}

interface ToastProviderProps {
  children: React.ReactNode
}

function ToastProvider({ children }: ToastProviderProps) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] })

  const toast = React.useCallback(
    ({ duration = 5000, ...props }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast = {
        ...props,
        id,
      }
      dispatch({ type: "ADD_TOAST", toast: newToast })
      setTimeout(() => {
        dispatch({ type: "DISMISS_TOAST", id })
      }, duration)
    },
    []
  )

  const dismiss = React.useCallback((id: string) => {
    dispatch({ type: "DISMISS_TOAST", id })
  }, [])

  return (
    <ToastContext.Provider value={{ ...state, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export { useToast, ToastProvider }
