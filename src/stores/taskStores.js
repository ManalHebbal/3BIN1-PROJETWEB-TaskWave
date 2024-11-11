import { writable } from 'svelte/store';

function createTaskStore() {
    const storedTasks = (typeof localStorage !== 'undefined' && localStorage.getItem('calendarEvents'))
        ? JSON.parse(localStorage.getItem('calendarEvents'))
        : [];

    const { subscribe, update } = writable(storedTasks);

    function saveTasks(tasks) {
        if (typeof localStorage !== 'undefined') {
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
