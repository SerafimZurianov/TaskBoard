import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import './TaskModal.css'
import type { Task } from '../types';

interface TaskModalProps {
	setIsOpen: (value: boolean) => void;
	OnCreateTask: (task: Task) => void;
}

const TaskModal = ({ setIsOpen, OnCreateTask }: TaskModalProps) => {
	
	const [minDate, setMinDate] = useState('');

	useEffect(() => {
		setMinDate(new Date().toISOString().slice(0, 11) + '00:00');
	}, []);

	const [taskCreateDate, setTaskCreateData] = useState<Task>({
		taskName: '',
		taskInfo: '',
		taskDeadline: '',
		id: ''
	});

	const setNameData = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTaskCreateData(prev => ({
			...prev,
			taskName: event.target.value
		}));
		console.log(taskCreateDate);
	};

	const setInfoData = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTaskCreateData(prev => ({
			...prev,
			taskInfo: event.target.value
		}));
		console.log(taskCreateDate);
	};

	const setDeadlineData = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTaskCreateData(prev => ({
			...prev,
			taskDeadline: event.target.value
		}));
		console.log(taskCreateDate);
	};

	
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
			const currentTime = moment.tz(moment.tz.guess()).format('YYYY-MM-DDTHH:mm')

			if (new Date(taskCreateDate.taskDeadline).getTime() <= new Date(currentTime).getTime()) {
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
		<div className='modal'>
			<div className='modal-header'>
				<span className='modal-name'>Create Task</span>
				<button 
					className='close-button'
					onClick={() => {setIsOpen(false)}}
				></button>
			</div>
			<form className='modal-container' onSubmit={handleSubmit}>
				<span className='description'>Create name:</span>
				<div className='task-name'>
					<input 
						className='name-input' 
						type="text" 
						value={taskCreateDate.taskName}
						onChange={setNameData}
						placeholder='Task Name'/>
					{error.name && <span className='error'>Enter name!</span>}
				</div>
				<span className='description'>Task description:</span>
				<div className='task-info'>
					<textarea 
						className='info-input' 
						value={taskCreateDate.taskInfo}
						onChange={setInfoData}
						placeholder='Task info'></textarea>
					{error.info && <span className='error'>Enter info!</span>}
				</div>
				<span className='description'>Task deadline:</span>
				<div className='task-deadline'>
					<input 
						className='deadline-input' 
						type='datetime-local'  
						value={taskCreateDate.taskDeadline}
						onChange={setDeadlineData}
						min={minDate}
						placeholder=''/>
					{error.deadline && <span className='error'>Enter deadline!</span>}
					{error.deadlineBefore && <span className='error'>The time must be no later than {moment.tz(moment.tz.guess()).format('HH:mm')}!</span>}
				</div>
				<button 
					type='submit'
					className='button create-button'
				>Create</button>
			</form>
		</div>


	);
}


export default TaskModal;