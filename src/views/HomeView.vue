<template>
  <div class="profile-page">

    <div class="profile-header">
      <div class="profile-photo">
        <img :src="profileImage" alt="Foto de perfil" />
        <label v-if="isEditing" class="edit-icon">
          <i class="fas fa-camera"></i>
          <input type="file" @change="updateProfileImage" hidden />
        </label>
      </div>

      <div class="profile-info">
        <div class="info-row">
          <input 
            :readonly="!isEditing" 
            v-model="name" 
            :class="['editable-field', nameError && 'invalid']"
          />
          <p v-if="nameError && isEditing" class="field-error">{{ nameError }}</p>

          <input 
            :readonly="!isEditing" 
            v-model="email" 
            :class="['editable-field', emailError && 'invalid']"
          />
          <p v-if="emailError && isEditing" class="field-error">{{ emailError }}</p>

          <div v-if="toastMessage" :class="['toast', toastType]" @click="closeToast">
            {{ toastMessage }}
          </div>
        </div>
      </div>

      <div class="actions">
        <i v-if="!isEditing" class="fas fa-pencil-alt" @click="toggleEdit" title="Editar perfil"></i>
        <i v-else :class="['fas', isSaving ? 'fa-spinner fa-spin' : 'fa-save']" @click="saveChanges" title="Guardar cambios"></i>
        <i class="fas fa-key" @click="showChangePassword = true" title="Cambiar contraseña"></i>
        <i class="fas fa-sign-out-alt" @click="handleLogout" title="Cerrar sesión"></i>
      </div>
    </div>

    <div class="metrics-section">
      <div class="metric-card">
        <i class="fas fa-paper-plane icon"></i>
        <h3>Mensajes enviados</h3>
        <p>{{ metrics.sentMessages }}</p>
      </div>
      <div class="metric-card">
        <i class="fas fa-robot icon"></i>
        <h3>Respondidos por el bot</h3>
        <p>{{ metrics.botReplies }}</p>
      </div>
      <div class="metric-card">
        <i class="fas fa-comments icon"></i>
        <h3>Cantidad de chats</h3>
        <p>{{ metrics.totalChats }}</p>
      </div>
    </div>

    <div v-if="showChangePassword" class="modal-overlay" @click.self="closeChangePasswordModal">
      <div class="modal-password clean">
        <h2>CAMBIAR CONTRASEÑA</h2>
        <p class="subtext">Introduce y confirma tu nueva contraseña</p>

        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input 
            :type="showNewPassword ? 'text' : 'password'" 
            v-model="newPassword" 
            placeholder="Contraseña"
          />
          <i 
            :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" 
            @click="togglePassword('new')" 
            class="toggle"
          ></i>
        </div>

        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            v-model="confirmPassword" 
            placeholder="Repetir contraseña"
          />
          <i 
            :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" 
            @click="togglePassword('confirm')" 
            class="toggle"
          ></i>
        </div>

        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <div v-if="passwordToastMessage" :class="['toast', passwordToastType]" @click="closePasswordToast">
          {{ passwordToastMessage }}
        </div>

        <ul class="rules-list">
          <li :class="{ valid: passwordValidations.hasUppercase }">
            <i class="fas" :class="passwordValidations.hasUppercase ? 'fa-check-circle' : 'fa-times-circle'"></i>
            Una letra mayúscula
          </li>
          <li :class="{ valid: passwordValidations.hasLowercase }">
            <i class="fas" :class="passwordValidations.hasLowercase ? 'fa-check-circle' : 'fa-times-circle'"></i>
            Una letra minúscula
          </li>
          <li :class="{ valid: passwordValidations.minLength }">
            <i class="fas" :class="passwordValidations.minLength ? 'fa-check-circle' : 'fa-times-circle'"></i>
            8 caracteres como mínimo
          </li>
          <li :class="{ valid: passwordValidations.hasNumberOrSpecial }">
            <i class="fas" :class="passwordValidations.hasNumberOrSpecial ? 'fa-check-circle' : 'fa-times-circle'"></i>
            Un número y/o carácter especial
          </li>
        </ul>

        <button class="btn-change" @click="changePassword" :disabled="isChangingPassword">
          <i v-if="isChangingPassword" class="fas fa-spinner fa-spin"></i>
          <template v-else>Cambiar contraseña</template>
        </button>

        <button class="btn-cancel" @click="closeChangePasswordModal" :disabled="isChangingPassword">
          Cancelar
        </button>
      </div>
    </div>

    <div v-if="isLoggingOut" class="logout-modal-overlay">
      <div class="logout-modal">
        <img 
          src="../assets/img/saludo.webp" 
          alt="Robot despidiéndose" 
          class="logout-image" 
          loading="lazy"
        />
        <p>Hasta luego, {{ name }} 👋</p>
      </div>
    </div>

  </div>
</template>

<script>
import { bus } from '@/eventBus'

export default {
  name: "ProfileView",
  data() {
    return {
      profileImage: localStorage.getItem("profile_photo") || require('@/assets/img/default-avatar.webp'),
      name: localStorage.getItem("name") || "",
      email: localStorage.getItem("email") || "",
      isEditing: false,
      newPassword: "",
      confirmPassword: "",
      showChangePassword: false,
      metrics: {
        sentMessages: 356,
        botReplies: 289,
        totalChats: 72,
      },
      isLoggingOut: false,
      showNewPassword: false,
      showConfirmPassword: false,
      errorMessage: "",
      nameError: '',
      emailError: '',
      isSaving: false,
      toastMessage: '',
      toastType: '',
      passwordToastMessage: '',
      passwordToastType: '',
      isChangingPassword: false,
    };
  },
  computed: {
    passwordValidations() {
      const pwd = this.newPassword;
      return {
        hasUppercase: /[A-Z]/.test(pwd),
        hasLowercase: /[a-z]/.test(pwd),
        hasNumberOrSpecial: /[\d\W]/.test(pwd),
        minLength: pwd.length >= 8,
      };
    }
  },
  watch: {
    showChangePassword(newVal) {
      document.body.style.overflow = newVal ? "hidden" : "";
    }
  },
  methods: {
    toggleEdit() {
      this.isEditing = true;
    },
    async saveChanges() {
      this.nameError = '';
      this.emailError = '';
      this.isSaving = true;

      const nameValid = this.name.trim().length >= 3;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());

      if (!nameValid) this.nameError = 'El nombre debe tener al menos 3 caracteres.';
      if (!emailValid) this.emailError = 'El correo no es válido.';

      if (!nameValid || !emailValid) {
        this.isSaving = false;
        return;
      }

      localStorage.setItem("name", this.name);
      localStorage.setItem("email", this.email);

      this.isEditing = false;
      this.isSaving = false;
      this.showToast("Perfil actualizado exitosamente.", "success");
    },
    showToast(message, type = "success") {
      this.toastMessage = message;
      this.toastType = type;
      setTimeout(() => {
        this.toastMessage = '';
        this.toastType = '';
      }, 2000); 
    },
    closeToast() {
      this.toastMessage = '';
      this.toastType = '';
    },
    async updateProfileImage(event) { 
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Image = e.target.result;
          this.profileImage = base64Image;

          localStorage.setItem("profile_photo", base64Image);
          bus.emit('profile-updated', base64Image);
        };
        reader.readAsDataURL(file);
      }
    },
    async changePassword() {
      const v = this.passwordValidations;

      if (!v.hasUppercase || !v.hasLowercase || !v.minLength || !v.hasNumberOrSpecial) {
        this.errorMessage = "Tu contraseña no cumple con los requisitos.";
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = "Las contraseñas no coinciden.";
        return;
      }

      this.isChangingPassword = true;

      setTimeout(() => {
        this.showPasswordToast("Contraseña cambiada exitosamente.", "success");
        this.errorMessage = "";
        this.showChangePassword = false;
        this.newPassword = "";
        this.confirmPassword = "";
        this.isChangingPassword = false;
      }, 2000);
    },
    showPasswordToast(message, type = "success") {
      this.passwordToastMessage = message;
      this.passwordToastType = type;
      setTimeout(() => {
        this.passwordToastMessage = '';
        this.passwordToastType = '';
      }, 2500); 
    },
    closeChangePasswordModal() {
      if (this.isChangingPassword) return; 
      this.showChangePassword = false;
    },
    closePasswordToast() {
      this.passwordToastMessage = '';
      this.passwordToastType = '';
    },
    togglePassword(field) {
      if (field === "new") this.showNewPassword = !this.showNewPassword;
      if (field === "confirm") this.showConfirmPassword = !this.showConfirmPassword;
    },
    async handleLogout() {
      this.isLoggingOut = true;

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("profile_photo");

      setTimeout(() => {
        this.$router.push("/login");
      }, 2000);
    }
  }
};
</script>

<style scoped>
.profile-page {
  max-width: 1000px;
  margin: 1rem auto;
  padding: 30px;
  font-family: 'Poppins', sans-serif;
}

.profile-header {
  margin-top: -20px;
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 25px;
  background-color: #fafafa;
  border-bottom: 2px solid #eee;
  border-radius: 12px;
  position: relative;
}

.profile-photo {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  position: relative;
}

.profile-photo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4a4a4a;
}

.edit-icon {
  position: absolute;
  bottom: -6px;
  right: -6px;
  background: #fff;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: background 0.3s ease;
}

.edit-icon:hover {
  background: #e9e9e9;
}

.edit-icon i {
  font-size: 16px;
  color: #4a4a4a;
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.editable-field {
  padding: 10px 14px;
  border: 1.5px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #333;
  font-weight: 500;
}

.editable-field:read-only {
  background-color: #f0f0f0;
  color: #6b7280;
  border: 1.5px solid #ddd;
  cursor: default;
  user-select: none;
  pointer-events: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.editable-field:not(:read-only):focus {
  outline: none;
  border-color: #007bff;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.field-error {
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
  animation: fadeIn 0.3s ease;
  text-align: left;
  padding: 0;
  margin: 0 0 0 15px;
}

.editable-field.invalid {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
  background-color: #fff5f5;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.actions i {
  font-size: 18px;
  color: #4a4a4a;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;
}

.actions i:hover {
  color: #222;
  transform: scale(1.2);
}

.metrics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 28px;
  margin-top: 45px;
  padding: 0 15px;
}

.metric-card {
  position: relative;
  background: linear-gradient(145deg, #ffffff, #f8f9fb);
  border-radius: 18px;
  padding: 30px 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
  text-align: center;
  border: 1.5px solid #e5e7eb;
  transition: all 0.3s ease;
  overflow: hidden;
}

.metric-card .icon {
  background-color: #007bff; 
  color: white;
  font-size: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: background 0.3s ease;
}

.metric-card h3 {
  font-size: 14.5px;
  color: #4b5563;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 6px;
  letter-spacing: 0.7px;
}

.metric-card p {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-in-out;
  pointer-events: all;
}

.modal-password.clean {
  background: #fff;
  padding: 20px 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  text-align: center;
  animation: slideUp 0.4s ease;
  font-family: 'Poppins', sans-serif;
}

.modal-password.clean h2 {
  font-size: 26px;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Roboto Slab', serif;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 0;
}

.modal-password.clean .subtext {
  font-size: 15px;
  font-weight: 400;
  color: #6b7280;
  font-family: 'Inter', sans-serif; 
  margin-bottom: 25px;
  margin-top: -25px !important; 
  padding: 0;
  line-height: 1.4;
}

.input-group {
  position: relative;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-group input {
  width: 100%;
  padding: 12px 40px 12px 38px;
  font-size: 15px;
  border-radius: 10px;
  border: 1.5px solid #d0d5dd;
  background-color: #f9f9f9;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.input-group input:focus {
  border-color: #007bff;
  outline: none;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.15);
}

.input-group i {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #a3a3a3;
  font-size: 16px;
  pointer-events: none;
}

.input-group i.fas.fa-lock {
  left: 12px;
}

.input-group .toggle {
  right: 12px;
  pointer-events: auto;
  cursor: pointer;
  transition: color 0.2s ease;
}

.input-group .toggle:hover {
  color: #4a90e2;
}

.error-text {
  margin-top: -5px;
  margin-bottom: 25px;
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.rules-list {
  margin: 30px 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 30px;
}

.rules-list li {
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a1a1aa;
  font-weight: 500;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.rules-list li.valid {
  color: #22c55e;
}

.rules-list li:not(.valid) {
  color: #626262;
}

.rules-list i {
  font-size: 16px;
  transition: color 0.3s ease;
}

.rules-list li.valid i {
  color: #22c55e;
}

.rules-list li:not(.valid) i {
  color: #ef4444;
}

.btn-change {
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px;
  font-size: 16px;
  border-radius: 10px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-change:hover {
  background-color: #0064d6;
}

.btn-cancel {
  width: 100%;
  background-color: #e5e7eb;
  color: #333;
  border: none;
  padding: 12px;
  font-size: 16px;
  border-radius: 10px;
  font-weight: 500;
  margin-top: 12px;
  transition: background-color 0.3s ease;
}

.btn-cancel:hover {
  background-color: #c8c9cc;
}

.btn-change:disabled {
  background-color: #9ca3af; 
  cursor: not-allowed;
}

.logout-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-in-out;
  pointer-events: all;
}

.logout-modal {
  background: linear-gradient(145deg, #ffffff, #f3f3f3);
  padding: 20px 10px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  text-align: center;
  max-width: 360px;
  width: 90%;
  animation: slideUp 0.4s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #e3e3e3;
  position: relative;
}

@keyframes slideUp {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.logout-image {
  width: 130px;
  height: auto;
  margin-bottom: 25px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.logout-modal p {
  font-size: 20px;
  font-weight: 600;
  color: #2e2e2e;
  animation: fadePulse 1.8s ease-in-out infinite;
  margin-top: 0;
  font-family: 'Poppins', sans-serif;
}

@keyframes fadePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.65; }
}

/*  */
.toast {
  position: relative;
  margin-top: 5px;
  background: #ffff;
  color: #374151;
  border-radius: 12px;
  padding: 12px 18px;
  font-size: 14.5px;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  animation: toastFadeIn 0.4s ease, toastFadeOut 0.5s ease 2.8s;
  transition: all 0.3s ease;
  z-index: 5;
  max-width: 100%;
  letter-spacing: 0.25px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast.success {
  border-left: 5px solid #10b981;
}

.toast.error {
  border-left: 5px solid #ef4444;
}

@keyframes toastFadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toastFadeOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-6px) scale(0.95);
  }
}

/*  */
@media screen and (max-width: 1024px) {
  .profile-page {
    padding: 20px;
    margin: 2rem auto;
  }

  .metrics-section {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    padding: 0;
  }
}

@media screen and (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .profile-photo {
    width: 100px;
    height: 100px;
  }

  .edit-icon {
    padding: 6px;
  }

  .editable-field {
    font-size: 15px;
    padding: 10px 12px;
  }

  .actions {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 15px;
  }

  .metric-card {
    padding: 25px 16px;
  }

  .metric-card p {
    font-size: 20px;
  }

  .metric-card h3 {
    font-size: 13px;
  }

  .modal-password.clean {
    padding: 25px 20px;
  }

  .rules-list {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

@media screen and (max-width: 480px) {
  .metric-card {
    padding: 22px 14px;
  }

  .metric-card .icon {
    width: 42px;
    height: 42px;
    font-size: 18px;
    margin-bottom: 12px;
  }

  .logout-modal {
    width: 92%;
    padding: 18px;
  }

  .logout-image {
    width: 100px;
    margin-bottom: 18px;
  }

  .logout-modal p {
    font-size: 18px;
  }
}
</style>
