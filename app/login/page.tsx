
// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import LoginForm from "@/components/auth/login-form"
// import ForgotPasswordModal from "@/components/auth/forgot-password-modal"

// export default function LoginPage() {
//   const [selectedRole] = useState("Student") // default role
//   const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <Link href="/" className="inline-flex items-center gap-2 mb-6">
//             <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
//               HM
//             </div>
//             <span className="font-bold text-xl text-foreground">HostelConnect</span>
//           </Link>
//           <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
//           <p className="text-muted-foreground">Sign in to your account to continue</p>
//         </div>

//         {/* ⭐ Removed role selection buttons */}

//         <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
//           <LoginForm role={selectedRole} />

//           {selectedRole === "Parent" && (
//             <p className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded">
//               📝 Use your student's USN as email and their password to login as parent and view their complaints.
//             </p>
//           )}
//         </div>

//         <p className="text-center text-muted-foreground mt-6">
//           New user?{" "}
//           <Link href="/signup" className="text-primary font-semibold hover:underline">
//             Create an account
//           </Link>
//         </p>

//         <p className="text-center text-muted-foreground mt-2">
//           <button
//             onClick={() => setIsForgotPasswordModalOpen(true)}
//             className="text-primary font-semibold hover:underline"
//           >
//             Forgot Password?
//           </button>
//         </p>

//         {isForgotPasswordModalOpen && (
//           <ForgotPasswordModal onClose={() => setIsForgotPasswordModalOpen(false)} />
//         )}
//       </div>
//     </div>
//   )
// }
// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import LoginForm from "@/components/auth/login-form"
// import ForgotPasswordModal from "@/components/auth/forgot-password-modal"

// export default function LoginPage() {
//   const [selectedRole] = useState("Student")
//   const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false)
//   const [showParentLogin, setShowParentLogin] = useState(false)

//   const [parentData, setParentData] = useState({
//     usn: "",
//     password: "",
//   })

//   const handleParentChange = (e: any) => {
//     setParentData({ ...parentData, [e.target.name]: e.target.value })
//   }

//   const handleParentLogin = async (e: any) => {
//     e.preventDefault()

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/parent-login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(parentData),
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         alert(data.message || "Invalid credentials")
//         return
//       }

//       // Save token
//       localStorage.setItem("token", data.token)

//       window.location.href = "/dashboard/parent"
//     } catch (err) {
//       console.error("Parent login error:", err)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <Link href="/" className="inline-flex items-center gap-2 mb-6">
//             <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
//               HM
//             </div>
//             <span className="font-bold text-xl text-foreground">HostelConnect</span>
//           </Link>
//           <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
//           <p className="text-muted-foreground">Sign in to your account to continue</p>
//         </div>

//         {/* Normal Login */}
//         <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
//           <LoginForm role={selectedRole} />
//         </div>

//         {/* Parent Login Button */}
//         <p className="text-center mt-4">
//           <button
//             onClick={() => setShowParentLogin(true)}
//             className="text-primary font-semibold hover:underline"
//           >
//             Parent Login
//           </button>
//         </p>

//         {isForgotPasswordModalOpen && (
//           <ForgotPasswordModal onClose={() => setIsForgotPasswordModalOpen(false)} />
//         )}
//       </div>

//       {/* Parent Login Modal */}
//       {showParentLogin && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-card p-6 rounded-lg w-full max-w-sm space-y-4 border border-border">
//             <h2 className="text-xl font-bold text-center">Parent Login</h2>
//             <p className="text-sm text-muted-foreground text-center">
//               Use your student's USN & password
//             </p>

//             <form onSubmit={handleParentLogin} className="space-y-3">
//               <input
//                 type="text"
//                 name="usn"
//                 value={parentData.usn}
//                 onChange={handleParentChange}
//                 placeholder="Student USN"
//                 required
//                 className="w-full px-4 py-2 bg-input border border-border rounded-lg"
//               />

//               <input
//                 type="password"
//                 name="password"
//                 value={parentData.password}
//                 onChange={handleParentChange}
//                 placeholder="Password"
//                 required
//                 className="w-full px-4 py-2 bg-input border border-border rounded-lg"
//               />

//               <button
//                 type="submit"
//                 className="w-full py-2 bg-primary text-white rounded-lg font-semibold"
//               >
//                 Login as Parent
//               </button>
//             </form>

//             <button
//               onClick={() => setShowParentLogin(false)}
//               className="w-full py-2 bg-muted rounded-lg mt-2"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
//========================================================================================\\
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import LoginForm from "@/components/auth/login-form";
// import ForgotPasswordModal from "@/components/auth/forgot-password-modal";

// export default function LoginPage() {
//   const [selectedRole] = useState("Student");
//   const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
//     useState(false);
//   const [showParentLogin, setShowParentLogin] = useState(false);

//   const [parentData, setParentData] = useState({
//     usn: "",
//     password: "",
//   });

//   const handleParentChange = (e: any) => {
//     setParentData({ ...parentData, [e.target.name]: e.target.value });
//   };

//   const handleParentLogin = async (e: any) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/parent-login`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(parentData),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Invalid credentials");
//         return;
//       }

//       // Save token
//       localStorage.setItem("token", data.token);

//       window.location.href = "/dashboard/parent";
//     } catch (err) {
//       console.error("Parent login error:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-md">
//         {/* Logo + Heading */}
//         <div className="text-center mb-8">
//           <Link href="/" className="inline-flex items-center gap-2 mb-6">
//             <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
//               HM
//             </div>
//             <span className="font-bold text-xl text-foreground">
//               HostelConnect
//             </span>
//           </Link>

//           <h1 className="text-3xl font-bold text-foreground mb-2">
//             Welcome Back
//           </h1>
//           <p className="text-muted-foreground">
//             Sign in to your account to continue
//           </p>
//         </div>

//         {/* Main Login Box */}
//         <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
//           <LoginForm role={selectedRole} />
//         </div>

//         {/* Parent Login Button */}
//         <p className="text-center mt-4">
//           <button
//             onClick={() => setShowParentLogin(true)}
//             className="text-primary font-semibold hover:underline"
//           >
//             Parent Login
//           </button>
//         </p>

//         {/* Create NGO Account Link */}
//         <p className="text-center mt-2">
//           <Link
//             href="/signup"
//             className="text-primary font-semibold hover:underline"
//           >
//             Create NGO Account
//           </Link>
//         </p>

//         {/* Forgot Password */}
//         {/* <p className="text-center text-muted-foreground mt-2">
//           <button
//             onClick={() => setIsForgotPasswordModalOpen(true)}
//             className="text-primary font-semibold hover:underline"
//           >
//             Forgot Password?
//           </button>
//         </p>

//         {isForgotPasswordModalOpen && (
//           <ForgotPasswordModal
//             onClose={() => setIsForgotPasswordModalOpen(false)}
//           />
//         )} */}
//       </div>

//       {/* Parent Login Modal */}
//       {showParentLogin && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-card p-6 rounded-lg w-full max-w-sm space-y-4 border border-border">
//             <h2 className="text-xl font-bold text-center">Parent Login</h2>
//             <p className="text-sm text-muted-foreground text-center">
//               Use your student's USN & password
//             </p>

//             <form onSubmit={handleParentLogin} className="space-y-3">
//               <input
//                 type="text"
//                 name="usn"
//                 value={parentData.usn}
//                 onChange={handleParentChange}
//                 placeholder="Student USN"
//                 required
//                 className="w-full px-4 py-2 bg-input border border-border rounded-lg"
//               />

//               <input
//                 type="password"
//                 name="password"
//                 value={parentData.password}
//                 onChange={handleParentChange}
//                 placeholder="Password"
//                 required
//                 className="w-full px-4 py-2 bg-input border border-border rounded-lg"
//               />

//               <button
//                 type="submit"
//                 className="w-full py-2 bg-primary text-white rounded-lg font-semibold"
//               >
//                 Login as Parent
//               </button>
//             </form>

//             <button
//               onClick={() => setShowParentLogin(false)}
//               className="w-full py-2 bg-muted rounded-lg mt-2"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import Link from "next/link";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  const [selectedRole] = useState("Student");
  const [showParentLogin, setShowParentLogin] = useState(false);

  const [parentData, setParentData] = useState({
    usn: "",
    password: "",
  });

  const handleParentChange = (e: any) => {
    setParentData({ ...parentData, [e.target.name]: e.target.value });
  };

  const handleParentLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/parent-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parentData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard/parent";
    } catch (err) {
      console.error("Parent login error:", err);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/images/login.jpeg')" }}
    >
      {/* MAIN GLASS CONTAINER (VERY LIGHT) */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
        
        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
              HM
            </div>
            <span className="font-bold text-xl text-white drop-shadow-md">
              HostelConnect
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
            Welcome Back
          </h1>
          <p className="text-white/90 drop-shadow-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* LOGIN FORM (OPAQUE FOR READABILITY) */}
        <div className="bg-white/95 rounded-lg p-6 shadow-md">
          <LoginForm role={selectedRole} />
        </div>

        {/* Parent Login */}
        <p className="text-center mt-4">
          <button
            onClick={() => setShowParentLogin(true)}
            className="text-white font-semibold hover:underline drop-shadow-sm"
          >
            Parent Login
          </button>
        </p>

        {/* NGO Signup */}
        <p className="text-center mt-2">
          <Link
            href="/signup"
            className="text-white font-semibold hover:underline drop-shadow-sm"
          >
            Create NGO Account
          </Link>
        </p>
      </div>

      {/* PARENT LOGIN MODAL */}
      {showParentLogin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white/95 p-6 rounded-xl w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold text-center mb-1">
              Parent Login
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Use your student's USN & password
            </p>

            <form onSubmit={handleParentLogin} className="space-y-3">
              <input
                type="text"
                name="usn"
                value={parentData.usn}
                onChange={handleParentChange}
                placeholder="Student USN"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />

              <input
                type="password"
                name="password"
                value={parentData.password}
                onChange={handleParentChange}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />

              <button
                type="submit"
                className="w-full py-2 bg-teal-600 text-white rounded-lg font-semibold"
              >
                Login as Parent
              </button>
            </form>

            <button
              onClick={() => setShowParentLogin(false)}
              className="w-full py-2 bg-gray-200 rounded-lg mt-3"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

