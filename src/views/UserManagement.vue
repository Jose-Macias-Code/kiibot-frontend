<template>
  <div class="user-management-container">
    <div class="user-header">
      <div class="header-row">
        <h2 class="header-title">Usuarios <span class="txt-blue">KIIBOT</span> </h2>
        <button @click="openAddUserModal" class="add-user-btn">
          <i class="fas fa-user-plus"></i> Añadir Usuario
        </button>
      </div>

      <div class="header-filters">
        <input
          v-model="searchQuery" 
          type="text"
          placeholder="Buscar por nombre, correo o id ..."
          class="filter-input"
        />
      </div>
    </div>

    <div v-if="isLoading" class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i> Cargando Usuarios ...
    </div>

    <table class="user-table" v-else-if="filteredUsers.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Último acceso</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>
            <div class="user-box">
              <img :src="user.profile_photo || require('../assets/img/default-avatar.webp')" alt="Foto de perfil" class="profile-pic">
              <div class="user-text">
                <span class="name">{{ user.name }}</span>
                <span class="email">{{ user.email }}</span>
              </div>
            </div>
          </td>
          <td class="last-access">{{ user.last_seen_text }}</td>
          <td>
            <span
              class="status-led"
              :class="user.is_online ? 'online' : 'offline'"
              :title="user.is_online ? 'Conectado' : 'Desconectado'"
            ></span>
          </td>
          <td>
            <button class="action-btn" @click="openUserActionsModal(user)">
              <i class="fas fa-cog"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-users-slash"></i>
      </div>
      <p class="empty-title">No se encontraron usuarios</p>
      <small class="empty-subtext">
        Añade nuevos usuarios o ajusta tu búsqueda para comenzar a gestionar tu equipo en KIIBOT.
      </small>
    </div>

    <UserActionsModal
      :user="selectedUser"
      :isOpen="showUserActionsModal"
      @close="showUserActionsModal = false"
      @change-password="handlePasswordChange"
      @change-role="handleRoleChange"
      @delete-user="handleUserDelete"
    />

    <AddUserModal
      :is-open="showAddUserModal"
      :preview-photo="previewPhoto"
      :show-new-password="showNewPassword"
      :invalid-fields="invalidFields"
      :form-error="formError"
      @close="closeAddUserModal"
      @submit="handleAddUser"
      @upload-photo="handlePhotoUpload"
      @toggle-password="togglePassword"
      @update-new-password="(val) => { newPassword = val }"
    />

    <div v-if="showToast" class="toast-message">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import UserActionsModal from '../components/Users/UserActionsModal.vue';
import AddUserModal from '../components/Users/AddUserModal.vue';

import mockUsers from '@/data/users';

export default {
  name: 'UserManagement',
  data() {
    return {
      previewPhoto: null,
      showNewPassword: false,
      newPassword: '', 
      formError: '',
      invalidFields: { name: false, email: false, password: false, role: false },
      selectedUser: null,
      showUserActionsModal: false,
      showAddUserModal: false,
      searchQuery: "",
      toastMessage: '',
      showToast: false,
      users: [],
      isLoading: true,
    };
  },
  components: {
    UserActionsModal,
    AddUserModal 
  },
  computed: {
    filteredUsers() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) return this.users;
      return this.users.filter(user => {
        const name = user.name.toLowerCase();
        const email = user.email.toLowerCase();
        const id = String(user.id);
        return name.includes(query) || email.includes(query) || id.includes(query);
      });
    }
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      const saved = localStorage.getItem("kiibot_users");
      this.users = saved ? JSON.parse(saved) : [...mockUsers];
      this.saveUsers();
      this.isLoading = false;
    },
    saveUsers() {
      localStorage.setItem("kiibot_users", JSON.stringify(this.users));
    },
    openAddUserModal() {
      this.showAddUserModal = true;
    },
    closeAddUserModal() {
      this.showAddUserModal = false;
      this.previewPhoto = null;
      this.newPassword = '';
      this.formError = '';
      this.invalidFields = { name: false, email: false, password: false, role: false };
    },
    handleAddUser({ name, email, role, done }) {
      const newId = this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        name,
        email,
        role,
        profile_photo: this.previewPhoto || "",
        last_seen_text: "Justo ahora",
        is_online: false
      };

      this.users.push(newUser);
      this.saveUsers();

      done(true, "Usuario añadido exitosamente");
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewPhoto = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    togglePassword(field) {
      if (field === "new") {
        this.showNewPassword = !this.showNewPassword;
      }
    },
    showSuccessToast(message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 2500);
    },
    openUserActionsModal(user) {
      this.selectedUser = user;
      this.showUserActionsModal = true;
    },
    handlePasswordChange({ id }) {
      console.log(`Se ha cambiado la contraseña para el usuario con ID ${id}`);
    },
    handleRoleChange({ id, newRole }) {
      const user = this.users.find(u => u.id === id);
      if (user) {
        user.role = newRole;
        this.saveUsers();
      }
    },
    handleUserDelete(id) {
      this.users = this.users.filter(u => u.id !== id);
      this.saveUsers();
    }
  }
};
</script>

<style scoped>
.user-management-container {
  padding: 0 2rem;
  font-family: 'Inter', sans-serif;
  max-width: 1000px;
  margin: 0 auto;
}

.txt-blue {
  color: #007bff;
}

/*  */
.user-header {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  margin-bottom: 2.5rem;
  padding: 0 2rem;
  font-family: 'Poppins', sans-serif;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  letter-spacing: -0.3px;
}

.add-user-btn {
  background: #007bff;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 0.65rem 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s ease;
}

.add-user-btn i {
  font-size: 1.1rem;
}

.add-user-btn:hover {
  transform: scale(1.03);
}

.header-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.filter-input {
  flex: 1;
  max-width: 350px;
  padding: 0.65rem 1rem;
  border: 1.6px solid #ddd;
  border-radius: 12px;
  font-size: 0.95rem;
  background-color: #f7f9fc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  color: #333;
  margin-bottom: -1rem;
}

.filter-input::placeholder {
  color: #999;
  font-weight: 400;
}

.filter-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(58, 142, 246, 0.15);
  background-color: #fff;
}

/*  */
.user-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease-in-out;
}

.user-table th {
  background: #f2f2f2;
  font-weight: 600;
  color: #1f1f1f;
  font-size: 0.95rem;
  padding: 1.1rem 1rem;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 2px solid #e5e7eb;
}

.user-table td {
  padding: 1rem;
  font-size: 0.94rem;
  color: #444;
  background-color: #fff;
  border-bottom: 2px solid #f2f2f2;
  transition: background-color 0.2s ease;
}

.user-table tbody tr:hover td {
  background-color: #f4f5f9;
}

.user-table tr:first-child th:first-child {
  border-top-left-radius: 16px;
}
.user-table tr:first-child th:last-child {
  border-top-right-radius: 16px;
}
.user-table tr:last-child td:first-child {
  border-bottom-left-radius: 16px;
}
.user-table tr:last-child td:last-child {
  border-bottom-right-radius: 16px;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.profile-pic {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.user-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.user-text .name {
  font-weight: 600;
  font-size: 0.97rem;
  color: #222;
}

.user-text .email {
  font-size: 0.85rem;
  color: #888;
  margin-top: 2px;
}

.last-access {
  text-align: left;
}

.status-led {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin: auto;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: all 0.3s ease-in-out;
}

.status-led.online {
  background-color: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.6), 0 0 4px rgba(40, 167, 69, 0.4);
}

.status-led.offline {
  background-color: #c4c4c4;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.15);
  opacity: 0.6;
}

.action-btn {
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: #555;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.action-btn i {
  font-size: 1.2rem;
  transition: transform 0.3s ease, color 0.3s ease;
}

.action-btn:hover {
  background-color: #e2e8f0;
  color: #007bff;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.1);
}

.action-btn:hover i {
  transform: rotate(20deg);
}

.user-table td:nth-child(4),
.user-table td:nth-child(5),
.user-table th:nth-child(4),
.user-table th:nth-child(5) {
  text-align: center;
  vertical-align: middle;
}

/*  */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  color: #555;
  animation: fadeIn 0.5s ease;
}

.loading-spinner i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #007bff;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/*  */
.empty-state {
  text-align: center;
  padding: 2rem 1.5rem;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.empty-icon {
  background-color: #eef2f8;
  padding: 1.5rem;
  border-radius: 50%;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulseIcon 1.5s infinite ease-in-out;
}

.empty-icon i {
  font-size: 3rem;
  color: #9ca3af;
}

.empty-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.empty-subtext {
  font-size: 1rem;
  color: #6b7280;
  max-width: 440px;
  line-height: 1.6;
}

@keyframes pulseIcon {
  0% {
    transform: scale(1);
    opacity: 0.95;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.95;
  }
}

/*  */
@media (max-width: 768px) {
  .user-header {
    padding: 1rem;
    gap: 1rem;
  }

  .header-row {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .header-title {
    font-size: 1.4rem;
    text-align: left;
  }

  .add-user-btn {
    width: 55%;
    justify-content: center;
    padding: 0.65rem;
    font-size: 0.92rem;
  }

  .add-user-btn i {
    font-size: 0.9rem;
  }

  .header-filters {
    display: flex;
    justify-content: center;
    width: 100%;

  }

  .filter-input {
    width: 100%;
    font-size: 0.88rem;
    padding: 0.6rem 0.8rem;
  }

  .user-table {
    font-size: 0.88rem;
  }

  .user-table th,
  .user-table td {
    padding: 0.65rem 0.5rem;
    font-size: 0.85rem;
  }

  .user-table th {
    white-space: nowrap;
  }

  .user-table th:nth-child(1),
  .user-table td:nth-child(1),
  .user-table th:nth-child(3),
  .user-table td:nth-child(3) {
    display: none;
  }

  .user-box {
    gap: 0.6rem;
  }

  .profile-pic {
    width: 40px;
    height: 40px;
  }

  .user-text .name {
    font-size: 0.9rem;
  }

  .user-text .email {
    font-size: 0.75rem;
  }

  .action-btn {
    width: 36px;
    height: 36px;
  }

  .action-btn i {
    font-size: 1rem;
  }
}

@media (max-width: 430px) {
  .user-header {
    padding: 0.8rem;
    gap: 0.8rem;
  }

  .header-title {
    font-size: 1.2rem;
    text-align: center;
  }

  .add-user-btn {
    width: 100%;
    font-size: 0.88rem;
    padding: 0.6rem 1rem;
  }

  .header-filters {
    flex-direction: column;
    align-items: stretch;
    width: 90%;
  }

  .filter-input {
    width: 100%;
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
  }

  .user-table th,
  .user-table td {
    font-size: 0.78rem;
    padding: 0.45rem 0.5rem;
  }

  .user-table th:nth-child(4),
  .user-table td:nth-child(4) {
    display: none;
  }

  .profile-pic {
    display: none;
  }

  .user-box {
    gap: 0.3rem;
  }

  .user-text .name {
    font-size: 0.83rem;
  }

  .user-text .email {
    font-size: 0.7rem;
  }

  .action-btn {
    width: 34px;
    height: 34px;
  }

  .action-btn i {
    font-size: 1rem;
  }

  .modal-title {
    font-size: 1.2rem;
  }

  .modal-subtitle {
    font-size: 0.85rem;
  }
}

</style>
