<script>
  import { taskStore } from '../stores/taskStores';
  import '../styles/global.css';

  export let selectedDate = ""; 
  export let task = null; 


  let title = task ? task.title : "";
  let date = task ? task.start.split("T")[0] : selectedDate || "";
  let time = task && task.start.includes("T") ? task.start.split("T")[1] : "";

  function handleSubmit() {
    const taskData = {
      id: task ? task.id : Date.now().toString(),
      title,
      start: time ? `${date}T${time}` : date,
    };

    if (task) {
      taskStore.updateTask(taskData);
    } else {
      // Ajout d'une nouvelle tâche
      taskStore.addTask(taskData);
    }

    title = "";
    date = selectedDate || "";
    time = "";
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="task-form">
  <label>
    Titre de la tâche :
    <input type="text" bind:value={title} required />
  </label>
  
  <label>
    Date :
    <input type="date" bind:value={date} required />
  </label>
  
  <label>
    Heure (optionnel) :
    <input type="time" bind:value={time} />
  </label>
  
  <button type="submit">{task ? "Mettre à jour la tâche" : "Ajouter la tâche"}</button>
</form>
