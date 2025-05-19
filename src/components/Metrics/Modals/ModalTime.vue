<template>
  <dialog ref="dialog" class="user-modal time-filter-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">
          <i class="fas fa-clock"></i> Selecciona un rango de hora
        </h2>
      </div>

      <div class="time-form">
        <div class="time-field">
          <label for="start-time">Hora de inicio</label>
          <input id="start-time" type="time" v-model="customStart" @input="validateTimes" />
        </div>

        <div class="time-field">
          <label for="end-time">Hora de fin</label>
          <input id="end-time" type="time" v-model="customEnd" @input="validateTimes" />
        </div>

        <p v-if="validationError" class="form-error-message">{{ validationError }}</p>

        <button class="confirm-btn" @click="applyCustom" :disabled="!customStart || !customEnd || Boolean(validationError)" >
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
  name: 'ModalTime',
  data() {
    return {
      customStart: '',
      customEnd: '',
      validationError: ''
    };
  },
  mounted() {
    this.openDialog();
  },
  methods: {
    openDialog() {
      const dialog = this.$refs.dialog;
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    },
    close() {
      const dialog = this.$refs.dialog;
      if (dialog && typeof dialog.close === 'function') {
        dialog.close();
      }
      this.$emit('close');
      this.resetForm();
    },
    applyCustom() {
      if (!this.customStart || !this.customEnd || this.validationError) return;

      const start12h = this.formatTo12h(this.customStart);
      const end12h = this.formatTo12h(this.customEnd);

      this.$emit('apply', {
        start12h,
        end12h
      });

      this.close();
    },
    validateTimes() {
      if (!this.customStart || !this.customEnd) {
        this.validationError = '';
        return;
      }

      if (this.customStart >= this.customEnd) {
        this.validationError = 'La hora de inicio debe ser menor que la hora de fin.';
      } else {
        this.validationError = '';
      }
    },
    formatTo12h(time24) {
      const [hourStr, minute] = time24.split(':');
      let hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;
      return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
    },
    resetForm() {
      this.customStart = '';
      this.customEnd = '';
      this.validationError = '';
    }
  }
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

.time-filter-modal .modal-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 5px 0 5px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f9fbfe;
}

.time-filter-modal .modal-title {
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

.time-field input[type="time"] {
  padding: 0.65rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: 1.6px solid #cbd5e1;
  background-color: #f8fafc;
  transition: border 0.3s ease, box-shadow 0.2s ease;
}

.time-field input[type="time"]:focus {
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

  .time-filter-modal .modal-header {
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