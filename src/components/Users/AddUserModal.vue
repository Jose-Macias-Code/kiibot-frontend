<template>
  <dialog ref="dialog" class="user-modal" @close="onDialogClose">
    <form @submit.prevent="validateAndSubmit" class="modal-content" :class="{ 'fade-out': isClosing }">

      <div v-if="toastMessage" :class="['mini-toast', toastType]">
        {{ toastMessage }}
      </div>

      <h2 class="modal-title">AÑADIR NUEVO USUARIO</h2>
      <p class="modal-subtitle">Añade la información del nuevo usuario</p>

      <div class="user-basic-info">
        <div class="avatar-wrapper" @click="emitTriggerFile" title="Cambiar avatar">
          <img
            :src="previewPhoto || require('../../assets/img/default-avatar.webp')"
            alt="Avatar"
            class="avatar-preview"
            draggable="false"
          />
        </div>

        <div class="user-fields">
          <div class="input-group icon-input">
            <i class="fas fa-user"></i>
            <input type="text" v-model="name" placeholder="Nombre" :class="{ error: invalidFields.name }" :disabled="isDisabled"/>
          </div>

          <div class="input-group icon-input">
            <i class="fas fa-envelope"></i>
            <input type="email" v-model="email" placeholder="Correo" :class="{ error: invalidFields.email }" :disabled="isDisabled"/>
          </div>
        </div>
      </div>

      <input type="file" ref="fileInput" accept="image/*" @change="emitUploadPhoto" style="display: none"/>

      <div class="password-role-row">
        <div class="input-group icon-input password-field">
          <i class="fas fa-lock"></i>
          <input :type="showNewPassword ? 'text' : 'password'" v-model="password" placeholder="Contraseña" :class="{ error: invalidFields.password }" :disabled="isDisabled"/>
          <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" @click="emitTogglePassword" class="toggle"></i>
        </div>

        <div class="input-group icon-input role-field">
          <i class="fas fa-user-tag"></i>
          <select v-model="role" :class="{ error: invalidFields.role }" :disabled="isDisabled">
            <option value="" disabled selected hidden>Rol</option>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>

      <p v-if="localFormError" class="form-error-message">{{ localFormError }}</p>

      <div class="modal-actions">
        <button type="button" class="cancel-btn" @click="emitClose" :disabled="isDisabled">
          Cancelar
        </button>

        <button type="submit" class="confirm-btn" :disabled="isDisabled">
          <template v-if="isSubmitting">
            <i class="fas fa-spinner fa-spin"></i> Enviando...
          </template>
          <template v-else>
            Confirmar
          </template>
        </button>
      </div>

    </form>
  </dialog>
</template>

<script>
export default {
  name: 'AddUserModal',
  props: {
    isOpen: { type: Boolean, required: true },
    previewPhoto: { type: String, default: null },
    showNewPassword: { type: Boolean, required: true },
  },
  emits: ['close', 'submit', 'upload-photo', 'trigger-file', 'toggle-password'],
  data() {
    return {
      name: '',
      email: '',
      password: '',
      role: '',
      localFormError: '',
      invalidFields: { name: false, email: false, password: false, role: false },
      isSubmitting: false,
      toastMessage: '',
      toastType: '',
      isClosing: false,
    };
  },
  computed: {
    isDisabled() {
      return this.isSubmitting || !!this.toastMessage;
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.isClosing = false;
        this.$refs.dialog?.showModal();
        document.body.style.overflow = 'hidden';
      } else {
        this.$refs.dialog?.close();
        document.body.style.overflow = ''; 
      }
    }
  },
  methods: {
    emitClose() {
      this.resetForm();
      this.$emit('close');
    },
    emitUploadPhoto(event) {
      this.$emit('upload-photo', event);
    },
    emitTriggerFile() {
      if (!this.isDisabled) {
        this.$refs.fileInput?.click();
      }
    },
    emitTogglePassword() {
      this.$emit('toggle-password', 'new');
    },
    async validateAndSubmit() {
      this.localFormError = '';
      this.invalidFields = { name: false, email: false, password: false, role: false };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{6,}$/;

      if (!this.name.trim()) this.invalidFields.name = true;
      if (!this.email.trim()) this.invalidFields.email = true;
      if (!this.password.trim()) this.invalidFields.password = true;
      if (!this.role) this.invalidFields.role = true;

      if (!this.name || !this.email || !this.password || !this.role) {
        this.localFormError = 'Por favor, completa todos los campos.';
        return;
      }

      if (!emailRegex.test(this.email)) {
        this.invalidFields.email = true;
        this.localFormError = 'El correo no tiene formato válido.';
        return;
      }

      if (!passwordRegex.test(this.password)) {
        this.invalidFields.password = true;
        this.localFormError = 'La contraseña debe tener al menos 6 caracteres, mayúscula, minúscula y número/símbolo.';
        return;
      }

      this.isSubmitting = true;

      this.$emit('submit', {
        name: this.name.trim(),
        email: this.email.trim(),
        password: this.password.trim(),
        role: this.role,
        done: this.onSubmitDone
      });
    },
    onSubmitDone(success, message) {
      this.toastMessage = message;
      this.toastType = success ? 'success' : 'error';

      setTimeout(() => {
        this.toastMessage = '';
        this.emitClose();
      }, 2500);
    },
    onDialogClose() {
      this.resetForm();
    },
    resetForm() {
      this.name = '';
      this.email = '';
      this.password = '';
      this.role = '';
      this.localFormError = '';
      this.invalidFields = { name: false, email: false, password: false, role: false };
      this.isSubmitting = false;
      this.toastMessage = '';
      this.toastType = '';
      this.isClosing = false;
      document.body.style.overflow = '';
    }
  }
};
</script>

<style scoped>
::backdrop {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.user-modal {
  border: none;
  border-radius: 16px;
  padding: 0;
  width: 100%;
  max-width: 570px;
  max-height: 480px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content {
  padding: 2rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-title {
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
  color: #1f1f1f;
}

.modal-subtitle {
  font-size: 0.95rem;
  text-align: center;
  color: #666;
  margin-top: -1.3rem;
}

.user-basic-info {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.avatar-wrapper {
  margin-top: 0;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 0;
}

.avatar-wrapper:hover .avatar-preview {
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(0, 123, 255, 0.35), 0 0 6px rgba(0, 123, 255, 0.2);
}

.avatar-preview {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
  pointer-events: none;
  user-select: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-width: 220px;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group.full {
  width: 100%;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.65rem 0.9rem 0.65rem 2.6rem;
  border: 1.5px solid #ccc;
  border-radius: 10px;
  font-size: 0.92rem;
  background-color: #f9f9f9;
  color: #333;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-group input::placeholder {
  color: #aaa;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #007bff;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.icon-input i {
  position: absolute;
  left: 0.9rem;
  font-size: 1rem;
  color: #888;
  pointer-events: none;
}

.password-role-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.input-group .toggle {
  left: 17rem;
  pointer-events: auto;
  cursor: pointer;
  transition: color 0.2s ease;
}

.input-group .toggle:hover {
  color: #007bff;
}

.password-field {
  flex: 2;
}

.role-field {
  flex: 1.2;
}

.input-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg fill='%23666' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 16px 16px;
}

.form-error-message {
  color: #ec1a03;
  background-color: #ffecec;
  padding: 0.8rem 1rem;
  border: 1.3px solid #ec1a03;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 500;
  text-align: center;
  margin: 0;
  animation: shake 0.2s ease-in-out;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}

.input-group input.error,
.input-group select.error {
  border: 1.5px solid #ec1a03;
  box-shadow: 0 0 5px rgba(236, 26, 3, 0.5);
  background-color: #fffafa;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

.cancel-btn:hover {
  background-color: #c5c5c5;
}

.confirm-btn {
  background-color: #007bff;
  color: #fff;
}

.confirm-btn:hover {
  background-color: #0056b3;
}

.cancel-btn:disabled,
.confirm-btn:disabled {
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
  opacity: 0.8;
  box-shadow: none;
  transform: none;
  pointer-events: none; 
}

.cancel-btn:disabled:hover,
.confirm-btn:disabled:hover {
  background-color: inherit;
  color: inherit;
}

.mini-toast {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  animation: fadeInOut 2.5s ease forwards;
  z-index: 1000;
}

.mini-toast.success {
  background-color: #28a745;
  color: white;
}

.mini-toast.error {
  background-color: #dc3545;
  color: white;
}

@media (max-width: 430px) {
  .user-modal {
    max-height: none;
    padding: 0 !important;
    border-radius: 12px;
  }

  .modal-content {
    padding: 1.2rem;
    gap: 1rem;
  }

  .avatar-preview {
    width: 70px;
    height: 70px;
  }

  .cancel-btn,
  .confirm-btn {
    font-size: 0.85rem;
    padding: 0.6rem;
    width: 100%;
  }

  .input-group input,
  .input-group select {
    font-size: 0.85rem;
    padding-left: 2.4rem;
  }

  .input-group .toggle {
    right: 0.6rem;
  }

  .user-fields {
    gap: 0.8rem;
  }

  .password-role-row {
    gap: 0.8rem;
  }
}
</style>