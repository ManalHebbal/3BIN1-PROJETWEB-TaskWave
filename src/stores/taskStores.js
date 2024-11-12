import { writable } from 'svelte/store';

function createTaskStore() {
    const storedTasks = (typeof localStorage !== 'undefined' && localStorage.getItem('calendarEvents'))
        ? JSON.parse(localStorage.getItem('calendarEvents'))
        : [];

    const { subscribe, update } = writable(storedTasks);
    const filter = writable('all');

    function saveTasks(tasks) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('calendarEvents', JSON.stringify(tasks));
        }
    }

    function setFilter(newFilter) {
        filter.set(newFilter);
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
        }),
        setFilter,
        filter
    };
}

export const taskStore = createTaskStore();
