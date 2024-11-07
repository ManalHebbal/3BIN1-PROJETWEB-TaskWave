<script>
    import { tasks } from '../stores/taskStore';
    let title = '';
    let date = '';
  
    const addTask = () => {
      tasks.update(currentTasks => [
        ...currentTasks,
        { id: Date.now(), title, date }
      ]);
      title = '';
      date = '';
    };
  </script>
  
  <form on:submit|preventDefault={addTask}>
    <input type="text" bind:value={title} placeholder="Titre de la tâche" required />
    <input type="date" bind:value={date} required />
    <button type="submit">Ajouter Tâche</button>
  </form>