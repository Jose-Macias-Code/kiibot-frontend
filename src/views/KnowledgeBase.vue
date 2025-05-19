<template>
  <div class="knowledge-panel">

    <div class="knowledge-header">
      <div class="header-row">
        <h2 class="header-title">
          Base de Conocimiento <span class="txt-blue">KIIBOT</span>
        </h2>
      </div>

      <div class="header-filters">
        <input
          type="text"
          placeholder="Buscar por palabra o frase..."
          class="filter-input"
          v-model="searchQuery"
        />
        <select class="filter-select" v-model="selectedDocument">
          <option value="">Todos los documentos</option>
          <option v-for="doc in availableDocuments" :key="doc" :value="doc">
            {{ doc }}
          </option>
        </select>
      </div>
    </div>

    <div class="knowledge-table">
      <template v-if="filteredFragments.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Fragmento</th>
              <th>Documento</th>
              <th class="col-fecha">Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fragment in filteredFragments" :key="fragment.id" :class="{ expanded: expandedIds.includes(fragment.id) }" >
              <td>
                <div class="fragment-text" :class="{ expanded: expandedIds.includes(fragment.id) }">
                  <span>{{ fragment.text }}</span>
                  <button
                    v-if="shouldShowToggle(fragment.text)"
                    class="readmore-btn"
                    @click="toggleFragment(fragment.id)"
                    :title="expandedIds.includes(fragment.id) ? 'Ocultar' : 'Ver completo'"
                  >
                    <i :class="expandedIds.includes(fragment.id) ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </td>
              <td>{{ fragment.document }}</td>
              <td class="col-fecha">{{ fragment.date }}</td>
              <td>
                <span
                  :class="['status-chip', fragment.was_edited ? 'edited' : 'original']"
                >
                  <i
                    :class="[
                      'fas',
                      fragment.was_edited ? 'fa-edit' : 'fa-file-alt'
                    ]"
                  ></i>
                </span>
              </td>
              <td class="actions-cell">
                <button
                  class="action-btn action-edit"
                  @click="editFragment(fragment)"
                >
                  <i class="fas fa-pen"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-folder-open"></i>
        </div>
        <p class="empty-title">No hay fragmentos disponibles</p>
        <small class="empty-subtext">
          Ajusta los filtros o carga un documento procesado para ver los fragmentos aquí.
        </small>
      </div>

    </div>

    <EditFragmentModal
      v-if="showEditModal"
      :fragment="fragmentBeingEdited"
      @close="closeEditModal"
      @save="handleFragmentSave"
    />

  </div>
</template>

<script>
import EditFragmentModal from '../components/Knowledge/EditFragmentModal.vue';

export default {
  name: 'BaseConocimiento',
  components: {
    EditFragmentModal
  },
  data() {
    return {
      searchQuery: '',
      selectedDocument: '',
      showEditModal: false,
      fragmentBeingEdited: null,
      expandedIds: [],
      fragments: [
        {
          id: 1,
          text: 'Yo ofrezco esnudas, vírgenes, intactas y sencillas, para mis delicias y el placer de mis amigos, estas noches árabes vividas, soñadas y traducidas sobre su tierra natal y sobre el agua Ellas me fueron dulces durante los ocios en remotos mares, bajo un cielo ahora lejano. Por eso las doy. Sencillas, sonrientes y llenas de ingenuidad, como la musulmana Schehrazada, su madre suculenta que las dió a luz en el misterio; fermentando con emoción en los brazos de un príncipe sublime —lúbrico y feroz—, bajo la mirada enternecida de Alah, clemente y misericordioso. Al venir al mundo fueron delicadamente mecidas por las manos de la lustral Doniazada, su buena tía, que grabó sus nombres sobre hojas de oro coloreadas de húmedas pedrerías y las cuidó bajo el terciopelo de sus pupilas hasta la adolescencia dura, para esparcirlas después, voluptuosas y libres, sobre el mundo oriental, eternizado por su sonrisa. Yo os las entrego tales como son, en su frescor de carne y de rosa. Sólo existe un método honrado y lógico de traducción: la «literalidad», una literalidad impersonal, apenas atenuada por un leve parpadeo y una ligera sonrisa del traductor. Ella crea, sugestiva, la más grande potencia literaria. Ella produce el placer de la evocación. Ella es la garantía de la verdad. Ella es firme e inmutable, en su desnudez de piedra. Ella cautiva el aroma primitivo y lo cristaliza. Ella separa y desata... Ella fija. La literalidad encadena el espíritu divagador y lo doma, al mismo tiempo que detiene la infernal facilidad de la pluma. Yo me felicito de que así sea; porque ¿dónde encontrar un traductor de genio simple, anónimo, libre de la necia manía de su renombre?...',
          document: 'manual_kiibot.pdf',
          date: '2025-04-10',
          was_edited: false
        },
        {
          id: 2,
          text: 'Los usuarios pueden interactuar con el bot mediante comandos personalizados...',
          document: 'faq_general.docx',
          date: '2025-04-09',
          was_edited: true
        },
        {
          id: 3,
          text: 'Para acceder a las configuraciones avanzadas, dirígete al panel de administrador...',
          document: 'manual_admin.pdf',
          date: '2025-04-08',
          was_edited: false
        }
      ]
    };
  },
  computed: {
    availableDocuments() {
      const docs = this.fragments.map(f => f.document);
      return [...new Set(docs)];
    },
    filteredFragments() {
      return this.fragments.filter(fragment => {
        const matchesQuery =
          fragment.text.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesDocument =
          this.selectedDocument === '' || fragment.document === this.selectedDocument;
        return matchesQuery && matchesDocument;
      });
    }
  },
  methods: {
    editFragment(fragment) {
      this.fragmentBeingEdited = { ...fragment }; 
      this.showEditModal = true;
    },
    closeEditModal() {
      this.fragmentBeingEdited = null;
      this.showEditModal = false;
    },
    handleFragmentSave(updatedFragment) {
      const index = this.fragments.findIndex(f => f.id === updatedFragment.id);
      if (index !== -1) {
        this.fragments[index] = {
          ...updatedFragment,
          was_edited: true,
          date: new Date().toISOString().slice(0, 10)
        };
      }
    },
    toggleFragment(id) {
      const index = this.expandedIds.indexOf(id);
      if (index === -1) {
        this.expandedIds.push(id);
      } else {
        this.expandedIds.splice(index, 1);
      }
    },
    shouldShowToggle(text) {
      return text.length > 180;
    },
  }
};
</script>

<style scoped>
.knowledge-panel {
  padding: 0 2rem;
  font-family: 'Inter', sans-serif;
  max-width: 1000px;
  margin: 0 auto;
}

.knowledge-header {
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

.header-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.filter-input,
.filter-select {
  flex: 1;
  max-width: 300px;
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

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(58, 142, 246, 0.15);
  background-color: #fff;
}

.knowledge-table {
  padding: 0 1rem;
  margin-top: 1rem;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  font-family: 'Poppins', sans-serif;
  font-size: 0.88rem;
}

.table thead th {
  background: #f8f9fb;
  font-weight: 600;
  color: #1f2937;
  padding: 0.9rem 1rem;
  text-align: left;
  border-bottom: 1.5px solid #e5e7eb;
  white-space: nowrap;
}

.table tr {
  transition: all 0.3s ease;
}

.table tr td {
  vertical-align: middle;
  transition: vertical-align 0.3s ease;
}

.table tr.expanded td {
  vertical-align: top;
}

.table td {
  padding: 0.8rem 1rem;
  color: #374151;
  background: #fff;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
  transition: background-color 0.2s ease-in-out;
}

.table tbody tr:hover td {
  background-color: #f9fafb;
}

.fragment-text {
  position: relative;
  max-width: 380px;
  font-size: 0.85rem;
  color: #1f2937;
  overflow: hidden;
  text-align: left;
  padding-right: 1.8rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.5;
  transition: max-height 1.3s ease, -webkit-line-clamp 1.3s ease;
  max-height: 3.2em;
}

.fragment-text.expanded {
  -webkit-line-clamp: unset;
  display: block;
  white-space: normal;
  max-height: 9999px; 
}

.readmore-btn {
  position: absolute;
  top: 0.25rem;
  right: 0.1rem;
  background: transparent;
  border: none;
  color: #007bff;
  font-size: 0.85rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.readmore-btn:hover {
  transform: scale(1.1);
}

.status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.8rem;
  height: 1.8rem;
  font-size: 0.95rem;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.status-chip.original {
  background-color: rgba(59, 130, 246, 0.1); 
  color: #3b82f6;
}

.status-chip.edited {
  background-color: rgba(234, 179, 8, 0.15); 
  color: #eab308;
}

.actions-cell {
  text-align: center;
}

.action-btn {
  background-color: #ffffff;
  border: 1.3px solid #d1d5db;
  border-radius: 8px;
  padding: 0.4rem 0.5rem;
  cursor: pointer;
  color: #444;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.action-btn i {
  pointer-events: none;
}

.action-edit:hover {
  background-color: rgba(59, 130, 246, 0.08);
  color: #2563eb;
  border-color: rgba(59, 130, 246, 0.4);
  transform: scale(1.05);
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
@media (max-width: 700px) {
  .col-fecha {
    display: none;
  }

  .table thead th,
  .table td {
    font-size: 0.78rem;
    padding: 0.6rem 0.6rem;
  }

  .header-title {
    font-size: 1.4rem;
  }

  .header-filters {
    flex-direction: column;
    align-items: center
  }

  .fragment-text {
    max-width: 240px;
  }

  .status-chip {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
  }

  .action-btn {
    padding: 0.35rem 0.4rem;
    font-size: 0.78rem;
  }
}

@media (max-width: 480px) {
  .table thead th,
  .table td {
    font-size: 0.75rem;
    padding: 0.55rem 0.5rem;
  }

  .header-title {
    font-size: 1.25rem;
    text-align: center;
  }

  .header-row {
    justify-content: center;
  }

  .fragment-text {
    max-width: 200px;
    font-size: 0.75rem;
  }

  .readmore-btn {
    top: 0.2rem;
    right: 0.1rem;
    font-size: 0.75rem;
  }
}

</style>
