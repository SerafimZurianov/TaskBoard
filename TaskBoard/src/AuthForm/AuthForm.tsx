import React, { useState } from "react";
import { register, login } from "../api/auth";
import type { User } from "../types";
import './AuthForm.css'
import crossIcon from '../images/cross.svg';

export type AuthMode = 'register' | 'login';

interface AuthFormProps {
    mode: AuthMode,
    onClose: () => void,
    onAuthSuccess: (user: User) => void;
}

const MIN_PASSWORD = 6;

const AuthForm = ({ mode, onClose, onAuthSuccess } : AuthFormProps) => {
    const isRegister = mode === 'register';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const validateForm = (): string | null => {
        if (!email.trim() || !password) {
            return 'Fill in all the fields';
        }
        if (isRegister) {
            if (password.length < MIN_PASSWORD) {
                return `The password must be at least ${MIN_PASSWORD} characters long`;
            }
            if (password !== repeatPassword) {
                return 'The passwords do not match'
            }
        }
        return null;
    }

    const handleSumbit = async (event: React.FormEvent) => {
        event.preventDefault();
        const newError = validateForm();

        if (newError) {
            setError(newError);
            return;
        }
        setError(null);

        try {
            const authFu = isRegister ? register : login;
            const response = await authFu(email, password);
            localStorage.setItem('token', response.token);
            onAuthSuccess(response.user);
        } catch (err){
            setError(err instanceof Error ? err.message : 'Error')
        }

    }


    return (
        <div className="authform-owerlay">
            <div className="authform">
                <div className="authform-header">
                    <span className="authform-logo">
                        {isRegister ? 'Register' : 'Login'}
                    </span>
                    <button 
                        className="close-button button"
                        onClick={onClose}
                    >
                        <img className='cross-image' src={crossIcon} alt="Cross"/>
                    </button>
                </div>
                <form className="authform-container" onSubmit={handleSumbit}>
                    <span className="description">Enter Email:</span>
                    <div className="authform-email">
                        <input 
                            className="email-input"
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <span className="description">Enter the password</span>
                    <div className="authform-password">
                        <input
                            className="password-input"
                            type="password" 
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    {isRegister && <span className="description">Repeat the password</span>}
                    {isRegister && <div className="authform-password">
                        <input
                            className="password-input"
                            type="password" 
                            placeholder="Repeat password"
                            onChange={(e) => setRepeatPassword(e.target.value)}/>
                    </div>}
                    {error && <span className="error">{error}</span>}
                    <button 
                        className="button submit-button"
                        type="submit"
                    >{isRegister ? 'register' : 'login'}</button>
                </form>
            </div>
        </div>
    )
}

export default AuthForm;