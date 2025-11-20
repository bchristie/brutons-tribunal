// Types for User repository operations
export interface UserCreateInput {
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface UserUpdateInput {
  email?: string;
  name?: string | null;
  image?: string | null;
}

export interface UserQueryOptions {
  where?: {
    id?: string;
    email?: string;
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
  createdAt: Date;
  updatedAt: Date;
}