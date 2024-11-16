<script>
  export let event;      // Reçoit l'événement FullCalendar
  export let onEdit;     // Fonction pour éditer la tâche
  export let onDelete;   // Fonction pour supprimer la tâche
  
  // Fonction pour appeler l'édition de la tâche
  function handleEdit() {
    onEdit(event);  // Appelle la fonction passée en prop
  }

  // Fonction pour appeler la suppression de la tâche
  function handleDelete() {
    onDelete(event);  // Appelle la fonction passée en prop
  }
</script>

<div class="task-container">
  <div class="task-title">
    {event.title}
  </div>
  
  <!-- Boutons pour éditer et supprimer -->
  <button class="edit-button" on:click={handleEdit}>✏️</button>
  <button class="delete-button" on:click={handleDelete}>🗑️</button>
</div>

<style>
.task-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;  /* Augmenter le padding pour plus d'espace */
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  width: 100%;  /* Assurer que ça prend toute la largeur disponible */
  height: 40px; /* Ajuster la hauteur de la tâche */
}

.task-title {
  font-size: 14px;
  font-weight: bold;
  flex-grow: 1;
  margin-left: 10px;
}


  .edit-button,
  .delete-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 5px;
    margin-left: 5px;
    transition: background-color 0.3s;
  }

  .edit-button:hover,
  .delete-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }
</style>
