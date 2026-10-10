import type { User } from '../types';
import { apiFetch } from './client';

interface AuthResponse {
    token: string,
    user: User
}

export function register(email: string, password: string) {
    return apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

export function login(email: string, password: string) {
    return apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

export function getMe() {
    return apiFetch<User>('/auth/me');
}