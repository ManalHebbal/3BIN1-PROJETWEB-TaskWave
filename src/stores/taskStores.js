import { writable } from 'svelte/store';

function isLocalStorageAvailable() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

function createTaskStore() {
    const storedTasks = isLocalStorageAvailable() 
        ? JSON.parse(localStorage.getItem('calendarEvents')) || []
        : [];

    const { subscribe, update } = writable(storedTasks);

    function saveTasks(tasks) {
        if (isLocalStorageAvailable()) {
            localStorage.setItem('calendarEvents', JSON.stringify(tasks));
        }
    }

    return {
        subscribe,
        addTask: (task) => update(tasks => {
            const newTasks = [...tasks, task];
            saveTasks(newTasks);  
            return newTasks;
        }),
        updateTask: (updatedTask) => update(tasks => {
            const newTasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
            saveTasks(newTasks); 
            return newTasks;
        }),
        deleteTask: (taskId) => update(tasks => {
            const newTasks = tasks.filter(task => task.id !== taskId);
            saveTasks(newTasks);  
            return newTasks;
        })
    };
}

export const taskStore = createTaskStore();
