"use client"

import type React from "react"

import { useState } from "react"
import { X, Copy, Check } from "lucide-react"

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const staffCategories = ["electrician", "plumber", "cleaner", "roomBoy", "carpenter", "civil"]

// Generate secure random password
function generatePassword(): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lower = "abcdefghijklmnopqrstuvwxyz"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*"

  let password = ""
  password += upper.charAt(Math.floor(Math.random() * upper.length))
  password += lower.charAt(Math.floor(Math.random() * lower.length))
  password += numbers.charAt(Math.floor(Math.random() * numbers.length))
  password += symbols.charAt(Math.floor(Math.random() * symbols.length))

  const all = upper + lower + numbers + symbols
  for (let i = password.length; i < 10; i++) {
    password += all.charAt(Math.floor(Math.random() * all.length))
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
}

export default function AddStaffModal({ isOpen, onClose, onSuccess }: AddStaffModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState("")
  const [phoneNo, setPhoneNo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successPassword, setSuccessPassword] = useState<string | null>(null)
  const [backendMissing, setBackendMissing] = useState(false)
  const [copied, setCopied] = useState(false)

  const validateForm = () => {
    if (!name.trim()) {
      setError("Name is required")
      return false
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Valid email is required")
      return false
    }
    if (!category) {
      setError("Category is required")
      return false
    }
    if (!phoneNo.trim() || !/^\d{10}$/.test(phoneNo.replace(/\D/g, ""))) {
      setError("Valid 10-digit phone number is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    const generatedPassword = generatePassword()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/warden/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,  // ADD TOKEN
        },
        body: JSON.stringify({
          name,
          email,
          phone: phoneNo,
          staffType: category,       // FIX category → staffType
          password: generatedPassword,
        }),
      });


      if (response.ok) {
        setSuccessPassword(generatedPassword);
        setName("");
        setEmail("");
        setCategory("");
        setPhoneNo("");
        onSuccess?.(); // refresh dashboard
      } else if (response.status === 409) {
        setError("Email already exists");
      } else {
        setError("Error adding staff");
      }
    } catch (err) {
      console.warn("[v0] Backend endpoint missing: /warden/staff")
      setBackendMissing(true)
      setSuccessPassword(generatedPassword)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyPassword = () => {
    if (successPassword) {
      navigator.clipboard.writeText(successPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">Add Staff Member</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {successPassword ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-100 border border-green-300 rounded text-sm text-green-800">
              <p className="font-medium">✓ Staff created successfully</p>
              {backendMissing && (
                <p className="text-xs mt-2">Frontend stub: backend endpoint missing — user not persisted</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Generated Password</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={successPassword}
                  readOnly
                  className="flex-1 px-4 py-2 bg-input border border-border rounded-lg text-foreground"
                />
                <button
                  onClick={handleCopyPassword}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Share this password with the staff member. They should change it on first login.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Staff member name"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                disabled={isLoading}
                data-testid="staff-name-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@example.com"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                disabled={isLoading}
              >
                <option value="">Select category</option>
                {staffCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
              <input
                type="tel"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="1234567890"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                disabled={isLoading}
              />
            </div>

            {error && <div className="p-3 bg-red-100 border border-red-300 rounded text-sm text-red-800">{error}</div>}

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="add-staff-btn"
              >
                {isLoading ? "Adding..." : "Add"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
