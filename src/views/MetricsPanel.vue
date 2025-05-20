<template>
  <div class="metrics-panel">

    <div class="metrics-header">
      <div class="left-column">
        <div class="select-refresh-group">
          <select v-model="filters.type" class="metric-select">
            <option value="generales">Generales</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>

          <button class="refresh-btn" @click="updateMetrics">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      <div class="right-column">
        <button class="icon-btn" @click="openModal('time')">
          <i class="fas fa-clock"></i>
        </button>

        <button class="icon-btn" @click="openModal('date')">
          <i class="fas fa-calendar-alt"></i>
        </button>

        <button class="refresh-btn mobile" @click="updateMetrics">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>

    <div class="filter-dropdown-container" v-if="appliedFilters.time || appliedFilters.date">
      <div class="filter-dropdown-toggle" @click="toggleFilterDropdown">
        <span><i class="fas fa-sliders-h"></i> Filtros Aplicados</span>
        <i :class="['fas', showFilterDropdown ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
      </div>
      <div class="filter-dropdown-content" v-show="showFilterDropdown">
        <div class="applied-filter" v-if="appliedFilters.time">
          <i class="fas fa-clock"></i>
          Hora: {{ appliedFilters.time.startDisplay }} - {{ appliedFilters.time.endDisplay }}
          <i class="fas fa-times clear-icon" @click="clearTimeFilter" title="Quitar filtro de hora"></i>
        </div>
        <div class="applied-filter" v-if="appliedFilters.date">
          <i class="fas fa-calendar-alt"></i>
          Fecha: {{ appliedFilters.date.display }}
          <i class="fas fa-times clear-icon" @click="clearDateFilter" title="Quitar filtro de fecha"></i>
        </div>
      </div>
    </div>

    <ModalTime v-if="activeModal === 'time'" @close="closeModal" @apply="applyTimeFilter" />
    <ModalDate v-if="activeModal === 'date'" @close="closeModal" @apply="applyDateFilter" />

    <GeneralMetrics
      v-if="filters.type === 'generales'"
      :filters="filters"
      :appliedFilters="appliedFilters"
    />

    <UserMetrics
      v-else
      :userId="filters.type"
      :filters="filters"
      :appliedFilters="appliedFilters"
    />

  </div>
</template>

<script>
import ModalTime from '../components/Metrics/Modals/ModalTime.vue';
import ModalDate from '../components/Metrics/Modals/ModalDate.vue';
import GeneralMetrics from '../components/Metrics/GeneralMetrics.vue';
import UserMetrics from '../components/Metrics/UserMetrics.vue';

export default {
  name: 'MetricsPanel',
  components: {
    ModalTime,
    ModalDate,
    GeneralMetrics,
    UserMetrics
  },
  data() {
    return {
      filters: { type: 'generales' },
      users: [
        { id: 'usuario1', name: 'Usuario 1' },
        { id: 'usuario2', name: 'Usuario 2' },
        { id: 'usuario3', name: 'Usuario 3' },
      ],
      activeModal: null, 
      appliedFilters: {
        time: null,
        date: null
      },
      showFilterDropdown: false,
    };
  },
  methods: {
    updateMetrics() {
      const timeFilter = this.appliedFilters.time;
      if (timeFilter) {
        console.log('Final start:', timeFilter.start);
        console.log('Final end:', timeFilter.end);
      }

      console.log('Updating metrics with filters:', this.filters);
    },
    openModal(type) {
      this.activeModal = type;
    },
    closeModal() {
      this.activeModal = null;
    },
    applyTimeFilter(timeFilter) {
      const start24 = this.convertTo24(timeFilter.start12h);
      const end24 = this.convertTo24(timeFilter.end12h);

      this.appliedFilters.time = {
        start: start24,
        end: end24,
        startDisplay: timeFilter.start12h,
        endDisplay: timeFilter.end12h,
        label: timeFilter.label || null
      };

      this.activeModal = null;
      this.showFilterDropdown = true;
    },
    applyDateFilter(dateRange) {
      this.appliedFilters.date = {
        start: dateRange.start,
        end: dateRange.end,
        display: dateRange.display
      };

      this.activeModal = null;
      this.showFilterDropdown = true;
    },
    toggleFilterDropdown() {
      this.showFilterDropdown = !this.showFilterDropdown;
    },
    clearTimeFilter() {
      this.appliedFilters.time = null;
      this.showFilterDropdown = false;
    },
    clearDateFilter() {
      this.appliedFilters.date = null;
      this.showFilterDropdown = false;
    },
    convertTo24(time12h) {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':');

      if (modifier === 'PM' && hours !== '12') hours = String(+hours + 12);
      if (modifier === 'AM' && hours === '12') hours = '00';

      return `${hours.padStart(2, '0')}:${minutes}:00`;
    },
  },
};
</script>

<style scoped>

.metrics-panel {
  padding: 0 3rem;
  font-family: 'Inter', sans-serif;
  max-width: 1000px;
  margin: 0 auto;
}

/*  */
.metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  font-family: 'Poppins', sans-serif;
  gap: 1.5rem;
  margin-bottom: 1rem;
  animation: fadeIn 0.4s ease-in-out;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metric-select {
  padding: 0.7rem 1rem;
  border: 1.8px solid #d1d5db;
  border-radius: 12px;
  background-color: #f8f9fb;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
}

.metric-select:focus {
  outline: none;
  background-color: #fff;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.select-refresh-group {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.select-refresh-group .metric-select {
  min-width: 180px;
}

.select-refresh-group .refresh-btn {
  padding: 0.6rem 0.8rem;
  height: 44px;
  width: 44px;
}

.refresh-btn {
  padding: 0.65rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 3px 8px rgba(0, 123, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn i {
  margin: 0;
}

.refresh-btn:hover {
  background-color: #0056b3;
  transform: scale(1.02);
}

.right-column {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.icon-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: #f1f5f9;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn i {
  font-size: 1.2rem;
  color: #4a4a4a;
  transition: color 0.2s ease;
}

.icon-btn:hover {
  background-color: #e6f0ff;
  box-shadow: 0 3px 8px rgba(0, 123, 255, 0.12);
}

.icon-btn:hover i {
  color: #007bff;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.refresh-btn.mobile {
  display: none;
}

/*  */
.filter-dropdown-container {
  background-color: #f4f6fa;
  border: 1.5px solid #dbe3ef;
  border-radius: 12px;
  padding: 0.7rem 1rem;
  box-shadow: 0 2px 6px rgba(0, 123, 255, 0.05);
  font-size: 0.94rem;
  font-weight: 500;
  margin-bottom: 2rem;
  max-width: 300px;
  animation: fadeIn 0.3s ease-in-out;
}

.filter-dropdown-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: #333;
  font-weight: 600;
  user-select: none;
}

.filter-dropdown-toggle i {
  font-size: 1rem;
  color: #007bff;
}

.filter-dropdown-content {
  margin-top: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.applied-filter {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  
  padding: 0.4rem 0;
  color: #333;
  position: relative;
}

.applied-filter i.fa-clock {
  color: #007bff;
}

.clear-icon {
  margin-left: auto;
  cursor: pointer;
  color: #e53935;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.clear-icon:hover {
  color: #c62828;
}

/*  */
@media (max-width: 520px) {
  .metrics-panel {
    padding: 5px;
    margin: 1rem auto;
  }

  .select-refresh-group .refresh-btn {
    display: none;
  }

  .refresh-btn.mobile {
    display: flex;
    width: 44px;
    height: 44px;
    justify-content: center;
    align-items: center;
  }

  .metrics-header {
    flex-direction: column;
    align-items: stretch;
    padding: 1.2rem;
  }

  .right-column {
    justify-content: center;
    gap: 1.2rem;
    flex-wrap: wrap;
  }

  .left-column {
    align-items: center;
  }

  .refresh-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
