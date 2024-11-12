<script>
  import { onMount } from "svelte";
  import { Calendar } from "@fullcalendar/core";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import TaskForm from "./TaskForm.svelte";
  import { taskStore } from '../stores/taskStores';
  import { get } from 'svelte/store';

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
          const titleEl = document.createElement('div');
          titleEl.innerText = arg.event.title;

          const editButton = document.createElement('button');
          editButton.classList.add('icon-button');
          editButton.innerHTML = `✏️`;
          editButton.onclick = (e) => {
            e.stopPropagation();
            handleEditTask(arg.event);
          };

          const deleteButton = document.createElement('button');
          deleteButton.classList.add('icon-button');
          deleteButton.innerHTML = `🗑️`;
          deleteButton.onclick = (e) => {
            e.stopPropagation();
            handleDeleteTask(arg.event);
          };

          const container = document.createElement('div');
          container.appendChild(titleEl);
          container.appendChild(editButton);
          container.appendChild(deleteButton);

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
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <button class="close-button" on:click={closeModal} aria-label="Fermer la modale">✖</button>
      <TaskForm {selectedDate} task={editingTask} />
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

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
  }


  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }

  .modal-content{
    background-color: #d3d3d3;
    height:auto;
    width: 40%;
  }
</style>
