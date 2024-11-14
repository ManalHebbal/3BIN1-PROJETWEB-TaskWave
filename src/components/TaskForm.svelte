<script>
  import { taskStore } from '../stores/taskStores';
  import '../styles/global.css';

  export let selectedDate = ""; 
  export let task = null; 

  let title = task ? task.title : "";
  let date = task ? task.start.split("T")[0] : selectedDate || "";
  let time = task && task.start.includes("T") ? task.start.split("T")[1] : "";
  let priority = task ? task.priority : "normal"; // Définition de la priorité par défaut

  function handleSubmit() {
    const taskData = {
      id: task ? task.id : Date.now().toString(),
      title,
      start: time ? `${date}T${time}` : date,
      priority, // Ajout de la priorité dans les données de la tâche
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
    priority = "normal";
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="task-form">
  
  <h1>{task ? "Mettre à jour la tâche" : "Ajouter une tâche"}</h1>

  
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

  <label>
    Priorité :
    <select bind:value={priority}>
      <option value="high">Haute</option>
      <option value="normal">Normale</option>
      <option value="low">Basse</option>
    </select>
  </label>
  
  <button type="submit">{task ? "Mettre à jour la tâche" : "Ajouter la tâche"}</button>
</form>

<style>

  
 label{
  font-size: 25px;
  
 }
 label input{
  border: none;
 }

 button{
    background-color: #ffffff;
    border: none;
    border-radius: 10px;
    cursor: pointer;

 }

 button:hover {
    background-color: #4dff64;
}

 input{
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
 }
</style>