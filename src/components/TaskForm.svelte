<script>
  import { createEventDispatcher } from "svelte";
  import '../styles/global.css';

  export let selectedDate = ""; // Reçoit la date sélectionnée du composant parent

  const dispatch = createEventDispatcher();

  let title = "";
  let date = selectedDate || ""; // Utilise selectedDate pour pré-remplir le champ
  let time = "";

  function handleSubmit() {
    dispatch("addTask", { title, date, time });
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
  
  <button type="submit">Ajouter la tâche</button>
</form>
