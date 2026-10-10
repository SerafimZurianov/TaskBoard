import React, { useState, useEffect } from 'react';
import './TaskModal.css'
import type { Task } from '../types';
import crossIcon from '../images/cross.svg';

interface TaskModalProps {
	setIsOpen: (value: boolean) => void;
	OnCreateTask: (task: Task) => void;
	submitError: string | null;
}

const TaskModal = ({ setIsOpen, OnCreateTask, submitError }: TaskModalProps) => {
	
	const [minDate, setMinDate] = useState('');

	useEffect(() => {
		setMinDate(new Date().toISOString().slice(0, 11) + '00:00');
	}, []);

	const [taskCreateDate, setTaskCreateData] = useState<Task>({
		taskName: '',
		taskInfo: '',
		taskDeadline: '',
		id: '',
		isFrozen: false,
		frozenAt: ''
	});
	
	const [error, setError] = useState({
		name: false,
		info: false,
		deadline: false,
		deadlineBefore: false
	});
	
	const validateForm = () => {
		const newErrors = {
			name: false,
			info: false,
			deadline: false,
			deadlineBefore: false
		};
		if(!taskCreateDate.taskName.trim()) {
			newErrors.name = true;
		}
		if(!taskCreateDate.taskInfo.trim()) {
			newErrors.info = true;
		}
		if(!taskCreateDate.taskDeadline) {
			newErrors.deadline = true;
		}
		else {

			if (new Date(taskCreateDate.taskDeadline).getTime() <= Date.now()) {
				newErrors.deadlineBefore = true;
			}
		}
		return newErrors;
	}
	
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const newError = validateForm();
		if(newError.name || newError.info || newError.deadline || newError.deadlineBefore) {
			setError(newError);
			return;
		}
		OnCreateTask(taskCreateDate);
		setIsOpen(false);
	};

	return (
		<div className='modal-owerlay'>
			<div className='modal'>
				<div className='modal-header'>
					<span className='modal-logo'>Create Task</span>
					<button 
						className='close-button button'
						onClick={() => {setIsOpen(false)}}
					>
						<img className='cross-image' src={crossIcon} alt="Cross"/>
					</button>
				</div>
				<form className='modal-container' onSubmit={handleSubmit}>
					<span className='description'>Create name:</span>
					<div className='modal-name'>
						<input 
							className='name-input' 
							type="text" 
							maxLength = {30}
							value={taskCreateDate.taskName}
							onChange={(event) => setTaskCreateData(prev => ({...prev, taskName: event.target.value}))}
							placeholder='Task Name'/>
						{error.name && <span className='error'>Enter name!</span>}
					</div>
					<span className='description'>Task description:</span>
					<div className='modal-info'>
						<textarea 
							className='info-input' 
							maxLength = {300}
							value={taskCreateDate.taskInfo}
							onChange={(event) => setTaskCreateData(prev => ({...prev, taskInfo: event.target.value}))}
							placeholder='Task info'></textarea>
						{error.info && <span className='error'>Enter info!</span>}
					</div>
					<span className='description'>Task deadline:</span>
					<div className='modal-deadline'>
						<input 
							className='deadline-input' 
							type='datetime-local'  
							value={taskCreateDate.taskDeadline}
							onChange={(event) => setTaskCreateData(prev => ({...prev, taskDeadline: event.target.value}))}
							min={minDate}
							placeholder=''/>
						{error.deadline && <span className='error'>Enter deadline!</span>}
						{error.deadlineBefore && <span className='error'>The time must be no later than {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}!</span>}
						{submitError && <span className='error'>{submitError}</span>}
					</div>
					<button 
						type='submit'
						className='button create-button'
					>Create</button>
				</form>
			</div>
		</div>
	);
}


export default TaskModal;