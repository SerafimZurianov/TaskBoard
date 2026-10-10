export interface Task {
    id: string;
    taskName: string;
    taskInfo: string;
    taskDeadline: string;
    isFrozen: boolean;
    frozenAt: string | null
}

export interface User {
    id: string;
    email: string
}