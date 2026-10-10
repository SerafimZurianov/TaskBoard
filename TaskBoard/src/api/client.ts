const API_URL = 'http://localhost:3001'

export function GetToken() : string | null {
    return localStorage.getItem('token');
}

export async function apiFetch<T>(path: string, options: RequestInit = {}) : Promise<T> {
    const token = GetToken();

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ... (token ? { Authorization: `Bearer ${token}`} : {}),
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.json().catch(() => { error: { 'Unknown error'}});
        throw new Error(error.error || `Error: ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}