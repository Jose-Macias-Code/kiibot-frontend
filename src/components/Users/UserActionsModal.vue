<template>
    <dialog ref="dialog" class="user-modal user-actions-dialog">
      <div class="modal-content">

        <div class="user-actions-header">

          <div class="user-info-block">
            <img
              :src="selectedUser?.profile_photo || require('../../assets/img/default-avatar.webp')"
              class="avatar"
              alt="Avatar"
            />
            <div class="user-text-block">
              <h2 class="user-name">{{ selectedUser?.name }}</h2>
              <p class="user-email">{{ selectedUser?.email }}</p>
            </div>
          </div>

          <div class="user-actions-icons">
            <div @click="togglePasswordChange" class="action-icon" :class="[{ active: showPasswordInput }, { disabled: isAnyLoading || selectedUser?.is_online }, { loading: isLoadingPassword }]">
              <i v-if="!isLoadingPassword" class="fas fa-key"></i>
              <i v-else class="fas fa-spinner fa-spin"></i>
            </div>

            <div @click="toggleRole" class="action-icon" :class="[selectedUser?.role === 'admin' ? 'admin-role' : 'user-role', { disabled: isAnyLoading || selectedUser?.is_online }, { loading: isLoadingRole }]">
              <i v-if="!isLoadingRole" :class="selectedUser?.role === 'admin' ? 'fas fa-user-minus' : 'fas fa-user-plus'"></i>
              <i v-else class="fas fa-spinner fa-spin"></i>
            </div>

            <div @click="toggleDeleteConfirm" class="action-icon danger" :class="[{ active: showDeleteConfirm }, { disabled: isAnyLoading || selectedUser?.is_online }, { loading: isLoadingDelete }]">
              <i v-if="!isLoadingDelete" class="fas fa-trash-alt"></i>
              <i v-else class="fas fa-spinner fa-spin"></i>
            </div>
          </div>

          <div class="user-attributes-row">
            <div class="attribute">
              <span class="label">ID:</span>
              <span class="value">{{ selectedUser?.id }}</span>
            </div>
            <div class="attribute">
              <span class="label">Último Acceso:</span>
              <span class="value">{{ selectedUser?.last_seen_text }}</span>
            </div>
            <div class="attribute">
              <span class="label">Estado:</span>
              <span
                class="value"
                :class="selectedUser?.is_online ? 'connected' : 'disconnected'"
              >
                {{ selectedUser?.is_online ? 'Conectado' : 'Desconectado' }}
              </span>
            </div>
            <div class="attribute">
              <span class="label">Rol:</span>
              <span
                class="value"
                :class="selectedUser?.role === 'admin' ? 'admin-role' : 'user-role'"
              >
                {{ selectedUser?.role || 'usuario' }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="showPasswordInput" class="input-group icon-input">
          <i class="fas fa-lock"></i>
          <input 
            :type="showNewPassword ? 'text' : 'password'" 
            v-model="newUserPassword"
            placeholder="Contraseña"
            :class="{ error: passwordError }"
          />
          <i 
            :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" 
            @click="togglePassword('new')" 
            class="toggle"
          ></i>
        </div>

        <p v-if="passwordError" class="form-error-message">{{ passwordError }}</p>
        <p v-if="successMessage" class="form-success-message"> {{ successMessage }} </p>

        <div v-if="showPasswordInput" class="modal-actions">
          <button class="confirm-btn" @click="submitNewPassword">Guardar contraseña</button>
        </div>

        <div v-if="showDeleteConfirm" class="delete-confirm-box">
          <p>¿Seguro que deseas eliminar a <strong>{{ selectedUser?.name }}</strong>?</p>
          <div class="modal-actions">
            <button class="cancel-btn" @click="toggleDeleteConfirm">Cancelar</button>
            <button class="confirm-btn danger" @click="deleteUser">Eliminar</button>
          </div>
        </div>

        <div class="modal-actions" v-if="!showDeleteConfirm && !showPasswordInput">
          <button class="cancel-btn" @click="close" :disabled="isAnyLoading">Cerrar</button>
        </div>
      </div>
    </dialog>
</template>

<script>
export default {
  name: 'UserActionsModal',
  props: {
    user: Object,
    isOpen: Boolean
  },
  data() {
    return {
      selectedUser: null,
      showPasswordInput: false,
      showNewPassword: false,
      newUserPassword: '',
      passwordError: '',
      successMessage: '',
      showDeleteConfirm: false,
      isLoadingPassword: false,
      isLoadingRole: false,
      isLoadingDelete: false,
    };
  },
  watch: {
    user: {
      immediate: true,
      handler(newVal) {
        this.selectedUser = { ...newVal };
      }
    },
    isOpen(val) {
      const modal = this.$refs.dialog;
      if (val && modal) modal.showModal();
      if (!val && modal) modal.close();
    }
  },
  computed: {
    isAnyLoading() {
      return this.isLoadingPassword || this.isLoadingRole || this.isLoadingDelete;
    }
  },
  methods: {
    close() {
      this.$emit('close');
      this.resetState();
    },
    resetState() {
      this.showPasswordInput = false;
      this.newUserPassword = '';
      this.showDeleteConfirm = false;
    },
    togglePasswordChange() {
      if (this.showDeleteConfirm) return;

      this.showPasswordInput = !this.showPasswordInput;

      if (!this.showPasswordInput) {
        this.passwordError = '';
      } else {
        this.showDeleteConfirm = false;
      }
    },
    async submitNewPassword() {
      const pwd = this.newUserPassword.trim();
      if (!pwd) {
        this.passwordError = 'Contraseña vacía.';
        return;
      }

      const errors = [];
      if (pwd.length < 6) errors.push('mínimo 6 caracteres');
      if (!/[a-z]/.test(pwd)) errors.push('una letra minúscula');
      if (!/[A-Z]/.test(pwd)) errors.push('una letra mayúscula');
      if (!/[\d\W]/.test(pwd)) errors.push('un número o símbolo');

      if (errors.length > 0) {
        this.passwordError = `La contraseña debe contener ${errors.join(', ')}.`;
        setTimeout(() => (this.passwordError = ''), 3500);
        return;
      }

      this.successMessage = "Contraseña actualizada localmente (simulado)";
      this.showPasswordInput = false;
      this.newUserPassword = "";

      setTimeout(() => (this.successMessage = ""), 2500);
    },
    togglePassword(field) {
      if (field === "new") this.showNewPassword = !this.showNewPassword;
    },
   toggleRole() {
      if (this.selectedUser.is_online || this.isAnyLoading) return;
      const newRole = this.selectedUser.role === "admin" ? "user" : "admin";
      this.selectedUser.role = newRole;
      this.successMessage = "Rol cambiado localmente (simulado)";
      this.$emit("change-role", { id: this.selectedUser.id, newRole });
      setTimeout(() => (this.successMessage = ""), 2000);
    },
    toggleDeleteConfirm() {
      if (this.showPasswordInput) return;

      this.showDeleteConfirm = !this.showDeleteConfirm;
      if (this.showDeleteConfirm) {
        this.showPasswordInput = false;
      }
    },
    deleteUser() {
      this.$emit("delete-user", this.selectedUser.id);
      this.successMessage = "Usuario eliminado localmente";
      setTimeout(() => {
        this.successMessage = "";
        this.close();
      }, 2000);
    },
  }
};
</script>

<style scoped>
.user-modal {
  border: none;
  border-radius: 16px;
  padding: 0;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.3s ease;
  overflow: hidden;
}

.modal-content {
  padding: 2rem;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.user-actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  background: linear-gradient(90deg, #f7faff, #ffffff);
  border-radius: 10px;
  padding: 1.5rem 1.5rem 1.8rem;
  box-shadow: 0 3px 8px rgba(0, 123, 255, 0.10);
}

.user-info-block {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex: 1;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #007bff;
  box-shadow: 0 0 12px rgba(0, 123, 255, 0.25);
  background-color: #fff;
}

.user-text-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.user-name {
  margin: 15px 0 0 0;
  padding: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.3px;
  text-align: left;
}

.user-email {
  font-size: 0.94rem;
  font-weight: 500;
  color: #6a6a6a;
  opacity: 0.85;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: -15px 0 0 0;
  padding: 0;
}

.user-actions-icons {
  display: flex;
  gap: 1.3rem;
}

.action-icon {
  font-size: 1.5rem;
  color: #5e5e5e;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
  padding: 0.5rem;
  border-radius: 40%;
  background-color: #f1f5f9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.action-icon:hover {
  color: #007bff;
  background-color: #e6f0ff;
  transform: scale(1.1);
}

.action-icon.danger:hover {
  color: #e53935;
  background-color: #ffecec;
}

.action-icon.active {
  background-color: #e6f0ff;
  color: #007bff;
  box-shadow: inset 0 0 0 2px #007bff;
  border-radius: 40%;
  padding: 0.5rem;
}

.action-icon.danger.active {
  background-color: #ffecec;
  color: #e53935;
  box-shadow: inset 0 0 0 2px #e53935;
}

.action-icon.disabled:not(.loading) {
  opacity: 0.4;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.user-attributes-row {
  display: grid;
  grid-template-columns: 0.1fr 1.5fr 1.5fr 0.9fr;
  gap: 1.8rem;
  font-size: 0.94rem;
  height: 3rem;
  margin-top: 0;
  align-items: center;
  justify-content: center;
}

.attribute {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.25rem;
  border-left: 3.5px solid #cccccc;
  padding-left: 0.8rem;
  transition: border-color 0.2s ease-in-out;
}

.label {
  font-weight: 500;
  color: #6a6a6a;
  font-size: 0.82rem;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  opacity: 0.85;
}

.value {
  font-weight: 600;
  font-size: 1rem;
  color: #212121;
  word-break: break-word;
  line-height: 1.3;
}

.value.connected {
  color: #28a745;
}

.value.disconnected {
  color: #d9534f;
}

.value.admin-role {
  color: #007bff;
}

.value.user-role {
  color: #6c757d;
}

.input-group.icon-input {
  position: relative;
}

.input-group input {
  width: 87%;
  padding: 0.75rem 1rem 0.75rem 2.8rem;
  border: 1.6px solid #d1d5db;
  border-radius: 12px;
  background-color: #f8f9fb;
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  transition: all 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.input-group input:focus {
  outline: none;
  background-color: #fff;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.input-group i {
  position: absolute;
  top: 50%;
  left: 0.9rem;
  transform: translateY(-50%);
  color: #888;
  font-size: 1rem;
}

.input-group .toggle {
  left: 29rem;
  pointer-events: auto;
  transform: translateY(-50%);
  font-size: 1rem;
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease;
}

.input-group .toggle:hover {
  color: #4a90e2;
}

input.error {
  border: 1.5px solid #e53935 !important;
  background-color: #fff6f6;
}

.form-error-message {
  color: #e53935;
  background-color: #ffe9e9;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  margin-top: 0.4rem;
  text-align: left;
  margin: 0;
}

.form-success-message {
  color: #28a745;
  background-color: #e8f6ec;
  padding: 0.65rem 1rem;
  border: 1px solid #28a74555;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  margin-top: 1rem;
  animation: fadeInOut 2.5s ease-in-out;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-5px); }
  15% { opacity: 1; transform: translateY(0); }
  85% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-5px); }
}

.delete-confirm-box {
  background: linear-gradient(135deg, #fff4f4, #ffeaea);
  border-left: 5px solid #e53935;
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 4px 14px rgba(229, 57, 53, 0.08);
  text-align: left;
  animation: fadeIn 0.3s ease-in-out;
  position: relative;
}

.delete-confirm-box p {
  margin: 0 0 1rem;
  font-size: 0.96rem;
  font-weight: 500;
  color: #b91c1c;
}

.delete-confirm-box strong {
  color: #333;
}

.delete-confirm-box .modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.delete-confirm-box .confirm-btn.danger {
  background-color: #e53935;
  color: #fff;
  font-weight: 600;
}

.delete-confirm-box .confirm-btn.danger:hover {
  background-color: #c62828;
}

.delete-confirm-box .cancel-btn {
  background-color: #f1f1f1;
  color: #444;
  font-weight: 500;
}

.delete-confirm-box .cancel-btn:hover {
  background-color: #e2e2e2;
}

.cancel-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transition: opacity 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
}

.cancel-btn,
.confirm-btn {
  padding: 0.65rem 1.5rem;
  font-size: 0.93rem;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  letter-spacing: 0.4px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #444;
}

.cancel-btn:hover {
  background-color: #d9d9d9;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.07);
}

.confirm-btn {
  background-color: #007bff;
  color: #fff;
}

.confirm-btn:hover {
  background-color: #0056b3;
  box-shadow: 0 3px 10px rgba(0, 123, 255, 0.25);
}

.confirm-btn.danger {
  background-color: #e53935;
  color: #fff;
}

.confirm-btn.danger:hover {
  background-color: #c62828;
  box-shadow: 0 3px 10px rgba(229, 57, 53, 0.25);
}

@keyframes fadeIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .modal-content {
    padding: 1.2rem;
  }
  .user-actions-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .user-info-block {
    order: 1;
    width: 100%;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .avatar-large {
    width: 70px;
    height: 70px;
    margin-bottom: 0.5rem;
  }
  .user-actions-icons {
    order: 2;
    width: 100%;
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  .user-attributes-row {
    display: none !important;
  }
  .modal-actions {
    justify-content: center;
  }
  .input-group input {
    width: 80%;
  }
  .input-group .toggle {
    left: 18rem;
    transform: translateY(-50%);
  }
}
</style>