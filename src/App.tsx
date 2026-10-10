import { useState } from 'react';
import './App.css';
// import userAvatar from './images/UserIcon.png';
import TaskModal from './TaskModal/TaskModal.tsx';
import ActionWindow from './ActionWindow/ActionWindow.tsx';
import TaskCreate from './TaskCreate/TaskCreate.tsx';
import AuthForm from './AuthForm/AuthForm.tsx';
import type { Task } from './types.ts';
import type { AuthMode } from './AuthForm/AuthForm.tsx';
import { getTask, deleteTask, freezeTask, createTask } from './api/tasks.ts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetToken } from './api/client.ts';
import { getMe } from './api/auth.ts';


function App() {
	const [isModalOpen, SetIsModalOpen] = useState<boolean>(false);
	const [authMode, setAuthMode] = useState<AuthMode | null>(null);
	const [actionDelete, setActionDelete] = useState<Task | null>(null);
	const [actionMessenge, setActionMessenge] = useState<string>('');

	const queryClient = useQueryClient();

	const { data: user } = useQuery({
		queryKey: ['me'],
		queryFn: getMe,
		enabled: !!GetToken(),
		retry: false
	});

	const isAuthenticated = !!GetToken();

	const { data: tasks = [], isLoading, isError, error} = useQuery({
		queryKey: ['tasks'],
		queryFn: getTask,
		enabled: isAuthenticated,
	});

	const createMutation = useMutation({
		mutationFn: createTask,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks']})
	});

	const deleteMutation = useMutation({
		mutationFn: deleteTask,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks']})
	});

	const freezeMutation = useMutation({
		mutationFn: freezeTask,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks']})
	});

	const activeTask = tasks.filter(( t: Task) => !t.isFrozen);

	const frozenTask = tasks.filter(( t: Task) => t.isFrozen);

	const onConfirmAction = () => {
		if (!actionDelete) return;
		deleteMutation.mutate(actionDelete.id);
		setActionDelete(null);
	};

	const onCloseAction = () => {
		
		setActionDelete(null);
	};

	const reqestDeleteTask = (id: string, messenge: string) => {
		const task = tasks.find(t => t.id === id);
		if (task) {
			setActionDelete(task);
			setActionMessenge(messenge);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		queryClient.setQueryData(['me'], null);
		queryClient.removeQueries({ queryKey: ['tasks'] });
	};

	return (
		<main className='main'>
			<header className='header'>
				<div className='header__inner'>
					<h1 className='logo'>TaskBoard</h1>
					<div className='user-info'>
						{user ? <div className='user-login'>
							<span className='user-email'>{user.email}</span>
							<button 
								className='button'
								onClick={handleLogout}
								>
							Log out</button>
						</div>
						:<div className='user__buttons'>
							<button className='button' onClick={() => {setAuthMode('register')}}>Register</button>
							<button className='button' onClick={() => {setAuthMode('login')}}>Login</button>
						</div>}
					</div>
				</div>
			</header>
			
			<section className='main__options'>
				<div className='options__inner'>
					<button 
						className='button'
						onClick={() => {
							user ? SetIsModalOpen(true) : setAuthMode('login');
						}}
					>create task</button>
				</div>
			</section>

			<section className='main__boards'>
				<div className='container'>
					<div className='boards__inner'>
						<div className='boards__active board'>
							<div className='active-header board-header'>Main Board</div>
							<div className='active-container board-container'>
								{!isAuthenticated && <span className='message'>Log in to see your tasks</span>}
								{isAuthenticated && isLoading && <span className='message'>Loading...</span>}
								{isAuthenticated && isError && <span className='error'>
									{error instanceof Error ? error.message : 'The tasks could not be loaded'}
									</span>}
								{isAuthenticated && !isLoading && !isError && activeTask.length === 0 &&
									<span className='message'>There are no active tasks yet</span>}
								{activeTask.map(task => (
									<TaskCreate
										key={task.id}
										id = {task.id}
										taskName={task.taskName}
										taskInfo={task.taskInfo}
										taskDeadline={task.taskDeadline}
										onDelete = {(id, message) => reqestDeleteTask(id, message)}
										onFreeze={(id) => freezeMutation.mutate(id)}
										isFreeze = {false}
										frozenAt = {task.frozenAt}
										/>
								))}
							</div>
						</div>
						<div className='boards__freeze board'>
							<div className='freeze-header board-header'> Freeze Board</div>
							<div className='freeze-container board-container'>
								{isAuthenticated && frozenTask.length === 0 && <span className='message'>There are no freeze tasks yet</span>}
								{frozenTask.map(task => (
									<TaskCreate
										key={task.id}
										id = {task.id}
										taskName={task.taskName}
										taskInfo={task.taskInfo}
										taskDeadline={task.taskDeadline}
										onDelete = {(id) => deleteMutation.mutate(id)}
										onFreeze={(id) => freezeMutation.mutate(id)}
										isFreeze = {true}
										frozenAt={task.frozenAt}
										/>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
			{isModalOpen &&  <TaskModal 
				setIsOpen = {SetIsModalOpen}
				OnCreateTask = {(id) => createMutation.mutate(id)}
				submitError = {createMutation.isError ? (createMutation.error as Error).message : null}/>}
			
			{actionDelete && <ActionWindow 
				taskName = {actionDelete.taskName}
				OnClose = {onCloseAction}
				OnConfirm={onConfirmAction}
				messenge = {actionMessenge}
				/>}
			{authMode && <AuthForm
				mode = {authMode}
				onClose = {() => setAuthMode(null)}
				onAuthSuccess = {(user) => {
					queryClient.setQueryData(['me'], user)
					setAuthMode(null)}}
			/>}
		</main>
	);
}

export default App;
