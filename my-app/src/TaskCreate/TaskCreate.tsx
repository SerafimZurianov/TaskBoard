import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import './TaskCreate.css'

interface TaskCreateProps {
    taskName: string;
    taskInfo: string;
    taskDeadline: string;
}

const TaskCreate = ( {taskName, taskInfo, taskDeadline}: TaskCreateProps ) => {
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
        const timer = setInterval(tick, 1000);
        if (!isTimeout) {
            return () => clearInterval(timer);
        }
    }, [taskDeadline]);


    const taskDate = new Date(taskDeadline).toLocaleDateString('en-US');
    const taskTime  = new Date(taskDeadline).toLocaleTimeString('en-US',{hour: '2-digit', minute: '2-digit'});

    return (
        <div className={`task-container ${isTimeout && 'task-timeout'}`}>
            <span className="task-name">{taskName}</span>
                <span className="task-info">{taskInfo}</span>
                <div className="deadline">
                    <span className="deadline-date">{taskDate} {taskTime}</span>
                    <div className="deadline-time">
                        {timeLeft.days > 0 ? `${timeLeft.days} days `: null}
                        {timeLeft.hours > 0 ? `${timeLeft.hours > 9 ? `${timeLeft.hours}` : `0${timeLeft.hours}`}:` : null}
                        {timeLeft.minutes > 9 ? `${timeLeft.minutes}` : `0${timeLeft.minutes}`}:
                        {timeLeft.seconds > 9 ? `${timeLeft.seconds}` : `0${timeLeft.seconds}`}
                    </div>
                </div>
        </div>
    );
};

export default TaskCreate;