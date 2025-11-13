// Types for User repository operations
export interface UserCreateInput {
  email: string;
  name?: string;
  image?: string;
  role?: number;
}

export interface UserUpdateInput {
  email?: string;
  name?: string;
  image?: string;
  role?: number;
}

export interface UserQueryOptions {
  where?: {
    id?: string;
    email?: string;
    role?: number;
    name?: {
      contains?: string;
      mode?: 'insensitive';
    };
  };
  orderBy?: {
    createdAt?: 'asc' | 'desc';
    updatedAt?: 'asc' | 'desc';
    email?: 'asc' | 'desc';
    name?: 'asc' | 'desc';
  };
  skip?: number;
  take?: number;
}

// User type definition (matches Prisma schema)
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: number;
  createdAt: Date;
  updatedAt: Date;
}