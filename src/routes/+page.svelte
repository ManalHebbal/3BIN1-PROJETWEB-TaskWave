<script>
    import { goto } from '$app/navigation';
  </script>
  
  <h1>Bienvenue sur le gestionnaire de tâches</h1>
  <button on:click={() => goto('/calendar')}>Voir le calendrier</button>
  