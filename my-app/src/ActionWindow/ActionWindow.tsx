import './ActionWindow.css'

interface ActionWindowProps {
    taskName: string;
    OnClose: () => void;
    OnConfirm: () => void;
    messenge: string;
}

const TaskModal = ({ taskName, OnClose, OnConfirm, messenge }: ActionWindowProps) => {
    let name = ''
	if (messenge === 'Сomplete the') {
        name = 'Сomplete'
    }
    else {
        name = 'Delete'
    }

	return (
		<div className='action'>
			<div className='action-header'>
				<span className='action-name'>{name} task</span>
			</div>
			<div className='action-container'>
				<span className='action-info'>{messenge} {taskName}?</span>
                <div className='buttons'>
                    <button 
                        className='button'
                        onClick = {OnClose}
                    >Cancel</button>
                    <button 
                        className='button confirm-button'
                        onClick = {OnConfirm}
                    >Ok</button>
                </div>
			</div>
		</div>


	);
}


export default TaskModal;