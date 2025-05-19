<template>
  <div class="upload-modal">
    <div class="modal-overlay" @click="$emit('close')"></div>
    <div class="modal-content">

      <div class="modal-header">
        <h2 class="modal-title">
          <i class="fas fa-cloud-upload-alt"></i>
          <span>Subir nuevo documento</span>
        </h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <label
          class="file-label"
          :class="fileColorClass"
          for="fileInput"
        >
          <div class="icon-section">
            <i :class="fileIconClass"></i>
          </div>
          <div class="file-info">
            <span v-if="!selectedFile" class="placeholder-text">
              Selecciona un archivo válido
            </span>
            <template v-else>
              <strong>{{ selectedFile.name }}</strong>
              <small>
                {{ readableExtension }} · {{ readableSize }}
              </small>
            </template>
          </div>
          <input
            id="fileInput"
            type="file"
            @change="handleFile"
            accept=".pdf,.docx,.txt,.xlsx,.csv"
            hidden
          />
        </label>

        <div v-if="errorMessage" class="error-message">
          <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
        </div>

        <div v-if="isUploading" class="progress-bar-wrapper">
          <div class="progress-bar-track">
            <div class="progress-bar-fill" :style="{ width: `${uploadProgress}%` }"></div>
          </div>
          <small class="progress-text">Subiendo documento ({{ Math.floor(uploadProgress) }}%)</small>
        </div>

        <div v-if="uploadSuccess" class="upload-success">
          <i class="fas fa-check-circle"></i> Documento subido correctamente
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="upload-btn"
          @click="submitUpload"
          :disabled="!selectedFile || isUploading"
        >
          <i class="fas fa-cloud-upload-alt"></i> Subir Documento
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadDocument',
  data() {
    return {
      selectedFile: null,
      errorMessage: '',
      isUploading: false,
      uploadProgress: 0,
      uploadSuccess: false,
      maxSizeMB: 10,
      fileTypes: {
        pdf:  { icon: 'fa-file-pdf', color: 'text-red-600', label: 'Archivo PDF', class: 'file-red' },
        docx: { icon: 'fa-file-word', color: 'text-blue-600', label: 'Microsoft Word', class: 'file-blue' },
        doc:  { icon: 'fa-file-word', color: 'text-blue-600', label: 'Microsoft Word', class: 'file-blue' },
        txt:  { icon: 'fa-file-alt',  color: 'text-gray-600', label: 'Texto plano',     class: 'file-gray' },
        xlsx: { icon: 'fa-file-excel', color: 'text-green-600', label: 'Excel',         class: 'file-green' },
        csv:  { icon: 'fa-file-excel', color: 'text-green-600', label: 'CSV',           class: 'file-green' },
      },
    };
  },
  computed: {
    fileExtension() {
      return this.selectedFile?.name.split('.').pop().toLowerCase() || '';
    },
    fileData() {
      return this.fileTypes[this.fileExtension] || {
        icon: 'fa-file',
        color: 'text-gray-400',
        label: 'Desconocido',
        class: 'file-default',
      };
    },
    fileIconClass() {
      return `fas ${this.fileData.icon} ${this.fileData.color}`;
    },
    fileColorClass() {
      return this.fileData.class;
    },
    readableExtension() {
      return this.fileData.label;
    },
    readableSize() {
      if (!this.selectedFile) return '';
      const sizeKB = this.selectedFile.size / 1024;
      return sizeKB > 1024
        ? `${(sizeKB / 1024).toFixed(2)} MB`
        : `${sizeKB.toFixed(1)} KB`;
    },
  },
  methods: {
    handleFile(event) {
      const file = event.target.files[0];
      this.errorMessage = '';
      this.selectedFile = null;

      if (!file) return;

      const extension = file.name.split('.').pop().toLowerCase();
      const sizeMB = file.size / (1024 * 1024);

      if (!Object.keys(this.fileTypes).includes(extension)) {
        this.errorMessage = `Formato no soportado: .${extension}`;
        return;
      }

      if (sizeMB > this.maxSizeMB) {
        this.errorMessage = `El archivo supera los ${this.maxSizeMB}MB permitidos`;
        return;
      }

      this.selectedFile = file;
    },
    submitUpload() {
      if (!this.selectedFile || this.isUploading) return;

      this.isUploading = true;
      this.errorMessage = '';
      this.uploadSuccess = false;
      this.uploadProgress = 0;

      const interval = setInterval(() => {
        if (this.uploadProgress >= 100) {
          clearInterval(interval);
          this.isUploading = false;
          this.uploadSuccess = true;

          const newDocument = {
            id: Date.now(),
            name: this.selectedFile.name,
            date: new Date().toISOString().slice(0, 10),
            fragments: Math.floor(Math.random() * 30) + 5,
            status: 'En espera',
          };

          this.$emit('document-uploaded', newDocument);

          setTimeout(() => {
            this.$emit('close');
          }, 1200);
        } else {
          this.uploadProgress = Math.min(this.uploadProgress + Math.random() * 10, 100);
        }
      }, 150);
    },
  },
};
</script>

<style scoped>
.upload-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
}

.modal-content {
  position: relative;
  background: #ffffff;
  border-radius: 18px;
  width: 95%;
  max-width: 480px;
  padding: 2rem 1.7rem;
  z-index: 1001;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.8rem;
}

.modal-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.5rem;
  color: #0f172a;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.modal-title i {
  font-size: 1.4rem;
  color: #3b82f6;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #1e293b;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

.file-label {
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  padding: 1.4rem;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: left;
}

.file-label:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}

.icon-section {
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.92rem;
  color: #475569;
}

.file-info strong {
  color: #1e293b;
  font-size: 0.95rem;
}

.placeholder-text {
  font-size: 0.92rem;
  color: #64748b;
}

.error-message {
  font-size: 0.86rem;
  color: #dc2626;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.upload-status,
.upload-success {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  font-weight: 500;
}

.upload-status {
  background-color: #eff6ff;
  color: #2563eb;
}

.upload-success {
  background-color: #ecfdf5;
  color: #16a34a;
}

/* Progress bar */
.progress-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.4rem 0;
}

.progress-bar-track {
  background-color: #e5e7eb;
  border-radius: 10px;
  height: 10px;
  width: 100%;
  overflow: hidden;
}

.progress-bar-fill {
  background-color: #3b82f6;
  height: 100%;
  width: 0%;
  transition: width 0.3s ease-in-out;
  border-radius: 10px;
}

.progress-text {
  font-size: 0.8rem;
  color: #475569;
  text-align: right;
  margin-top: 2px;
}

.modal-footer {
  margin-top: 1.8rem;
  display: flex;
  justify-content: flex-end;
}

.upload-btn {
  background-color: #007bff;
  color: #fff;
  padding: 0.7rem 1.3rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upload-btn:hover {
  background-color: #0369a1;
}

.upload-btn:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

.file-red {
  border-color: #fca5a5; 
  background-color: rgba(252, 165, 165, 0.18);
}

.file-blue {
  border-color: #93c5fd; 
  background-color: rgba(147, 197, 253, 0.18);
}

.file-green {
  border-color: #6ee7b7; 
  background-color: rgba(110, 231, 183, 0.18);
}

.file-gray {
  border-color: #cbd5e1; 
  background-color: rgba(203, 213, 225, 0.2);
}

.file-default {
  border-color: #e2e8f0;
  background-color: #f8fafc;
}
</style>