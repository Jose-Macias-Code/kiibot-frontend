<template>
  <dialog ref="dialog" class="time-filter-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">
          <i class="fas fa-calendar-alt"></i> Selecciona un rango de fechas
        </h2>
      </div>

      <div class="time-form">
        <div class="time-field">
          <label>Fecha de inicio</label>
          <input type="date" v-model="startDate" @input="validateRange" />
        </div>

        <div class="time-field">
          <label>Fecha de fin</label>
          <input type="date" v-model="endDate" @input="validateRange" />
        </div>

        <p v-if="validationError" class="form-error-message">{{ validationError }}</p>

        <button class="confirm-btn" @click="applyDateRange" :disabled="!startDate || !endDate || Boolean(validationError)">
          <i class="fas fa-check-circle"></i> Aplicar
        </button>
      </div>

      <div class="modal-actions">
        <button class="cancel-btn" @click="close">Cancelar</button>
      </div>
    </div>
  </dialog>
</template>

<script>
export default {
  name: 'ModalDate',
  data() {
    return {
      startDate: '',
      endDate: '',
      validationError: '',
    };
  },
  mounted() {
    if (this.$refs.dialog) {
      this.$refs.dialog.showModal();
    }
  },
  methods: {
    close() {
      this.$refs.dialog.close();
      this.$emit('close');
    },
    applyDateRange() {
      if (!this.startDate || !this.endDate || this.validationError) return;

      const range = {
        start: this.startDate,
        end: this.endDate,
        display: `${this.formatDisplay(this.startDate)} - ${this.formatDisplay(this.endDate)}`
      };

      this.$emit('apply', range);
      this.close();
    },
    validateRange() {
      if (!this.startDate || !this.endDate) {
        this.validationError = '';
        return;
      }

      if (this.endDate < this.startDate) {
        this.validationError = 'La fecha de fin no puede ser menor que la de inicio.';
      } else {
        this.validationError = '';
      }
    },
    formatDisplay(dateStr) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
  },
};
</script>

<style scoped>
.time-filter-modal {
  border: none;
  border-radius: 14px;
  padding: 0;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.15);
  font-family: 'Poppins', sans-serif;
  animation: simpleFadeIn 0.3s ease-out;
  overflow: hidden;
  background-color: white;
}

@keyframes simpleFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 5px 0 5px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f9fbfe;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.time-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #ffffff;
  font-family: 'Inter', sans-serif;
}

.time-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.time-field label {
  font-weight: 600;
  color: #444;
  font-size: 0.95rem;
  margin-left: 0.3rem;
}

.time-field input[type="date"] {
  padding: 0.65rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: 1.6px solid #cbd5e1;
  background-color: #f8fafc;
  transition: border 0.3s ease, box-shadow 0.2s ease;
}

.time-field input[type="date"]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
}

.confirm-btn {
  padding: 0.7rem 1.5rem;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.confirm-btn:disabled {
  background-color: #c2d4ec;
  cursor: not-allowed;
  box-shadow: none;
}

.confirm-btn:hover:not(:disabled) {
  background-color: #0056b3;
  transform: scale(1.01);
}

.cancel-btn {
  background-color: #f1f1f1;
  color: #444;
  font-weight: 500;
  padding: 0.65rem 1.4rem;
  font-size: 0.95rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: background-color 0.25s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: -20px;
}

.cancel-btn:hover {
  background-color: #d1d1d1;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem 1.5rem;
}

.form-error-message {
  color: #e53935;
  background-color: #ffe9e9;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 500;
  margin: 0.2rem 0 0.4rem;
  text-align: left;
}

@media (max-width: 520px) {
  .modal-content {
    padding: 1.2rem;
  }

  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.2rem;
  }

  .modal-title {
    font-size: 1.1rem;
    text-align: center;
  }

  .modal-actions {
    justify-content: center;
  }
}
</style>
