<template>
  <div class="delete-modal">

    <div class="modal-overlay" @click="$emit('cancel')"></div>
    <div class="modal-content">

      <div class="modal-header">
        <h2 class="modal-title">
          <i class="fas fa-exclamation-triangle"></i>
          Confirmar eliminación
        </h2>
        <button class="close-btn" @click="$emit('cancel')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <p class="main-text">
          Estás a punto de eliminar permanentemente el documento
          <span class="doc-name">{{ document.name }}</span><br />
          Se eliminarán todos los fragmentos de conocimiento relacionados y
          <strong>KIIBOT olvidará su información.</strong><br />
          <span class="warning">Esta acción no se puede deshacer.</span>
        </p>

        <label for="confirm-input" class="confirm-label">
          Escribe el nombre del archivo para confirmar:
        </label>
        <input
          id="confirm-input"
          type="text"
          v-model="confirmInput"
          :placeholder="document.name"
          class="confirm-input"
        />

        <div v-if="errorMessage" class="error-message">
          <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="delete-btn"
          :disabled="!canDelete || isDeleting"
          @click="confirmDeletion"
        >
          <i v-if="!isDeleting" class="fas fa-trash-alt"></i>
          <i v-else class="fas fa-spinner fa-spin"></i>
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteConfirm',
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      confirmInput: '',
      errorMessage: '',
      isDeleting: false,
    };
  },
  computed: {
    canDelete() {
      return this.confirmInput.trim() === this.document.name;
    },
  },
  methods: {
    confirmDeletion() {
      if (!this.canDelete) {
        this.errorMessage = 'El nombre no coincide exactamente con el archivo.';
        return;
      }

      this.errorMessage = '';
      this.isDeleting = true;

      setTimeout(() => {
        this.$emit('confirm-delete', this.document);

        this.confirmInput = '';
        this.isDeleting = false;

        this.$emit('close');
      }, 1200);
    },
  },
  watch: {
    document() {
      this.confirmInput = '';
      this.errorMessage = '';
      this.isDeleting = false;
    }
  }
};
</script>

<style scoped>
.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.4);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.modal-content {
  position: relative;
  background-color: #f8f9fa;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  color: #1f2937;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.4s ease;
  border: 1px solid #e5e7eb;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.modal-title i {
  font-size: 1.4rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.3rem;
  color: #6b7280;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  color: #414141;
}

.modal-body {
  text-align: left;
}

.main-text {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #374151;
  line-height: 1.5;
}

.doc-name {
  font-weight: bold;
  color: #111827;
}

.warning {
  color: #f59e0b;
  font-weight: 600;
}

.confirm-label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
  color: #4b5563;
}

.confirm-input {
  width: 58%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #111827;
  font-size: 1rem;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.confirm-input:focus {
  border-color: #dc2626;
  box-shadow: 0 0 6px rgba(220, 38, 38, 0.4);
  outline: none;
}

.error-message {
  margin-top: 0.8rem;
  color: #dc2626;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-footer {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn,
.delete-btn {
  padding: 0.7rem 1.4rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background-color: #e5e7eb;
  color: #374151;
}

.cancel-btn:hover {
  background-color: #d1d5db;
}

.delete-btn {
  background: #dc2626;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.delete-btn:hover {
  background: #b91c1c;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/*  */
@media (max-width: 768px) {
  .modal-content {
    width: 92%;
    padding: 1.6rem 1.2rem;
  }

  .modal-title {
    font-size: 1.3rem;
  }

  .modal-title i {
    font-size: 1.3rem;
  }

  .confirm-input {
    width: 91%;
    font-size: 0.95rem;
  }

  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .delete-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .modal-content {
    border-radius: 0;
    height: 100%;
    max-width: 100%;
    padding: 1.4rem 1rem;
  }

  .modal-title {
    font-size: 1.2rem;
  }

  .main-text {
    font-size: 0.95rem;
  }

  .confirm-label {
    font-size: 0.9rem;
  }

  .confirm-input {
    font-size: 0.9rem;
    padding: 0.6rem 0.9rem;
  }

  .modal-footer {
    margin-top: 1.5rem;
    gap: 0.8rem;
  }

  .delete-btn,
  .cancel-btn {
    font-size: 0.9rem;
    padding: 0.65rem 1rem;
  }
}
</style>
