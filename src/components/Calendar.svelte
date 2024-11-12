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
          right: ""
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

<div class="filter-buttons">
  <button on:click={toggleFilterMenu}>Filtrer par priorité</button>
  {#if showFilterMenu}
    <div class="filter-options">
      <button on:click={() => setFilter('high')}>Haute priorité</button>
      <button on:click={() => setFilter('normal')}>Priorité normale</button>
      <button on:click={() => setFilter('low')}>Basse priorité</button>
      <button on:click={() => setFilter('all')}>Tout afficher</button>
    </div>
  {/if}
</div>

<div bind:this={calendarEl} class="calendar-container"></div>

{#if showModal}
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <button class="close-button" on:click={closeModal} aria-label="Fermer la modale">✖</button>
      <TaskForm {selectedDate} task={editingTask} />
    </div>
  </div>
{/if}
