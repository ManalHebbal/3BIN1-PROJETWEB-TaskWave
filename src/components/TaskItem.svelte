<script>
  export let task;
  import { createEventDispatcher } from "svelte";
  
  const dispatch = createEventDispatcher();

  function editTask() {
    dispatch("editTask", { task });
  }

  function deleteTask() {
    dispatch("deleteTask", { task });
  }
</script>

<div class="task-item">
  <p>{task.title}</p>
  <button on:click={editTask}>Modifier</button>
  <button on:click={deleteTask}>Supprimer</button>
</div>

<style>
  .task-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  button {
    margin-left: 5px;
  }
</style>
