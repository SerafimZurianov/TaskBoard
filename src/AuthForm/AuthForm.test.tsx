import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from './AuthForm';
import '@testing-library/jest-dom/vitest';

describe ('AuthForm', () => {
	it('показывает ошибку при несовпадении паролей в режиме регистрации', async () => {
		const user = userEvent.setup();
		render(<AuthForm mode='register' onClose={() => {}} onAuthSuccess={() => {}} />);

		await user.type(screen.getByPlaceholderText('Email'), 'test@test.com');
		await user.type(screen.getByPlaceholderText('Password'), '123456');
		await user.type(screen.getByPlaceholderText('Repeat password'), '654321');
		await user.click(screen.getByRole('button', { name: 'register' }));

		expect(await screen.findByText('The passwords do not match')).toBeInTheDocument();
	});
});