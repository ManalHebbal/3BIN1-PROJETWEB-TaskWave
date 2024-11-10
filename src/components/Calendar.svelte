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
  let selectedDate = null;
  let events = []; // Initialisé vide par défaut

  // Fonction pour charger les événements depuis localStorage
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

  function openModal(date) {
    selectedDate = date;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedDate = null;
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
      },
      dateClick: function(info) {
        openModal(info.dateStr); // Ouvre le modal avec la date sélectionnée
      }
    });
    calendar.render();
  });
</script>

<!-- Pop-up Modal Formulaire d'ajout de tâche -->
{#if showModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <button class="close-button" on:click={closeModal} aria-label="Fermer la modale">✖</button>
      <TaskForm on:addTask={handleAddTask} {selectedDate} />
    </div>
  </div>
{/if}

<div bind:this={calendarEl} class="calendar-container"></div>
