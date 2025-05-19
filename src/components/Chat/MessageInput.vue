<template>
  <div :class="['message-input-wrapper', routeClass]">
    <div class="message-card">

      <div class="preview-list" v-if="previewImages.length || previewFiles.length">
        <div
          v-for="(img, index) in previewImages"
          :key="'img-' + index"
          class="preview-image"
        >
          <img :src="img.src" :alt="img.name" @click="previewModal = img.src" />
          <button class="remove-preview" @click="removePreview(index, 'image')">×</button>
        </div>

        <div
          v-for="(file, index) in previewFiles"
          :key="'file-' + index"
          class="preview-file"
        >
          <div class="file-icon" :class="getFileColorClass(file.type)">
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="file-details">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-type">{{ file.type || 'Documento' }}</span>
          </div>
          <button class="remove-preview" @click="removePreview(index, 'file')">×</button>
        </div>
      </div>

      <textarea
        ref="textarea"
        v-model="message"
        @keydown.enter.prevent="handleEnter"
        class="message-textarea"
        placeholder="Pregunta lo que quieras"
        rows="1"
      />

      <div class="actions-row">
        <div class="message-actions">
          <button class="bubble-button" @click="triggerFileInput">
            <i class="fas fa-file-upload"></i>
            <span>Cargar</span>
          </button>
          <input type="file" ref="fileInput" multiple style="display: none" @change="handleFileChange" />
          <button class="bubble-button" :class="{ active: isGeneralMode }" @click="toggleGeneralMode" data-tooltip="Conocimiento general de Open IA">
            <i class="fas fa-brain"></i>
            <span>Conocimiento OpenAI</span>
          </button>
        </div>

        <button class="send-icon-button" @click="emitMessage" title="Enviar mensaje">
          <i class="fas fa-arrow-up"></i>
        </button>
      </div>

      <transition name="fade-toast">
        <div v-if="showToast" class="toast-notification">
          {{ toastMessage }}
        </div>
      </transition>
    </div>

    <transition name="fade-toast">
      <div v-if="previewModal" class="preview-modal">
        <div class="modal-image-container">
          <img :src="previewModal" alt="Preview grande" />
        </div>
        <button class="close-modal-button" @click="previewModal = null">×</button>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "",
      previewImages: [],
      previewFiles: [],
      previewModal: null,
      showToast: false,
      maxFiles: 5,
      toastMessage: '',
      isGeneralMode: false,
    };
  },
  computed: {
    routeClass() {
      return this.$route.path === '/chat/new'
        ? 'input-new'
        : 'input-existing';
    }
  },
  methods: {
    handleEnter(e) {
      if (e.shiftKey) {
        const textarea = this.$refs.textarea;
        const pos = textarea.selectionStart;
        this.message =
          this.message.slice(0, pos) + "\n" + this.message.slice(pos);
        this.$nextTick(() => {
          textarea.selectionStart = textarea.selectionEnd = pos + 1;
          this.adjustHeight(); 
        });
      } else {
        this.emitMessage();
      }
    },
    emitMessage() {
      const trimmed = this.message.trim();
      if (trimmed || this.previewImages.length || this.previewFiles.length) {
        this.$emit("send", {
          text: trimmed,
          generalMode: this.isGeneralMode,
          files: [...this.previewImages, ...this.previewFiles]
        });

        this.message = "";
        this.previewImages = [];
        this.previewFiles = [];
        this.adjustHeight();
      }
    },
    toggleGeneralMode() {
      this.isGeneralMode = !this.isGeneralMode;
    },
    adjustHeight() {
      const textarea = this.$refs.textarea;
      textarea.style.height = "auto";

      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200;

      if (scrollHeight > maxHeight) {
        textarea.style.height = maxHeight + "px";
      } else {
        textarea.style.height = scrollHeight + "px";
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const files = Array.from(event.target.files);
      const total = this.previewImages.length + this.previewFiles.length + files.length;

      const allowedExtensions = [ 'png', 'jpg', 'jpeg', 'webp', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'zip', 'rar' ];

      if (total > this.maxFiles) {
        this.toastMessage = `Solo puedes subir hasta ${this.maxFiles} archivos.`;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
        this.$refs.fileInput.value = "";
        return;
      }

      files.forEach(file => {
        const extension = file.name.split('.').pop().toLowerCase();
        const isImage = file.type.startsWith("image/");

        if (!allowedExtensions.includes(extension)) {
          this.toastMessage = `El archivo "${file.name}" no es un tipo permitido.`;
          this.showToast = true;
          setTimeout(() => {
            this.showToast = false;
          }, 3000);
          return;
        }

        if (isImage) {
          const reader = new FileReader();
          reader.onload = e => {
            this.previewImages.push({
              name: file.name,
              src: e.target.result
            });
          };
          reader.readAsDataURL(file);
        } else {
          const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
          this.previewFiles.push({
            name: nameWithoutExtension,
            type: `.${extension}`
          });
        }
      });

      this.$refs.fileInput.value = "";
    },
    getFileColorClass(type) {
      const colors = {
        '.pdf': 'file-icon-pdf',
        '.doc': 'file-icon-word',
        '.docx': 'file-icon-word',
        '.xls': 'file-icon-excel',
        '.xlsx': 'file-icon-excel',
        '.csv': 'file-icon-excel',
        '.txt': 'file-icon-text',
        '.zip': 'file-icon-zip',
        '.rar': 'file-icon-zip'
      };
      return colors[type] || 'file-icon-default';
    },
    removePreview(index, type) {
      if (type === 'image') {
        this.previewImages.splice(index, 1);
      } else if (type === 'file') {
        this.previewFiles.splice(index, 1);
      }
    },
  },
  watch: {
    message() {
      this.$nextTick(() => this.adjustHeight());
    }
  },
  mounted() {
    this.adjustHeight();
  }
};
</script>

<style>
.input-new .message-card {
  animation: riseInNew 0.7s ease-out;
  padding: 1.25rem 1.5rem 1rem 1.5rem;
}

@keyframes riseInNew {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-existing .message-card {
  animation: slideRightExisting 0.5s ease-out;
  padding: 1rem 1.2rem 1rem 1.2rem;
}

@keyframes slideRightExisting {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.message-input-wrapper {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-card {
  position: relative;
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  border-radius: 1.5rem;
  border: 1px solid #e5e7eb; 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); 
}

.message-textarea {
  width: 100%;
  resize: none;
  border: none;
  outline: none;
  font-size: 1rem;
  line-height: 1.5;
  padding: 0;
  background: transparent;
  color: #202123;
  font-family: inherit;
  overflow-y: auto; 
  max-height: 130px;
}

.actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.send-icon-button {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 999px;
  background-color: #202123;
  color: white;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  margin-left: auto;
}

.send-icon-button:hover {
  background-color: #111111;
}

.message-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bubble-button {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: #fcfcfc;
  border: 1px solid #e3e4e6;
  border-radius: 999px;
  padding: 0.5rem 0.8rem;
  font-size: 0.8rem;
  color: #2e2f32;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.bubble-button i {
  font-size: 0.95rem;
  color: #4a4c4f;
}

.bubble-button:hover {
  background: linear-gradient(145deg, #eaeaec, #f2f2f3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.bubble-button.active {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 8px 16px rgba(59, 130, 246, 0.35);
  color: #ffffff;
  transition: background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
}

.bubble-button.active i {
  color: #ffffff;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

.bubble-button[data-tooltip] {
  position: relative;
}

.bubble-button[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 129%; 
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #1e1e1e, #2c2c2c);
  color: #fff;
  padding: 7px 12px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 1;
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 1000;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
}

.bubble-button[data-tooltip]:hover::before {
  content: '';
  position: absolute;
  top: 89%; 
  left: 50%;
  transform: translateX(-50%);
  border-width: 8px;
  border-style: solid;
  border-color: transparent transparent #1e1e1e transparent;
  opacity: 1;
  transition: opacity 0.3s ease;
  z-index: 999;
}

@keyframes fadeTooltip {
  to {
    opacity: 1;
  }
}

.remove-preview {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 15px;
  height: 15px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 2px #fff;
}

/*  */
.preview-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.8rem;
  align-items: center;
  max-width: 100%;
}

.preview-image {
  position: relative;
  width: 50px;
  height: 50px;
  overflow: visible; 
  flex-shrink: 0;
}

.preview-image img {
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.modal-image-container {
  position: relative;
  max-width: 90%;
  max-height: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-image-container img {
  max-width: 65%;
  max-height: 65%;
  border-radius: 1rem;
  display: block;
  object-fit: contain;
}

.close-modal-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 35px;
  height: 35px;
  background: #000;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  font-size: 1.8rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/*  */
.preview-file {
  position: relative;
  display: flex;
  align-items: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  max-width: 300px;
  height: 50px;
  padding: 0 0.5rem;
  gap: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  font-family: inherit;
}

.preview-file .file-icon {
  color: white;
  border-radius: 0.5rem;
  width: 38px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.file-icon-pdf {
  background-color: #ef4444; 
}
.file-icon-word {
  background-color: #3b82f6;
}
.file-icon-excel {
  background-color: #22c55e; 
}
.file-icon-text {
  background-color: #6b7280; 
}
.file-icon-zip {
  background-color: #a855f7; 
}
.file-icon-default {
  background-color: #9ca3af;
}

.preview-file .file-details {
  display: flex;
  flex-direction: column;
  text-align: left;
  overflow: hidden;
  font-size: 0.8rem;
}

.preview-file .file-details .file-name {
  font-family: 'Inter', sans-serif;
  font-weight: 500; 
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.preview-file .file-details .file-type {
  color: #6b7280;
}

/*  */
.toast-notification {
  position: absolute;
  bottom: -2.8rem;
  left: 50%;
  transform: translateX(-50%);
  background: #f87171;
  color: white;
  padding: 0.5rem 1.2rem;
  font-size: 0.85rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  pointer-events: none;
}

.fade-toast-enter-active,
.fade-toast-leave-active {
  transition: opacity 0.4s, transform 0.4s ease;
}

.fade-toast-enter-from,
.fade-toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .message-card {
    padding: 0.8rem 1rem;
    border-radius: 1rem;
  }

  .message-textarea {
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .bubble-button {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
    gap: 0.35rem;
  }

  .bubble-button i {
    font-size: 0.85rem;
  }

  .send-icon-button {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }

  .preview-image {
    width: 44px;
    height: 44px;
  }

  .preview-file {
    height: 44px;
    font-size: 0.75rem;
    padding: 0.4rem 0.5rem;
  }

  .preview-file .file-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .preview-file .file-details .file-name {
    font-size: 0.75rem;
    max-width: 150px;
  }

  .preview-file .file-details .file-type {
    font-size: 0.7rem;
  }

  .toast-notification {
    font-size: 0.75rem;
    padding: 0.4rem 1rem;
    bottom: -2.5rem;
  }

  .close-modal-button {
    width: 30px;
    height: 30px;
    font-size: 1.4rem;
  }

  .modal-image-container img {
    max-width: 70%;
    max-height: 70%;
  }
}

@media (max-width: 480px) {
  .message-card {
    padding: 0.7rem 0.9rem;
  }

  .bubble-button {
    font-size: 0.7rem;
    padding: 0.35rem 0.55rem;
  }

  .send-icon-button {
    width: 26px;
    height: 26px;
    font-size: 0.75rem;
  }

  .message-textarea {
    font-size: 0.85rem;
  }

  .preview-image {
    width: 40px;
    height: 40px;
  }

  .preview-file {
    height: 42px;
    font-size: 0.7rem;
    padding: 0.3rem 0.4rem;
  }

  .preview-file .file-icon {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }

  .preview-file .file-details .file-name {
    font-size: 0.7rem;
    max-width: 130px;
  }

  .preview-file .file-details .file-type {
    font-size: 0.65rem;
  }

  .toast-notification {
    font-size: 0.7rem;
    padding: 0.35rem 0.9rem;
  }
}

</style>
