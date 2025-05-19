<template>
  <div class="documents-panel">
    
    <div class="documents-header">
      <div class="header-row">
        <h2 class="header-title">
          Documentos <span class="txt-blue">KIIBOT</span>
        </h2>
        <button @click="openAddDocumentModal" class="add-document-btn">
          <i class="fas fa-file-upload"></i> Añadir Documento
        </button>
      </div>

      <div class="header-filters">
        <input
          type="text"
          placeholder="Buscar por nombre"
          class="filter-input"
          v-model="searchQuery"
        />
      </div>
    </div>

    <div class="documents-table" v-if="filteredDocuments.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Fragmentos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in filteredDocuments" :key="doc.id">
            <td>{{ doc.name }}</td>
            <td>{{ doc.date }}</td>
            <td>
              <template v-if="doc.status === 'En espera'">
                <i class="fas fa-spinner fa-spin text-blue-500"></i>
              </template>
              <template v-else>
                {{ doc.fragments }}
              </template>
            </td>
            <td>
              <span
                :class="[
                  'status-badge',
                  doc.status === 'Procesado'
                    ? 'status-success'
                    : doc.status === 'Error'
                    ? 'status-error'
                    : 'status-pending'
                ]"
              >
                <i
                  :class="[
                    'fas',
                    doc.status === 'Procesado'
                      ? 'fa-check-circle'
                      : doc.status === 'Error'
                      ? 'fa-exclamation-circle'
                      : 'fa-clock'
                  ]"
                ></i>
              </span>
            </td>
            <td class="actions-cell">
              <button class="action-btn action-view" @click="viewDocument(doc)">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn action-download" @click="downloadDocument(doc)">
                <i class="fas fa-download"></i>
              </button>
              <button class="action-btn action-delete" @click="deleteDocument(doc)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-file-alt"></i>
      </div>
      <p class="empty-title">No se encontraron documentos</p>
      <small class="empty-subtext">
        Sube un archivo o ajusta los filtros de búsqueda para visualizar tus documentos aquí.
      </small>
    </div>

    <UploadDocument
      v-if="showUploadModal"
      @close="showUploadModal = false"
      @document-uploaded="handleDocumentUpload"
    />

    <DeleteConfirm
      v-if="showDeleteModal"
      :document="documentToDelete"
      @cancel="cancelDelete"
      @confirm-delete="confirmDelete"
    />

  </div>
</template>

<script>
import UploadDocument from '../components/Documents/UploadDocument.vue'; 
import DeleteConfirm from '../components/Documents/DeleteConfirm.vue';

export default {
  name: 'DocumentsPanel',
  components: {
    UploadDocument,
    DeleteConfirm,
  },
  data() {
    return {
      searchQuery: '',
      showUploadModal: false,
      showDeleteModal: false,
      documentToDelete: null,
      documents: [
        { id: 1, name: 'Manual_KIIBOT.pdf', date: '2025-04-10', fragments: 23, status: 'Procesado' },
        { id: 2, name: 'Ventas_Q1.txt', date: '2025-04-09', fragments: 0, status: 'Error' },
        { id: 3, name: 'FAQs_KIIBOT.docx', date: '2025-04-08', fragments: 15, status: 'En espera' },
      ],
    };
  },
  computed: {
    filteredDocuments() {
      const query = this.searchQuery.toLowerCase();
      return this.documents.filter((doc) => {
        return (
          doc.name.toLowerCase().includes(query) ||
          doc.user.toLowerCase().includes(query) ||
          doc.status.toLowerCase().includes(query)
        );
      });
    },
  },
  methods: {
    openAddDocumentModal() {
      this.showUploadModal = true;
    },
    handleDocumentUpload(newDoc) {
      this.documents.unshift(newDoc);
    },
    viewDocument(doc) {
      console.log('Ver documento:', doc.name);
    },
    downloadDocument(doc) {
      console.log('Descargar documento:', doc.name);
    },
    deleteDocument(doc) {
      this.documentToDelete = doc;
      this.showDeleteModal = true;
    },
    confirmDelete() {
      this.documents = this.documents.filter(
        (doc) => doc.id !== this.documentToDelete.id
      );
      this.showDeleteModal = false;
      this.documentToDelete = null;
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.documentToDelete = null;
    },
  }
};
</script>

<style scoped>
.documents-panel {
  padding: 0 2rem;
  font-family: 'Inter', sans-serif;
  max-width: 1000px;
  margin: 0 auto;
}

/*  */
.documents-header {
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

.txt-blue {
  color: #007bff;
}

.add-document-btn {
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

.add-document-btn i {
  font-size: 1.1rem;
}

.add-document-btn:hover {
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
.documents-table {
  padding: 0 2rem;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.9rem;
  color: #111827;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(1, 1, 1, 0.05);
  font-family: 'Poppins', sans-serif;
}

.table tbody tr:hover {
  background-color: #f1f1f1;
  transition: background-color 0.2s ease-in-out;
}

.table thead {
  background-color: #f9fafb;
  color: #ccc;
  font-weight: 500;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #e5e7eb;
}

.table th,
.table td {
  padding: 0.85rem 1.2rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  white-space: nowrap;
  text-align: left;
}

.table th {
  font-size: 0.82rem;
  font-weight: 500;
  color: #6b7280;
}


.table td:nth-child(1) {
  color: #111827;
  font-size: 0.93rem;
  font-weight: 600;
}

.table td:nth-child(2) {
  color: #4b5563;
  font-weight: 400;
  font-size: 0.88rem;
}

.table td:nth-child(3) {
  color: #1f2937;
  font-weight: 500;
  font-size: 0.88rem;
}

.table th:nth-child(5) {
  text-align: center;
}

.table th:nth-child(3),
.table td:nth-child(3) {
  text-align: center;
}

.table th:nth-child(4),
.table td:nth-child(4) {
  text-align: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease-in-out;
}

.status-success {
  background-color: rgba(34, 197, 94, 0.15); 
  color: #22c55e;
}

.status-error {
  background-color: rgba(239, 68, 68, 0.15); 
  color: #ef4444;
}

.status-pending {
  background-color: rgba(234, 179, 8, 0.15);
  color: #eab308;
}

.actions-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  margin: 0 auto;
}

.action-btn {
  background-color: #ffffff;
  border: 1.5px solid #e0e6ed;
  border-radius: 10px;
  padding: 0.50rem 0.55rem;
  cursor: pointer;
  color: #444;
  font-size: 0.9rem;
  transition: all 0.25s ease-in-out;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.action-btn i {
  pointer-events: none;
}

.action-view:hover {
  color: #2563eb;
  border-color: rgba(37, 99, 235, 0.3);
  background-color: rgba(37, 99, 235, 0.08);
  transform: translateY(-1px) scale(1.05);
}

.action-download:hover {
  color: #16a34a;
  border-color: rgba(22, 163, 74, 0.3);
  background-color: rgba(22, 163, 74, 0.08);
  transform: translateY(-1px) scale(1.05);
}

.action-delete:hover {
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.3);
  background-color: rgba(220, 38, 38, 0.08);
  transform: translateY(-1px) scale(1.05);
}

.empty-state {
  text-align: center;
  padding: 2rem 1.5rem;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.empty-icon {
  background-color: #eef2f8;
  padding: 1.6rem;
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
@media (max-width: 800px) {
  .documents-header {
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
    text-align: center;
  }

  .add-document-btn {
    width: 55%;
    justify-content: center;
    padding: 0.65rem;
    font-size: 0.92rem;
  }

  .add-document-btn i {
    font-size: 0.9rem;
  }

  .header-filters {
    justify-content: center;
    width: 100%;
  }

  .filter-input {
    width: 100%;
    font-size: 0.88rem;
    padding: 0.6rem 0.8rem;
  }

  .table th:nth-child(3),
  .table td:nth-child(3) {
    display: none;
  }

  .documents-table {
    padding: 0 1rem;
  }

  .table {
    font-size: 0.85rem;
  }

  .table th,
  .table td {
    padding: 0.7rem 0.9rem;
  }

  .table td:nth-child(1) {
    font-size: 0.9rem;
  }

  .action-btn {
    padding: 0.4rem 0.45rem;
    font-size: 0.85rem;
  }

  .status-badge {
    width: 1.8rem;
    height: 1.8rem;
    font-size: 1rem;
  }
}

@media (max-width: 610px) {
  .table th:nth-child(2),
  .table td:nth-child(2) {
    display: none;
  }

  .table {
    font-size: 0.82rem;
  }

  .table th,
  .table td {
    padding: 0.6rem 0.8rem;
  }

  .table td:nth-child(1) {
    font-size: 0.88rem;
  }

  .action-btn {
    padding: 0.35rem 0.4rem;
    font-size: 0.8rem;
  }

  .status-badge {
    width: 1.6rem;
    height: 1.6rem;
    font-size: 0.9rem;
  }

  .actions-cell {
    gap: 0.3rem;
  }
}

@media (max-width: 480px) {
  .documents-header {
    padding: 0.8rem;
    gap: 0.8rem;
  }

  .header-title {
    font-size: 1.2rem;
    text-align: center;
  }

  .add-document-btn {
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

  .table th:nth-child(4),
  .table td:nth-child(4) {
    display: none;
  }

  .documents-table {
    padding: 0 0.6rem;
  }

  .table {
    font-size: 0.8rem;
  }

  .table th,
  .table td {
    padding: 0.5rem 0.6rem;
  }

  .table td:nth-child(1) {
    font-size: 0.85rem;
  }

  .action-btn {
    padding: 0.3rem 0.35rem;
    font-size: 0.78rem;
    border-radius: 8px;
  }

  .status-badge {
    width: 1.4rem;
    height: 1.4rem;
    font-size: 0.85rem;
  }

  .actions-cell {
    gap: 0.25rem;
  }
}

</style>
