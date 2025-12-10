// // import type { Metadata } from 'next'
// // import { Geist, Geist_Mono } from 'next/font/google'
// // import { Analytics } from '@vercel/analytics/next'
// // import { AuthProvider } from '@/components/auth/auth-context'
// // import './globals.css'

// // const _geist = Geist({ subsets: ["latin"] });
// // const _geistMono = Geist_Mono({ subsets: ["latin"] });

// // export const metadata: Metadata = {
  
// //   icons: {
// //     icon: [
      
// //     ],
// //     apple: '/apple-icon.png',
// //   },
// // }

// // export default function RootLayout({
// //   children,
// // }: Readonly<{
// //   children: React.ReactNode
// // }>) {
// //   return (
// //     <html lang="en">
// //       <body className={`font-sans antialiased`}>
// //         <AuthProvider>
// //           {children}
// //         </AuthProvider>
// //         <Analytics />
// //       </body>
// //     </html>
// //   )
// // }
// import type { Metadata } from 'next'
// import { Analytics } from '@vercel/analytics/next'
// import { AuthProvider } from '@/components/auth/auth-context'
// import './globals.css'

// export const metadata: Metadata = {
//   icons: {
//     icon: [],
//     apple: '/apple-icon.png',
//   },
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={`font-sans antialiased`}>
//         <AuthProvider>
//           {children}
//         </AuthProvider>
//         <Analytics />
//       </body>
//     </html>
//   )
// }
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth/auth-context'
import './globals.css'

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // smooth + readable
})

export const metadata: Metadata = {
  icons: {
    icon: [],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
