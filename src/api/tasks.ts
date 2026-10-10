import { apiFetch } from "./client";
import type { Task } from "../types";

export function getTask() {
    return apiFetch<Task[]>('/tasks');
}

export function createTask(data: {taskName: string, taskInfo: string, taskDeadline: string}) {
    return apiFetch<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function deleteTask(id: string) {
    return apiFetch<void>(`/tasks/${id}`, { method: 'DELETE'});
}

export function freezeTask(id: string) {
    return apiFetch<Task>(`/tasks/${id}/freeze`, { method: 'PATCH'});
}