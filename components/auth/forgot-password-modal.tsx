"use client";

import { useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/api";

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<"email" | "verify" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------------------------------
  //  STEP 1 — Send OTP to email
  // ------------------------------------------
  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/auth/password/send-code", { email });

      setMessage("OTP sent successfully! Check your email.");
      setStep("verify");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------
  //  STEP 2 — Verify OTP
  // ------------------------------------------
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length < 4) {
      setError("Enter a valid OTP.");
      return;
    }

    setError("");
    setStep("reset");
  };

  // ------------------------------------------
  //  STEP 3 — Reset Password
  // ------------------------------------------
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/password/verify-change", {
        email,
        code,
        newPassword,
      });

      setMessage("Password updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------
  //  UI RENDERING
  // ------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">Forgot Password</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition">
            <X size={24} />
          </button>
        </div>

        {/* STEP 1 — Enter Email */}
        {step === "email" && (
          <form onSubmit={handleGenerateCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 — Verify OTP */}
        {step === "verify" && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Verification Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter OTP from your email"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
            >
              Verify
            </button>
          </form>
        )}

        {/* STEP 3 — New Password */}
        {step === "reset" && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
