// // src/auth.ts
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "username", type: "text" },
//         password: { label: "password", type: "password" }
//       },
//       async authorize(credentials) {
//         try {
//           const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`, 
//             {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(credentials),

//                 credentials: "include",
//               }
//           );
      
//           if (!res.ok) {
//             const errorData = await res.json();
//             throw new Error(errorData.message || "Failed to authenticate");
//           }
      
//           const data = await res.json();
          
//           if (data.user) {
//             return {
//               ...data.user,
//               groups: data.user.groups.map((g: any) => g.name)
//             };
//           }
//           return null;
//         } catch (error) {
//           console.error("Authentication error:", error);
//           throw new Error("Network error. Please try again.");
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.groups = user.groups;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token.groups) {
//         session.user.groups = token.groups as string[];
//       }
//       return session;
//     }
//   }
// });