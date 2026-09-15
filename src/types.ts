export interface Task {
    id: string;
    taskName: string;
    taskInfo: string;
    taskDeadline: string;
}

export interface FreezeTask extends Task {
    frozenAt: number;
}