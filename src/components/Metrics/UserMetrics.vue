<template>
  <div class="user-metrics">

    <section class="metrics-section">
      <h3 class="section-title">
        <i class="fas fa-comments"></i> Actividad del Usuario
      </h3>

      <div class="metrics-grid">
        <MetricCard title="Chats Totales" icon="fas fa-comment-dots" :value="data.totalChats" />
        <MetricCard title="Msj Enviados" icon="fas fa-paper-plane" :value="data.userMessages" />
        <MetricCard title="Respuestas del Bot" icon="fas fa-robot" :value="data.botMessages" />
        <MetricCard title="Chats Eliminados" icon="fas fa-trash-alt" :value="data.deletedChats" />
        <MetricCard title="Msj Eliminados" icon="fas fa-minus-circle" :value="data.deletedMessages" />
        <MetricCard title="Respuestas Bot Eliminadas" icon="fas fa-robot" :value="data.deletedBotReplies" />
      </div>
    </section>

    <section class="metrics-section">
      <h3 class="section-title">
        <i class="fas fa-book-open"></i> Uso del Conocimiento
      </h3>

      <div class="metrics-grid">
        <MetricCard title="Consultas a Documentos" icon="fas fa-search" :value="data.totalConsultas" />
        <MetricCard title="Generación de Contenido" icon="fas fa-pen-nib" :value="data.generativeUses" />
      </div>

      <MetricList
        title="Documentos Más Consultados"
        icon="fas fa-file-alt"
        :items="data.topDocs.map(doc => ({
          label: doc.Documento,
          value: doc['Veces Usado']
        }))"
      />
    </section>

    <section class="metrics-section">
      <h3 class="section-title">
        <i class="fas fa-chart-line"></i> Comportamiento
      </h3>

      <div class="metrics-grid">
        <MetricCard title="Tiempo Prom. entre Msj y Respuesta" icon="fas fa-stopwatch" :value="data.responseTime + ' seg'" />
        <MetricCard title="Intención Clara (%)" icon="fas fa-percentage" :value="data.intentRate + '%'" />
      </div>

      <MetricList
        v-if="data.starredChats && data.starredChats.length"
        title="Conversaciones Destacadas"
        icon="fas fa-star"
        :items="data.starredChats.map(chat => ({
          label: chat.titulo,
          value: chat.fecha
        }))"
      />
    </section>

  </div>
</template>

<script>
import MetricCard from './Widgets/MetricCard.vue';
import MetricList from './Widgets/MetricList.vue';

export default {
  name: 'UserMetrics',
  components: {
    MetricCard,
    MetricList
  },
  props: {
    userId: String,
    filters: Object,
    appliedFilters: Object
  },
  data() {
    return {
      data: {
        totalChats: 25,
        userMessages: 1130,
        botMessages: 870,
        deletedChats: 4,
        deletedMessages: 90,
        deletedBotReplies: 22,

        totalConsultas: 78,
        generativeUses: 43,
        topDocs: [
          { Documento: 'Guía de Onboarding', 'Veces Usado': 22 },
          { Documento: 'Ventas AI', 'Veces Usado': 16 }
        ],

        responseTime: 2.4,
        intentRate: 86,

        starredChats: [
          { titulo: 'Chat con Cliente A', fecha: '2025-04-03' },
          { titulo: 'Chat de Prueba B', fecha: '2025-04-09' }
        ]
      }
    };
  },
  mounted() {
    this.fetchUserMetrics();
  },
  methods: {
    fetchUserMetrics() {
    }
  }
};
</script>

<style scoped>
.user-metrics {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
}

.metrics-section {
  padding: 0 1rem;
  border-radius: 14px;
  animation: fadeIn 0.4s ease-in-out;
}

.section-title {
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  font-size: 1.6rem;
  font-weight: 500;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.2;
  position: relative;
  white-space: nowrap;
}

.section-title::after {
  content: '';
  flex: 1;
  height: 2px;
  background-color: #e5e7eb;
  margin-left: 0.5rem;
  margin-top: 2px;
  display: block;
}

.section-title i {
  font-size: 1rem;
  color: #10b981;
  background-color: #ecfdf5;
  padding: 6px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  min-height: 28px;
}

.metrics-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 590px) {
  .section-title {
    font-size: 1rem;
    flex-direction: column;
    align-items: flex-start;
    white-space: normal;
  }

  .section-title::after {
    display: none; 
  }

  .section-title i {
    font-size: 0.9rem;
    min-width: 24px;
    min-height: 24px;
    padding: 5px;
  }

  .metrics-grid {
    flex-direction: column;
  }

  .metrics-section {
    padding: 0.6rem;
  }
}
</style>
