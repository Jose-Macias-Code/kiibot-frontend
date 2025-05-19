<template>
  <div class="general-metrics">

    <section class="metrics-section">
      <h3 class="section-title"><i class="fas fa-comments"></i> Conversaciones y Actividad</h3>

      <div class="metrics-grid">
        <MetricCard title="Total de Msj" icon="fas fa-comment-dots" :value="data.totalMessages" />
        <MetricCard title="Msj Eliminados" icon="fas fa-trash" :value="data.deletedMessages" />
        <MetricCard title="Prom. Duración por Chat" icon="fas fa-hourglass-half" :value="data.avgDuration != null ? `${data.avgDuration} msgs` : null" />
      </div>

      <MetricProgressGroup
        title="Chats"
        icon="fas fa-comments"
        :metrics="[
          { label: 'Activos', value: data.activeChats, icon: 'fas fa-calendar-day' },
          { label: 'Eliminados', value: data.deletedChats, icon: 'fas fa-trash-alt' }
        ]"
      />
    </section>

    <section class="metrics-section">
      <h3 class="section-title"><i class="fas fa-brain"></i> Inteligencia y Respuestas</h3>

      <div class="metrics-grid">
        <MetricCard title="Respuestas Generativas" icon="fas fa-pen-fancy" :value="data.generativeUses" />
        <MetricCard title="Tasa de Intención" icon="fas fa-percentage" :value="data.intentRate + '%'" />
      </div>

      <MetricPie
        :total="data.successfulResponses + data.emptyResponses"
        :conContexto="data.successfulResponses"
      />
    </section>

    <section class="metrics-section">
      <h3 class="section-title"><i class="fas fa-folder-open"></i> Documentos y Conocimiento</h3>

      <div class="metrics-grid">
        <MetricCard title="Documentos Totales" icon="fas fa-file-alt" :value="data.totalDocs" />
        <MetricCard title="Fragmentos Generados" icon="fas fa-layer-group" :value="data.totalEmbeddings" />
      </div>

      <MetricList
        title="Documentos Más Utilizados"
        icon="fas fa-file-alt"
        :items="data.topDocs.map(doc => ({
          label: doc.Documento,
          value: doc['Veces Usado']
        }))"
      />

      <MetricList
        title="Fragmentos Más Relevantes"
        icon="fas fa-align-left"
        :items="data.topFrags.map(frag => ({
          label: frag.Fragmento,
          value: frag['Veces Encontrado']
        }))"
      />
    </section>

    <section class="metrics-section">
      <h3 class="section-title"><i class="fas fa-tachometer-alt"></i> Rendimiento OpenAI</h3>

      <div class="metrics-grid">
        <MetricCard title="Tiempo Prom. de Respuesta" icon="fas fa-clock" :value="data.responseTime + ' seg'" />
        <MetricCard title="Errores API" icon="fas fa-exclamation-triangle" :value="data.apiErrors" />
        <MetricCard title="Respuestas Bot Eliminadas" icon="fas fa-trash-restore-alt" :value="data.deletedBotReplies" />
      </div>

      <MetricProgressGroup
        title="Tokens Usados"
        icon="fas fa-bolt"
        :metrics="[
          { label: 'Tokes', value: data.tokens },
        ]"
      />
    </section>

  </div>
</template>

<script>
import MetricCard from './Widgets/MetricCard.vue';
import MetricProgressGroup from './Widgets/MetricProgressGroup.vue';
import MetricList from './Widgets/MetricList.vue';
import MetricPie from './Widgets/MetricPie.vue';

export default {
  name: 'GeneralMetrics',
  components: {
    MetricCard,
    MetricProgressGroup,
    MetricList,
    MetricPie
  },
  props: {
    filters: Object,
    appliedFilters: Object
  },
  data() {
    return {
      data: {
        totalMessages: 10,
        avgDuration: 12,
        userMessages: 9040,
        botMessages: 11850,
        deletedMessages: 210,
        deletedChats: 38,
        activeChats: 48,

        successfulResponses: 10,
        emptyResponses: 10,
        generativeUses: 1830,
        intentRate: 91,

        totalDocs: 118,
        totalEmbeddings: 4921,
        topDocs: [
          { Documento: 'Onboarding KIIBOT', 'Veces Usado': 122 },
          { Documento: 'Guía de Ventas', 'Veces Usado': 89 },
          { Documento: 'FAQ Producto', 'Veces Usado': 72 }
        ],
        topFrags: [
          { Fragmento: '¿Qué es KIIBOT?', 'Veces Encontrado': 134 },
          { Fragmento: 'Política de reembolsos', 'Veces Encontrado': 95 },
          { Fragmento: 'Soporte técnico', 'Veces Encontrado': 84 }
        ],

        responseTime: 1.7,
        tokens: 6200,
        deletedBotReplies: 37,
        apiErrors: 4
      }
    };
  },
  mounted() {
    this.fetchMetrics();
  },
  methods: {
    fetchMetrics() {
      // Aquí va la llamada al backend con los filtros aplicados
    }
  }
};
</script>

<style scoped>
.general-metrics {
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
  color: #6366f1; 
  background-color: #eef2ff;
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
