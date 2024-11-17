<script>
  import { taskStore } from '../stores/taskStores';
  import '../styles/global.css';

  export let selectedDate = ""; 
  export let task = null; 
  export let onClose; 

  
  let title = task ? task.title : "";
  let date = task ? task.start.split("T")[0] : selectedDate || "";
  let time = task && task.start.includes("T") ? task.start.split("T")[1] : "";
  let priority = task ? task.priority : "normal"; 


  function handleSubmit() {
    const taskData = {
      id: task ? task.id : Date.now().toString(),
      title,
      start: time ? `${date}T${time}` : date,
      priority, 
    };

    if (task) {
      taskStore.updateTask(taskData);
    } else {
     
      taskStore.addTask(taskData);
    }

    title = "";
    date = selectedDate || "";
    time = "";
    priority = "normal";

    if (onClose) {
      onClose();
    }
  }
</script>
<div class="card">
  <h1 class="card-title">{task ? "Mettre à jour la tâche" : "Ajouter une tâche"}</h1>
  
  <form on:submit|preventDefault={handleSubmit} class="task-form">
    <div class="form-group">
      <label for="title">Titre de la tâche :</label>
      <input id="title" type="text" bind:value={title} required />
    </div>
    
    <div class="form-group">
      <label for="date">Date :</label>
      <input id="date" type="date" bind:value={date} required />
    </div>
    
    <div class="form-group">
      <label for="time">Heure (optionnel) :</label>
      <input id="time" type="time" bind:value={time} />
    </div>

    <div class="form-group">
      <label for="priority">Priorité :</label>
      <select id="priority" bind:value={priority}>
        <option value="high">Haute</option>
        <option value="normal">Normale</option>
        <option value="low">Basse</option>
      </select>
    </div>
    
    <button type="submit">{task ? "Mettre à jour la tâche" : "Ajouter la tâche"}</button>
  </form>
</div>

<style>

  .card {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 100%;
    max-width: 420px;
    margin: 1rem ;
    transition: box-shadow 0.3s ease;
  }

  .card:hover {
    box-shadow: 0 15px 20px rgba(0, 0, 0, 0.15);
  }

  .card-title {
    font-size: 1.6rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .task-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
  }

  input, select {
    width: 90%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    background-color: #f9f9f9;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #4dff64;
    box-shadow: 0 0 0 2px rgba(77, 255, 100, 0.3);
  }

  button {
    background-color: #4dff64;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.75rem;
    padding-right: -5rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;
    text-align: center;
  }

  button:hover {
    background-color: #3ae054;
  }

  button:active {
    transform: scale(0.98);
  }
</style>