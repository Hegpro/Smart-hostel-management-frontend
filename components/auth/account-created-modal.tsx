"use client"

import { useState } from "react"
import { X, Copy, Check } from "lucide-react"

interface AccountCreatedModalProps {
  isOpen: boolean
  title: string
  username: string;
  password: string
  isStub: boolean
  onClose: () => void
}

export default function AccountCreatedModal({ isOpen, title, password, isStub, onClose }: AccountCreatedModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {isStub && (
          <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded text-sm text-amber-800">
            (frontend stub — not saved to server)
          </div>
        )}

        <div className="space-y-4">
          <p className="text-muted-foreground">Save this password — it will not be shown again.</p>

          <div className="bg-muted border border-border rounded-lg p-4 font-mono text-sm text-foreground break-all">
            {password}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopyPassword}
              data-testid={`${title === "Student created" ? "chief-student-password-copy" : "manage-warden-password-copy"}`}
              className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
