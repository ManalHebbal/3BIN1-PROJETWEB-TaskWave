<script>
  export let task;

  function editTask() {
    dispatch("editTask", { task });
  }

  function deleteTask() {
    dispatch("deleteTask", { task });
  }
</script>



<style>

</style>


