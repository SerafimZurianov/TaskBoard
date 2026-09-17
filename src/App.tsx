import { useState } from 'react';
import './App.css';
// import userAvatar from './images/UserIcon.png';
import TaskModal from './TaskModal/TaskModal.tsx';
import ActionWindow from './ActionWindow/ActionWindow.tsx';
import TaskCreate from './TaskCreate/TaskCreate.tsx';
import type { Task, FreezeTask } from './types.ts'


function App() {
	const [isModalOpen, SetIsModalOpen] = useState(false);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [freezeTasks, setFreezeTasks] = useState<FreezeTask[]>([]);
	const [ActionDelete, SetActionDelete] = useState<Task | null>(null);
	const [ActionMessenge, SetActionMessenge] = useState<string>('');
	const handleCreateTask = ( task: Omit<Task, 'id'> ) => {
		setTasks(prev => [...prev, {...task, id: crypto.randomUUID() }]);
	}

	const freezeTask = (id: string) => {
		const taskToFreeze = tasks.find(task => task.id === id);
		if (!taskToFreeze) return;
		setTasks(prev => prev.filter(task => task.id !== id));
		setFreezeTasks(prev => [...prev, {...taskToFreeze, frozenAt: Date.now()}]);
	}

	const unfreezeTask = (id: string) => {
		const taskToUnfreeze = freezeTasks.find(task => task.id === id);
		if (!taskToUnfreeze) return;
		
		const frozenDuration = Date.now() - taskToUnfreeze.frozenAt;
		const newDeadline = new Date(
			new Date(taskToUnfreeze.taskDeadline).getTime() + frozenDuration
		).toISOString();

		const {frozenAt, ...other} = taskToUnfreeze;
		const newTask: Task = {...other, taskDeadline: newDeadline}

		setTasks(prev => [...prev, newTask]);
		setFreezeTasks(prev => prev.filter(task => task.id !== id));
	}

	const reqestDeleteTask = (id: string, messenge: string) => {
		const task = tasks.find(tasks => tasks.id === id);
		if (task) {
			SetActionDelete(task);
			SetActionMessenge(messenge);
		}

	}

	const onConfirmAction = () => {
		if (!ActionDelete) return;
		setTasks(prev => prev.filter(task => task.id !== ActionDelete.id));
		SetActionDelete(null);
	}

	const onCloseAction = () => {
		SetActionDelete(null);
	}

	return (
		<main className='main'>
			<header className='header'>
				<div className='header__inner'>
					<h1 className='logo'>TaskBoard</h1>
					<div className='user-info'>
						{/* <div className='user__buttons'>
							<button className='button'>Register</button>
							<button className='button'>Login</button>
						</div> */}
					</div>
				</div>
			</header>
			
			<section className='main__options'>
				<div className='options__inner'>
					<button 
						className='button'
						onClick={() => SetIsModalOpen(true)}
					>create task</button>
				</div>
			</section>

			<section className='main__boards'>
				<div className='container'>
					<div className='boards__inner'>
						<div className='boards__active board'>
							<div className='active-header board-header'>Main Board</div>
							<div className='active-container board-container'>
								{tasks.map(task => (
									<TaskCreate
										key={task.id}
										id = {task.id}
										taskName={task.taskName}
										taskInfo={task.taskInfo}
										taskDeadline={task.taskDeadline}
										onDelete = {reqestDeleteTask}
										onFreeze={freezeTask}
										isFreeze = {false}
										/>
								))}
							</div>
						</div>
						<div className='boards__freeze board'>
							<div className='freeze-header board-header'> Freeze Board</div>
							<div className='freeze-container board-container'>
								{freezeTasks.map(task => (
									<TaskCreate
										key={task.id}
										id = {task.id}
										taskName={task.taskName}
										taskInfo={task.taskInfo}
										taskDeadline={task.taskDeadline}
										onDelete = {reqestDeleteTask}
										onFreeze={unfreezeTask}
										isFreeze = {true}
										/>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
			{isModalOpen &&  <TaskModal 
				setIsOpen = {SetIsModalOpen}
				OnCreateTask = {handleCreateTask}/>}
			
			{ActionDelete && <ActionWindow 
				taskName = {ActionDelete.taskName}
				OnClose = {onCloseAction}
				OnConfirm={onConfirmAction}
				messenge = {ActionMessenge}
				/>}
		</main>
	);
}

export default App;
