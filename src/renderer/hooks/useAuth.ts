import { createContext, ReactNode, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService } from '../services/db.service';
import { User } from '../../shared/types';

interface LoginData {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: ReturnType<typeof useLoginMutation>;
  registerMutation: ReturnType<typeof useRegisterMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const user = await dbService.getUserByUsername(credentials.username);
      if (!user || user.password !== credentials.password) {
        throw new Error('Invalid credentials');
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['currentUser'], user);
    }
  });
}

function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const user = await dbService.createUser(credentials.username, credentials.password);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['currentUser'], user);
    }
  });
}

function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('currentUser');
    },
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
    }
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, error, isLoading } = useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    }
  });

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  return (
    <AuthContext.Provider 
      value={{
        user: user || null,
        isLoading,
        error: error as Error | null,
        loginMutation,
        registerMutation,
        logoutMutation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}