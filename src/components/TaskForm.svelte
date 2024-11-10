<!-- TaskForm.svelte -->
<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let title = "";
  let date = "";
  let time = "";

  function handleSubmit() {
    // Émet un événement avec les détails de la tâche pour le composant parent
    dispatch("addTask", { title, date, time });
    // Réinitialise les champs du formulaire après la soumission
    title = "";
    date = "";
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

<style>
  /* Styles pour le formulaire */
  .task-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 300px;
    margin: 20px auto;
  }
  
  label {
    font-size: 1rem;
  }
  
  input, button {
    padding: 5px;
    font-size: 1rem;
  }
</style>
