<template>
  <dialog class="edit-fragment-modal" open>
    <form @submit.prevent="handleSave" class="modal-content">
      <h2 class="modal-title">
        <i class="fas fa-pen"></i> Editar Fragmento
      </h2>
      <p class="modal-subtitle">Modifica el contenido del fragmento seleccionado</p>

      <div class="textarea-wrapper">
        <textarea
          v-model="editedText"
          placeholder="Edita el texto del fragmento..."
          :class="{ error: showError }"
        ></textarea>
        <small class="char-count">{{ editedText.length }} caracteres</small>
      </div>

      <p v-if="showError" class="form-error">El fragmento no puede estar vacío</p>
      <p v-if="showSuccess" class="form-success">Fragmento guardado exitosamente.</p>

      <div class="modal-actions">
        <button type="button" class="cancel-btn" @click="$emit('close')">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="submit" class="confirm-btn">
          <i class="fas fa-save"></i> Guardar Cambios
        </button>
      </div>
    </form>
  </dialog>
</template>

<script>
export default {
  name: 'EditFragmentModal',
  props: {
    fragment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editedText: this.fragment.text,
      showError: false,
      showSuccess: false
    };
  },
  watch: {
    editedText(value) {
      this.showError = value.trim() === '';
      if (this.showSuccess) this.showSuccess = false;
    }
  },
  methods: {
    handleSave() {
      const trimmed = this.editedText.trim();
      if (trimmed === '') {
        this.showError = true;
        this.showSuccess = false;
        return;
      }

      this.showSuccess = true;
      this.showError = false;

      this.$emit('save', {
        ...this.fragment,
        text: trimmed
      });

      setTimeout(() => {
        this.$emit('close');
      }, 1800);
    }
  }
};
</script>

<style scoped>
.edit-fragment-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(17, 24, 39, 0.4); 
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);
  animation: fadeInBackdrop 0.25s ease-out;
}

@keyframes fadeInBackdrop {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content {
  background-color: #fff;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 16px;
  width: 500px;
}

.modal-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  letter-spacing: -0.3px;
  text-shadow: 0.5px 0.5px 0 rgba(0, 0, 0, 0.03);
}

.modal-title i {
  background-color: #e0edff;
  color: #007bff;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 123, 255, 0.1);
  transition: all 0.2s ease-in-out;
}

.modal-subtitle {
  font-size: 1rem;
  color: #4b5563;
  margin-top: -2.5rem;
  line-height: 1.6;
  padding-left: 2.8rem;
  text-align: left; 
}

.textarea-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.textarea-wrapper textarea {
  width: 92%;
  min-height: 160px;
  max-height: 420px;
  resize: none;
  overflow-y: auto;
  padding: 1rem 1.1rem;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  border: 1.6px solid #d1d5db;
  border-radius: 14px;
  background-color: #f9fafb;
  line-height: 1.65;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.03);
  margin-top: -2rem;
}

.textarea-wrapper textarea::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.textarea-wrapper textarea:focus {
  outline: none;
  border-color: #007bff;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.04);
}

.textarea-wrapper textarea.error {
  border-color: #ec1a03;
  background-color: #fffafa;
  box-shadow: 0 0 0 3px rgba(236, 26, 3, 0.08), inset 0 1px 2px rgba(236, 26, 3, 0.1);
}

.char-count {
  position: absolute;
  bottom: -1.8rem;
  right: 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #4b5563;
  background-color: #f1f5f9;
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  font-family: 'Inter', sans-serif;
}

.form-error {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #b91c1c;
  background-color: #fef2f2;
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  border: 1.4px solid #f87171;
  box-shadow: 0 2px 6px rgba(185, 28, 28, 0.08);
  font-family: 'Poppins', sans-serif;
  margin-bottom: -2rem;
}

.form-success {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #059669;
  background-color: #ecfdf5;
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  border: 1.4px solid #34d399;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.1);
  font-family: 'Poppins', sans-serif;
  margin-bottom: -2rem;
  animation: fadeInSuccess 0.3s ease;
}

@keyframes fadeInSuccess {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1rem;
}

.cancel-btn,
.confirm-btn {
  padding: 0.6rem 1.3rem;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.cancel-btn {
  background-color: #e5e7eb;
  color: #1f2937;
}

.cancel-btn:hover {
  background-color: #d1d5db;
}

.confirm-btn {
  background-color: #007bff;
  color: #fff;
}

.confirm-btn:hover {
  background-color: #0056b3;
}

@keyframes fadeIn {
  from {
    transform: translateY(-15px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/*  */
@media (max-width: 600px) {
  .modal-content {
    width: 90vw;
    padding: 1.5rem 1.2rem;
    border-radius: 14px;
    gap: 1.2rem;
  }

  .modal-title {
    font-size: 1.3rem;
    gap: 0.5rem;
  }

  .modal-title i {
    padding: 0.4rem;
    font-size: 0.9rem;
  }

  .modal-subtitle {
    font-size: 0.9rem;
    padding-left: 2.4rem;
    margin-top: -2rem;
  }

  .textarea-wrapper textarea {
    width: 100%;
    font-size: 0.95rem;
    padding: 0.9rem 1rem;
    border-radius: 12px;
    margin-top: -1.5rem;
  }

  .char-count {
    font-size: 0.75rem;
    right: 0.5rem;
    bottom: -1.5rem;
  }

  .form-error,
  .form-success {
    font-size: 0.85rem;
    padding: 0.7rem 1rem;
    margin-bottom: -1.5rem;
  }

  .modal-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .cancel-btn,
  .confirm-btn {
    width: 100%;
    justify-content: center;
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    border-radius: 10px;
  }
}
</style>
