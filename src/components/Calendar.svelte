<script>
  import { onMount } from "svelte";
  import { Calendar } from "@fullcalendar/core";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import TaskForm from "./TaskForm.svelte";
  import { taskStore } from '../stores/taskStores';
  import { get } from 'svelte/store';
  import TaskItem from "./TaskItem.svelte";


  let calendarEl;
  let calendar;
  let showModal = false;
  let selectedDate = null;
  let editingTask = null;
  let showFilterMenu = false;
  let currentFilter = 'all';

  function openModal(date, task = null) {
    selectedDate = date;
    editingTask = task;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedDate = null;
    editingTask = null;
  }

  function handleEditTask(event) {
    const taskToEdit = get(taskStore).find(task => task.id === event.id);
    if (taskToEdit) {
      openModal(taskToEdit.start.split("T")[0], taskToEdit);
    }
  }

  function handleDeleteTask(event) {
    taskStore.deleteTask(event.id);
    const calendarEvent = calendar.getEventById(event.id);
    if (calendarEvent) {
      calendarEvent.remove();
    }
  }

  function addEventToCalendar(task) {
    calendar.addEvent({
      id: task.id,
      title: task.title,
      start: task.start,
      classNames: [getPriorityClass(task.priority)]
    });
  }

  function getPriorityClass(priority) {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'normal':
        return 'priority-normal';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  }

  function toggleFilterMenu() {
    showFilterMenu = !showFilterMenu;
  }

  function setFilter(filter) {
    taskStore.setFilter(filter);
    showFilterMenu = false;
    currentFilter = filter;
    updateCalendar();
  }

  function updateCalendar() {
    const filteredTasks = get(taskStore).filter(task => {
      if (currentFilter === 'all') return true;
      return task.priority === currentFilter;
    });

    calendar.getEvents().forEach(event => event.remove());
    filteredTasks.forEach(task => addEventToCalendar(task));
  }

  onMount(() => {
    if (calendarEl) {
      calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "filterButton" // Bouton personnalisé pour le filtrage
        },
        customButtons: {
          filterButton: {
            text: "Filtrer par priorité",
            click: toggleFilterMenu
          }
        },
        dateClick: function(info) {
          openModal(info.dateStr);
        },
        eventContent: function(arg) {
    
            // Création du conteneur principal
            const container = document.createElement('div');
            
            // Insertion de HTML dans le conteneur avec les éléments et classes nécessaires
            container.innerHTML = 
              `<div class="tasktitle">${arg.event.title}</div>
              <button class="edit-button">✏️</button>
              <button class="delete-button">🗑️</button>
            `

            const editButton = container.querySelector('.edit-button');
            const deleteButton = container.querySelector('.delete-button');
            
            const titleEl= container.querySelector('.tasktitle');

            // Application des styles directement en JavaScript
            titleEl.style.fontFamily = '"Montserrat", sans-serif;'; // Remplacez par la police que vous avez choisie
            titleEl.style.fontSize = '19px'; // Ajustez la taille
            titleEl.style.fontWeight = '1'; // Optionnel : définit l
            
            
            
            editButton.style.marginLeft = '80px';

            // Styles appliqués directement en JavaScript pour éviter l'erreur Svelte
            [editButton, deleteButton].forEach(button => {
              button.style.background = 'transparent';
              button.style.border = 'none';
              button.style.cursor = 'pointer';
              button.style.fontSize = '16px';
              button.style.display = 'inline-flex';


              // Ajouter un effet de survol
              button.addEventListener('mouseover', () => {
                button.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                button.style.borderRadius = '50%';
              });

              button.addEventListener('mouseout', () => {
                button.style.backgroundColor = 'transparent';
              });
            });


            // Ajout des événements avec Svelte pour déclencher les fonctions de gestion des tâches
            editButton.addEventListener('click', (e) => {
              e.stopPropagation();
              handleEditTask(arg.event);
            });

            deleteButton.addEventListener('click', (e) => {
              e.stopPropagation();
              handleDeleteTask(arg.event);
            });

            return { domNodes: [container] };
          

        }
      });

          calendar.render();
        }

        taskStore.subscribe(tasks => {
          updateCalendar();
        });
      });
</script>

<div class="calendar-container">
  <!-- Élément du calendrier -->
  <div bind:this={calendarEl} class="calendar-content"></div>

  <!-- Menu de filtrage des priorités -->
  {#if showFilterMenu}
    <div class="filter-options">
      <button on:click={() => setFilter('high')}>Haute priorité</button>
      <button on:click={() => setFilter('normal')}>Priorité normale</button>
      <button on:click={() => setFilter('low')}>Basse priorité</button>
      <button on:click={() => setFilter('all')}>Tout afficher</button>
    </div>
  {/if}
</div>

<!-- Modale pour ajouter ou modifier les tâches -->
{#if showModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="modal-overlay" on:click={closeModal}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-content" on:click|stopPropagation>
      <button class="close-button" on:click={closeModal} aria-label="Fermer la modale">✖</button>
      <TaskForm {selectedDate} task={editingTask} onClose={closeModal} />
    </div>
  </div>
{/if}

<style>
  .calendar-container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .filter-options {
    position: absolute;
    top: 60px; /* Ajustez selon la position du bouton */
    right: px;
    left: 90%;
    background: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: px;
    z-index: 10;
    display: flex;
    flex-direction: column;
  }

  .filter-options button {
    padding: px 16px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: 14px;
    background-color: #e9992a;
  }


</style>
