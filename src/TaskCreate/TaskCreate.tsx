import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import './TaskCreate.css'
import trashIcon from '../images/trash.webp';
import acceptIcon from '../images/accept.webp';

interface TaskCreateProps {
    id: string;
    taskName: string;
    taskInfo: string;
    taskDeadline: string;
    onDelete: (id: string, messenge: string) => void;
    onFreeze: (id: string) => void;
    isFreeze: boolean;
}

const TaskCreate = ( {id, taskName, taskInfo, taskDeadline, onDelete, onFreeze, isFreeze}: TaskCreateProps ) => {
    const [timeLeft, setTimeLeft ] = useState({
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0
    });

    const [isTimeout, setIsTimeout] = useState(false);

    useEffect(() => {
        const tick = () => {
            const currentTime = moment.tz(moment.tz.guess()).format('YYYY-MM-DDTHH:mm:ss')
            const diff = new Date(taskDeadline).getTime() - new Date(currentTime).getTime();
            if (diff >= 0) {
                setTimeLeft({
                    seconds: Math.max(Math.trunc((diff / 1000) % 60)),
                    minutes: Math.max(Math.trunc((diff / (1000 * 60)) % 60)),
                    hours: Math.max(Math.trunc((diff / (1000 * 60 * 60)) % 24)),
                    days: Math.max(Math.trunc(diff / (1000 * 60 * 60 * 24)))
                })
            }
            else {
                setIsTimeout(true);
                
            }
        }
        
        tick();
        if (isFreeze || isTimeout) return;
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [taskDeadline]);


    const taskDate = new Date(taskDeadline).toLocaleDateString('en-US');
    const taskTime  = new Date(taskDeadline).toLocaleTimeString('en-US',{hour: '2-digit', minute: '2-digit'});

    return (
        <div className={`task-container ${isTimeout && 'task-timeout'} ${isFreeze && 'task-freeze'}`}>
            <div className="task-name">
                <span>{taskName}</span>   
            </div>
            <span className="task-info">{taskInfo}</span>
            <div className="deadline">
                <span className="deadline-date">{taskDate} {taskTime}</span>
                <div className = {`${timeLeft.days === 0 && timeLeft.hours === 0 ? 'deadline-endtime' : 'deadline-time'} ${isFreeze && 'deadline-freezetime'}`}>
                    {timeLeft.days > 0 ? `${timeLeft.days} days `: null}
                    {timeLeft.hours > 0 ? `${timeLeft.hours > 9 ? `${timeLeft.hours}` : `0${timeLeft.hours}`}:` : null}
                    {timeLeft.minutes > 9 ? `${timeLeft.minutes}` : `0${timeLeft.minutes}`}:
                    {timeLeft.seconds > 9 ? `${timeLeft.seconds}` : `0${timeLeft.seconds}`}
                </div>
            </div>
            <div className='task-buttons'>
                {isTimeout &&<button 
                    className='delete-button button' 
                    onClick = {() => onDelete(id, 'Delete')}>
                    <img className='delete-image' src={trashIcon} alt="Trash"/>
                </button>}
                {!isTimeout && !isFreeze && <button 
                    className='accept-button button'
                    onClick = {() => onDelete(id, 'Сomplete the')}>
                    <img className='accept-image' src={acceptIcon} alt="Accept"/>
                </button>}
                {!isTimeout && !isFreeze &&
                <button 
                    className='freeze-button button'
                    onClick = {() => onFreeze(id)}>freeze</button>}
                {!isTimeout && isFreeze &&
                <button 
                    className='unfreeze-button button'
                    onClick = {() => onFreeze(id)}>unfreeze</button>}
            </div>
        </div>
    );
};

export default TaskCreate;