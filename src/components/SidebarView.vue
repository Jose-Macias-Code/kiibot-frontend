<template>
  <div>
    <button 
      v-if="!isSidebarOpen" 
      @click="toggleSidebar" 
      class="open-sidebar-button"
      data-tooltip="Abrir barra lateral">
      <i class="fas fa-bars"></i>
    </button>

    <div v-show="true" :class="['sidebar', { 'open': isSidebarOpen, 'closed': !isSidebarOpen }]">
      <div class="top-buttons">
        <button class="icon-button" @click="toggleSidebar" data-tooltip="Cerrar barra lateral">
          <i class="fas fa-bars"></i>
        </button>Pero 

        <div class="spacer"></div>

        <button class="icon-button hide-on-mobile" @click="openSearchModal" data-tooltip="Buscar chats">
          <i class="fas fa-search"></i>
        </button>
        <button class="icon-button" @click="handleStartNewChat" data-tooltip="Nuevo chat">
          <i class="fas fa-plus-circle"></i>
        </button>
      </div>

      <div class="chats-list">
        <h4 class="chats-title">CHATS</h4>
        <div class="chat-list-container">
          <ul class="chat-list">
            <li v-for="chat in chats" :key="chat.id" class="chat-item" :class="{ 'active-chat': Number($route.params.id) === chat.id, 'is-editing': editingChatId === chat.id }" >
              <router-link
                :to="`/chat/${chat.id}`"
                class="chat-link"
                @click="handleSidebarSelect"
              >
                <transition name="scale-fade" mode="out-in">
                  <template v-if="editingChatId === chat.id">
                    <input
                      key="input"
                      v-model="newChatName"
                      @keyup.enter="confirmRename(chat)"
                      @keyup.esc="cancelRename"
                      @blur="cancelRename"
                      class="rename-input"
                      placeholder="Nuevo nombre..."
                      autofocus
                    />
                  </template>
                  <template v-else>
                    <span key="text">{{ chat.name }}</span>
                  </template>
                </transition>

                <i 
                  class="fas fa-ellipsis-h chat-options-icon hide-on-mobile" 
                  @click.prevent="editingChatId === null && openChatOptions(chat.id, $event)"
                ></i>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div 
          class="modal-content" 
          :style="{ top: modalPosition.top + 'px', left: modalPosition.left + 'px' }"
          @click.stop
        >
          <ul class="modal-options">
            <li @click="renameChat">
              <i class="fas fa-edit"></i> Cambiar el nombre
            </li>
            <li class="delete-option" @click="deleteChat">
              <i class="fas fa-trash-alt delete-icon"></i> Eliminar
            </li>
          </ul>
        </div>
      </div>

      <div class="bottom-section"> 
        <router-link to="/profile" class="profile-link" data-tooltip="Perfil" @click="handleSidebarSelect">
          <div class="profile-container">
            <img v-if="profileImage" :src="profileImage" alt="Foto de perfil" class="profile-image" />
            <i v-else class="fas fa-user-circle default-icon"></i>
          </div>
        </router-link>
        <div v-if="userRole === 'admin'" class="admin-panel">
          <button class="admin-button" @click="handleBackofficeClick">
            <i class="fas fa-briefcase"></i> <p>Office</p>
          </button>
        </div>
      </div>
    </div>

    <ConfirmDeleteModal
      v-if="showConfirmDelete"
      :chat-id="chatToDelete"
      :chat-name="getChatNameById(chatToDelete)"
      @confirm-delete="handleConfirmedDelete"
      @cancel-delete="handleCancelDelete"
    />

    <SearchModal
      v-if="showSearchModal"
      @close="showSearchModal = false"
      :chats="chats"
    />

  </div>
</template>

<script>
import ConfirmDeleteModal from '../components/Chat/ConfirmDeleteModal.vue';
import SearchModal from '../components/Chat/SearchModal.vue';
import { bus } from '../eventBus'

export default {
  components: {
    ConfirmDeleteModal,
    SearchModal
  },
  props: {
    isSidebarOpen: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        this.selectedChatId = Number(newId);
        if (this.editingChatId !== null) {
          this.cancelRename(); 
        }
      }
    }
  },
  data() {
    return {
      chats: [
        { id: 1, name: 'Saludo' },
        { id: 2, name: 'Marketing' },
        { id: 3, name: 'Consultoría' },
        { id: 4, name: 'Soporte Técnico' },
        { id: 5, name: 'Ventas' }
      ],
      profileImage: localStorage.getItem("profile_photo") || require('../assets/img/default-avatar.webp'),
      showModal: false,
      selectedChatId: null,
      modalPosition: { top: 0, left: 0 },
      userRole: null,
      showConfirmDelete: false,
      chatToDelete: null,
      editingChatId: null,
      newChatName: '',
      showSearchModal: false,
    };
  },
  mounted() {
    document.addEventListener("mousedown", this.handleClickOutside);
    document.addEventListener("mousedown", this.handleClickOutsideRename);

    bus.on('profile-updated', this.updateProfilePhoto);

    this.getUserRole();
  },
  beforeUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    document.removeEventListener("mousedown", this.handleClickOutsideRename);

    bus.off('profile-updated', this.updateProfilePhoto);
  },
  methods: {
    updateProfilePhoto(newBase64) {
      this.profileImage = newBase64 ||
        localStorage.getItem("profile_photo") ||
        require('../assets/img/default-avatar.webp');
    },
    getUserRole() {
      this.userRole = localStorage.getItem("role") || ""; 
    },
    toggleSidebar() {
      this.$emit('toggleSidebar');
    },
    openSearchModal() {
      this.showSearchModal = true;
    },
    startNewChat() {
      this.$router.push("/chat/new");
    },
    openChatOptions(chatId, event) {
      this.selectedChatId = chatId;
      this.showModal = true;

      const rect = event.target.getBoundingClientRect();
      this.modalPosition = {
        top: rect.top + window.scrollY + 17,
        left: rect.left + window.scrollX + 17
      };
    },
    handleClickOutside(event) {
      const modal = this.$el.querySelector(".modal-content");
      if (this.showModal && modal && !modal.contains(event.target)) {
        this.closeModal();
      }
    },
    closeModal() {
      this.showModal = false;
      this.selectedChatId = null;
    },
    shareChat() {
      console.log("Compartir chat", this.selectedChatId);
      this.closeModal();
    },
    deleteChat() {
      this.chatToDelete = this.selectedChatId;
      this.showModal = false;
      this.showConfirmDelete = true;
    },
    getChatNameById(id) {
      const found = this.chats.find(chat => chat.id === id);
      return found ? found.name : '';
    },
    handleCancelDelete() {
      this.showConfirmDelete = false;
      this.selectedChatId = null; 
    },
    handleConfirmedDelete(chatId) {
      this.chats = this.chats.filter(chat => chat.id !== chatId);

      if (this.$route.params.id == chatId) {
        this.$router.push('/chat/new');
      }

      this.showConfirmDelete = false;
    },
    startRenaming(chat) {
      this.editingChatId = chat.id;
      this.newChatName = chat.name;
      this.showModal = false; 
    },
    confirmRename(chat) {
      const newName = this.newChatName.trim();
      if (newName !== '') {
        chat.name = newName;
      }
      this.cancelRename();
    },
    cancelRename() {
      this.editingChatId = null;
      this.newChatName = '';
    },
    renameChat() {
      const chat = this.chats.find(c => c.id === this.selectedChatId);
      if (chat) this.startRenaming(chat);
      this.closeModal();
    },
    handleSidebarSelect() {
      if (window.innerWidth <= 640) {
        this.$nextTick(() => {
          this.$emit('toggleSidebar');
        });
      }
    },
    handleStartNewChat() {
      this.$router.push("/chat/new");
      this.handleSidebarSelect();
    },
    handleBackofficeClick() {
      this.$router.push('/backoffice');
      this.handleSidebarSelect();
    },
    handleClickOutsideRename(event) {
      if (!this.editingChatId) return;

      const activeInput = this.$el.querySelector('.rename-input');
      if (activeInput && !activeInput.contains(event.target)) {
        this.cancelRename();
      }
    },
  }
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; 
  position: fixed;
  left: 0;
  height: 100dvh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.08);
  z-index: 100;
  transform: translateX(-220px);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.sidebar.open {
  transform: translateX(0);
  opacity: 1;
}

.sidebar.closed {
  transform: translateX(-220px);
  opacity: 0;
}

.open-sidebar-button {
  position: fixed;
  top: 15px;
  left: 15px;
  border: none;
  padding: 9px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 18px;
  color: #4a4a4a;
  z-index: 101;
  transition: all 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
}

.open-sidebar-button:hover {
  background-color: #dedede;
}

.open-sidebar-button::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 50%;
  left: 115%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #1e1e1e, #2c2c2c);
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 1000;
  font-size: 13px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
}

.open-sidebar-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 85%;
  transform: translateY(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: transparent #1e1e1e transparent transparent; 
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 999;
}

.open-sidebar-button:hover::after,
.open-sidebar-button:hover::before {
  opacity: 1;
}

.top-buttons {
  display: flex;
  align-items: center;
}

.spacer {
  flex-grow: 1;
}

.icon-button {
  background-color: transparent;
  border: none;
  padding: 9px;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
}

.icon-button i {
  font-size: 18px;
  color: #4a4a4a;
  transition: color 0.2s ease;
}

.icon-button:hover {
  background-color: #dedede;  
}

.icon-button::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 50%;
  left: 115%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #1e1e1e, #2c2c2c);
  color: #fff;
  padding: 7px 12px;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
  z-index: 1000;
  font-size: 13px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4); 
  font-weight: 500; 
  font-family: 'Roboto', sans-serif;
}

.icon-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 85%; 
  transform: translateY(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: transparent #1e1e1e transparent transparent;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  z-index: 999; 
}

.icon-button:hover::after,
.icon-button:hover::before {
  opacity: 1;
}

.chats-list {
  margin-top: -10px;  
  padding: 0 10px;
  font-family: 'Poppins', sans-serif; 
}

.chats-title {
  font-size: 13px;
  color: #6b7280; 
  margin-bottom: 8px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  text-align: left;
  font-weight: 500; 
}

.chat-list-container {
  max-height: calc(100vh - 170px);  
  overflow-y: auto;
  padding-right: 15px;
  margin-right: -20px;
}

.chat-list-container::-webkit-scrollbar {
  width: 6px; 
}

.chat-list-container::-webkit-scrollbar-thumb {
  background-color: #c4c4c4;
  border-radius: 3px;        
}

.chat-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  text-align: left;
  font-size: 15px;
}

.chat-item {
  margin-bottom: 3px;
}

.rename-input {
  width: 100%;
  font-size: 16px;
  padding: 4px 14px;
  border: 1.5px solid #ccc;
  border-radius: 10px;
  background-color: #fefefe;
  outline: none;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.icon-button:disabled {
  opacity: 0.5;
  pointer-events: none;
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.2s ease-in-out;
  transform-origin: center left;
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.scale-fade-leave-from,
.scale-fade-enter-to {
  opacity: 1;
  transform: scale(1);
}

.chat-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: #374151; 
  padding: 7px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
}

.chat-link:hover {
  background-color: #dedede;
  transform: translateX(5px);
  opacity: 1;
}

.chat-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 0;
  background-color: #606060; 
  border-radius: 2px;
  transition: height 0.3s ease;
}

.chat-link:hover::before {
  height: 100%;
}

.chat-link:active {
  background-color: #d1d5db; 
}

.chat-link:active::before {
  background-color: #606060;
}

.bottom-section {
  margin-top: auto; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;  
}

.chat-options-icon {
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  margin-left: auto;
  font-size: 16px;
  color: #4a4a4a;
}

.chat-link:hover .chat-options-icon {
  opacity: 1;
  transform: translateX(0);
}

.active-chat .chat-link {
  background-color: #c3c3c3 !important;
  transform: translateX(5px);
  opacity: 1;
  transition: background-color 0.3s ease;
}

.active-chat .chat-options-icon {
  opacity: 1;
  transform: translateX(0);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  animation: fadeInBg 0.3s ease-in-out; 
}

.modal-content {
  position: absolute;
  width: 200px;
  background-color: #ffffff;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  animation: scaleIn 0.25s ease-out forwards; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform-origin: top left;
  opacity: 0;
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes scaleOut {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.8); opacity: 0; }
}

.modal-options {
  list-style: none;
  margin: 0;
  padding: 0;
}

.modal-options li {
  padding: 10px 14px;
  cursor: pointer;
  transition: background-color 0.25s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.modal-options li i {
  margin-right: 10px;
  font-size: 18px;
  color: #555;
  transition: color 0.3s ease;
}

.modal-options li:hover {
  background-color: #f8f9fa;
  transform: translateX(4px); 
}

.modal-options li:hover i {
  color: #222;
}

.delete-option {
  color: #d9534f !important;
  font-weight: 600;
}

.delete-option i {
  color: #d9534f !important;
}

.delete-option:hover {
  background-color: #fceaea;
  transform: translateX(4px);
}

.closing-modal {
  animation: scaleOut 0.2s ease-in forwards;
}

.admin-panel {
  text-align: center; 
}

.admin-button {
  background-color: transparent;
  border: none;
  padding: 9px;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #4a4a4a;
}

.admin-button p {
  letter-spacing: 2.7px;
  padding: 0;
  margin: 0;
}

.admin-button i {
  margin-right: 5px;
  font-size: 18px;
  color: #4a4a4a;
  transition: color 0.2s ease;
}

.admin-button:hover {
  background-color: #dedede;
}

.admin-button:active {
  transform: scale(0.95);
}

.admin-button::after {
  content: "Ir al Back Office";
  position: absolute;
  top: -60%;
  left: -10%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #1e1e1e, #2c2c2c);
  color: #fff;
  padding: 7px 12px;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
  z-index: 1000;
  font-size: 13px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
}

.admin-button::before {
  content: '';
  position: absolute;
  top: -5%;
  left: 40%;
  transform: translateY(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: #1e1e1e transparent transparent transparent;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  z-index: 999;
}

.admin-button:hover::after,
.admin-button:hover::before {
  opacity: 1;
}

.profile-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 7px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  position: relative;
}

.profile-link:hover {
  background-color: #dedede;
}

.profile-container {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4a4a4a;
}

.default-icon {
  font-size: 35px;
  color: #4a4a4a;
}

.icon-button {
  background-color: transparent;
  border: none;
  padding: 9px;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
}

.icon-button i {
  font-size: 18px;
  color: #4a4a4a;
  transition: color 0.2s ease;
}

.icon-button:hover {
  background-color: #dedede;
}

/*  */
@media (max-width: 640px) {
  .hide-on-mobile {
    display: none !important;
  }
}


</style>
