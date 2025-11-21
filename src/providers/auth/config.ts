import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma, userRepository, permissionRepository } from '../../lib/prisma';
import { Roles } from '../../lib/permissions/permissions';

export const authOptions: NextAuthOptions = {
  // Don't use adapter due to version conflicts, handle user creation in callbacks instead
  // adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days for web
  },
  
  callbacks: {
    async jwt({ token, user }) {
      // Persist user data to the token
      if (user) {
        token.id = user.id; // This will be the database ID from signIn callback
      }
      return token;
    },
    async session({ session, token }) {
      // Send user data to the client
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        
        // Hydrate permissions into session
        try {
          const userPerms = await permissionRepository.getUserPermissions(token.id as string);
          (session.user as any).permissions = Array.from(userPerms.permissions);
          (session.user as any).roles = userPerms.roles;
        } catch (error) {
          console.error('Error loading user permissions:', error);
          (session.user as any).permissions = [];
          (session.user as any).roles = [];
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Custom sign-in logic - create or update user in database
      console.log('SignIn callback:', { user: user?.email, account: account?.provider });
      
      if (account?.provider === 'google' && user?.email) {
        try {
          // Check if user already exists
          let existingUser = await userRepository.findByEmail(user.email);
          let isFirstUser = false;
          
          if (!existingUser) {
            // Check if this is the first user in the database
            const userCount = await userRepository.count();
            isFirstUser = userCount === 0;
            
            // Create new user
            existingUser = await userRepository.create({
              email: user.email,
              name: user.name || null,
              image: user.image || null,
            });
            console.log('Created new user:', existingUser.email);
            
            // If this is the first user, assign admin role
            if (isFirstUser) {
              const adminRole = await permissionRepository.getRole(Roles.ADMIN);
              
              if (adminRole) {
                await prisma.userRole.create({
                  data: {
                    userId: existingUser.id,
                    roleId: adminRole.id,
                  },
                });
                console.log('✅ First user - assigned admin role to:', existingUser.email);
              } else {
                console.warn('⚠️ Admin role not found in database. Run seed to create roles.');
              }
            }
          } else {
            // Update existing user with latest info from Google
            existingUser = await userRepository.update(existingUser.id, {
              name: user.name || existingUser.name,
              image: user.image || existingUser.image,
            });
            console.log('Updated existing user:', existingUser.email);
          }
          
          // Add the database user ID to the user object for JWT
          user.id = existingUser.id;
        } catch (error) {
          console.error('Error creating/updating user:', error);
          // Still allow sign-in even if database operation fails
        }
      }
      
      return true;
    },
  },
  pages: {
    // Use NextAuth's default sign-in page instead of custom /login
    // signIn: '/login',
    // Remove custom error page to use NextAuth's default error handling with better error info
    // error: '/auth/error',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log successful sign-ins, send welcome emails, etc.
      console.log(`User ${user.email} signed in`);
    },
  },
};

// For NextAuth v4, we don't export auth function directly from config
// Instead, we'll create it in the server utilities
export default NextAuth(authOptions);