<script>
  import { onMount } from "svelte";
  import { Calendar } from "@fullcalendar/core";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import TaskForm from "./TaskForm.svelte";
  import '../styles/global.css';


  let calendarEl;
  let calendar;
  let showModal = false;
  let events = []; // Initialisé vide par défaut

  // Fonction pour charger les événements depuis localStorage (uniquement côté client)
  function loadEvents() {
    const savedEvents = localStorage.getItem("calendarEvents");
    return savedEvents ? JSON.parse(savedEvents) : [];
  }

  function saveEvents() {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }

  function addEventToCalendar(event) {
    calendar.addEvent(event);
  }

  function handleAddTask(event) {
    const { title, date, time } = event.detail;
    const eventData = {
      title,
      start: time ? `${date}T${time}` : date,
    };
    events = [...events, eventData];
    addEventToCalendar(eventData);
    saveEvents(); // Sauvegarde des événements dans localStorage
    closeModal();
  }

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  onMount(() => {
    // Charger les événements depuis localStorage seulement côté client
    events = loadEvents();

    // Initialiser FullCalendar avec les événements
    calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      events: events,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: ""
      }
    });
    calendar.render();
  });
</script>

<button on:click={openModal} class="add-task-button">Ajouter une tâche</button>

{#if showModal}
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <button class="close-button" on:click={closeModal} aria-label="Fermer la modale">✖</button>
      <TaskForm on:addTask={handleAddTask} />
    </div>
  </div>
{/if}

<div bind:this={calendarEl} class="calendar-container"></div>
