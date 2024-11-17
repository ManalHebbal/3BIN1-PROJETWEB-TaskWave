<script>
  export let event;      
  export let onEdit;    
  export let onDelete;  
  
  function handleEdit() {
    onEdit(event);  
  }

  function handleDelete() {
    onDelete(event);  
  }
</script>

<div class="task-container">
  <div class="task-title">
    {event.title}
  </div>
  
  <button class="edit-button" on:click={handleEdit}>✏️</button>
  <button class="delete-button" on:click={handleDelete}>🗑️</button>
</div>

<style>
.task-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px; 
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  width: 100%;  
  height: 40px; 
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
