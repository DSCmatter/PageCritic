// src/context/AuthContext.ts

import { createContext } from 'react';
import type { AuthContextType } from './AuthContext.tsx';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);