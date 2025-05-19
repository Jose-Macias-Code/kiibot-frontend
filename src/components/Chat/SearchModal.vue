<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <transition name="modal-slide" appear>
      <div class="modal-card">

        <div class="modal-header">
          <input
            ref="searchInput"
            v-model="search"
            type="text"
            class="search-input"
            placeholder="Buscar chats..."
            @input="handleSearch"
          />
          <button class="close-button" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-results-container">
          <ul v-if="filteredResults.length > 0" class="results-list">
            <li
              v-for="item in filteredResults"
              :key="item.id"
              class="result-item"
              @click="selectResult(item)"
            >
              <i class="fas fa-comment-alt icon"></i>
              <span class="item-text">{{ item.name }}</span>
            </li>
          </ul>

          <div v-else class="no-results-container">
            <img src="../../assets/img/buscar.webp" alt="Sin resultados" class="no-results-image" loading="lazy"/>
            <p class="no-results-title">Sin coincidencias encontradas</p>
            <p class="no-results-subtext">
              Intenta con otro término o revisa la ortografía. A veces una palabra clave puede marcar la diferencia.
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SearchModal',
  props: {
    modelValue: Boolean,
    chats: {
      type: Array,
      required: true
    }
  },
  emits: ['update:modelValue', 'close'],
  data() {
    return {
      search: '',
      results: [
        { id: 2, name: 'Fragmento de cliente molesto', type: 'fragment' },
        { id: 4, name: 'Fragmento importante', type: 'fragment' },
      ]
    };
  },
  computed: {
    filteredResults() {
      const text = this.search.toLowerCase();
      const chatResults = this.chats.map(chat => ({ ...chat, type: 'chat' }));
      const combined = [...chatResults, ...this.results];

      return combined.filter(item => {
        const isMatch = item.name.toLowerCase().includes(text);
        const isChat = item.type === 'chat';
        return this.search === '' ? isChat : isMatch;
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.searchInput?.focus();
    });
  },
  methods: {
    closeModal() {
      this.$emit('update:modelValue', false);
      this.search = '';
    },
    selectResult(result) {
      if (result.type === 'chat') {
        this.$emit('close');
        this.$router.push(`/chat/${result.id}`); 
      } else {
        // Fragmentos Logica
        this.$emit('close');
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.45s ease;
}

.modal-slide-enter-from {
  opacity: 0;
  transform: translateY(80px) scale(0.98);
}

.modal-slide-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.modal-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(-60px) scale(0.95);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-card {
  background-color: #fff;
  width: 95%;
  max-width: 600px;
  max-height: 60vh;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #fff;
}

.search-input {
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 15px;
  padding: 8px 10px;
  font-family: inherit;
  background-color: transparent;
  color: #111;
}

.search-input::placeholder {
  color: #9ca3af;
}

.close-button {
  background: none;
  border: none;
  font-size: 18px;
  color: #6b7280;
  padding: 6px;
  margin-left: 8px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: #111;
}

.modal-results-container {
  overflow-y: auto;
  flex: 1;
  padding: 11px 0;
}

.results-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 16px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.result-item:hover {
  background-color: #f3f4f6;
}

.result-item .icon {
  font-size: 16px;
  color: #6b7280;
  margin-right: 12px;
}

.item-text {
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}

.no-results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  animation: fadeIn 0.4s ease-in-out;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.no-results-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  animation: float 3s ease-in-out infinite;
  transform-origin: center;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(5px); }
  100% { transform: translateY(0); }
}

.no-results-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Inter', sans-serif;
}

.no-results-subtext {
  font-size: 14px;
  color: #6b7280;
  font-family: 'Inter', sans-serif;
  max-width: 360px;
  text-align: center;
  line-height: 1.6;
  opacity: 0.85;
  margin-top: -10px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>


