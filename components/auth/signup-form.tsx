"use client";

import { useState } from "react";
import api from "@/lib/api";

interface SignupFormProps {
  role: string;
}

export default function SignupForm({ role }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be 10 digits");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/ngo/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Full Name/Organization Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          required
        />
      </div>

      {error && (
        <div className="px-4 py-2 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-700 text-sm">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
