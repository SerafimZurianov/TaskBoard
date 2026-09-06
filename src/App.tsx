import { useState } from 'react';
import './App.css';
import userAvatar from './images/UserIcon.png';
import TaskModal from './TaskModal/TaskModal.tsx';
import TaskCreate from './TaskCreate/TaskCreate.tsx';
import type { Task } from './types.ts'


function App() {
	const [isModalOpen, SetIsModalOpen] = useState(false);
	const [tasks, setTasks] = useState<Task[]>([]);

	const handleCreateTask = ( task: Omit<Task, 'id'> ) => {
		setTasks(prev => [...prev, {...task, id: crypto.randomUUID() }])
	}
	return (
		<main className='main'>
			<header className='header'>
				<div className='header__inner'>
					<h1 className='logo'>TaskBoard</h1>
					<div className='user-info'>
						<img className='user__icon' src={userAvatar} alt="UserIcon" />
						<span className='user__name'>Серафим</span>
						<div className='user__buttons'>
							<button className='button'>Register</button>
							<button className='button'>Login</button>
						</div>
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
										taskName={task.taskName}
										taskInfo={task.taskInfo}
										taskDeadline={task.taskDeadline}/>
								))}
							</div>
						</div>
						<div className='boards__freeze board'>
							<div className='freeze-header board-header'> Freeze Board</div>
							<div className='freeze-container board-container'></div>
						</div>
					</div>
				</div>
			</section>
			{isModalOpen && <TaskModal 
				setIsOpen = {SetIsModalOpen}
				OnCreateTask = {handleCreateTask}/>}
		</main>
	);
}

export default App;
