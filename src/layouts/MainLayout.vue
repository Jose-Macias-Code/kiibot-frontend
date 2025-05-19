<template>
  <div class="main-layout">
    <div
      v-if="isSidebarOpen && isMobile"
      class="sidebar-backdrop"
      @click="toggleSidebar"
    ></div>

    <SidebarView 
      :isSidebarOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar" 
    />
    
    <div :class="['content', { expanded: !isSidebarOpen }]">
      <router-view v-slot="{ Component }">
        <transition name="slide-fade-page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <div v-if="showSessionExpiredModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Sesión Expirada</h2>
        <p>Tu sesión ha caducado. Por favor, inicia sesión nuevamente.</p>
        <button @click="redirectToLogin" class="btn-login-again">Iniciar sesión</button>
      </div>
    </div>

  </div>
</template>

<script>
import SidebarView from '../components/SidebarView.vue';

export default {
  name: "MainLayout",
  components: { SidebarView },
  data() {
    return {
      isSidebarOpen: true,
      showSessionExpiredModal: false,
      isMobile: window.innerWidth <= 640
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;

      const isMobile = window.innerWidth <= 640;

      if (isMobile && this.isSidebarOpen) {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.cssText = `
          overflow: hidden !important;
          touch-action: none;
          position: fixed;
          width: 100vw;
          height: 100dvh;
        `;
      } else {
        document.documentElement.style.overflow = '';
        document.body.style.cssText = '';
      }
    },
    handleTokenExpired() {
      this.showSessionExpiredModal = true;
    },
    redirectToLogin() {
      this.showSessionExpiredModal = false;
      this.$router.push("/login");
    },
    updateIsMobile() {
      this.isMobile = window.innerWidth <= 640;
    },
  },
  mounted() {
    window.addEventListener("token-expired", this.handleTokenExpired);
    window.addEventListener("resize", this.updateIsMobile);

    if (this.isMobile && this.isSidebarOpen) this.toggleSidebar();
  },
  beforeUnmount() {
    window.removeEventListener("token-expired", this.handleTokenExpired);
    window.removeEventListener("resize", this.updateIsMobile);
    document.documentElement.style.overflow = '';
    document.body.style.cssText = '';
  },
};
</script>

<style>
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99;
}

.sidebar {
  z-index: 100;
}
</style>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: #ececec;
  transition: all 0.5s ease;
}

.content {
  flex: 1;
  padding: 20px;
  transition: margin-left 0.5s ease, padding 0.5s ease;
  background-color: #fff;
  margin-left: 200px;
}

.content.expanded {
  margin-left: 0;
}

.slide-fade-page-enter-active,
.slide-fade-page-leave-active {
  transition: opacity 0.20s ease-in-out;
}
.slide-fade-page-enter-from,
.slide-fade-page-leave-to {
  opacity: 0;
}
.slide-fade-page-enter-to,
.slide-fade-page-leave-from {
  opacity: 1;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.modal-content h2 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}

.modal-content p {
  margin-bottom: 20px;
  color: #666;
}

.btn-login-again {
  background-color: #23a36e;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-login-again:hover {
  background-color: #1c8658;
}
</style>
