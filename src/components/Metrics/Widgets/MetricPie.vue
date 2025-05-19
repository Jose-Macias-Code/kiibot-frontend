<template>
  <div class="metric-pie-html">
    <template v-if="hasNoData">
      <div class="empty-pie">
        <i class="fas fa-chart-pie"></i>
        <p class="empty-pie-text">Sin datos disponibles</p>
      </div>
    </template>

    <template v-else>
      <div class="pie-chart-wrapper">
        <svg viewBox="0 0 36 36" class="pie-chart">
          <circle class="pie-bg" cx="18" cy="18" r="15.9155" />
          <circle
            class="pie-value"
            cx="18"
            cy="18"
            r="15.9155"
            :style="`--dasharray: ${percentage}`"
          />
          <text x="18" y="20.5" class="pie-text">{{ percentage }}%</text>
        </svg>
      </div>

      <div class="pie-legend">
        <div class="legend-item">
          <span class="dot dot-context"></span>
          <span>Con Contexto</span>
          <span class="legend-value">{{ conContexto.toLocaleString() }}</span>
        </div>
        <div class="legend-item">
          <span class="dot dot-nocontext"></span>
          <span>Sin Contexto</span>
          <span class="legend-value">{{ sinContexto.toLocaleString() }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MetricPieHTML',
  props: {
    total: { type: Number, required: true },
    conContexto: { type: Number, required: true }
  },
  computed: {
    percentage() {
      const pct = (this.conContexto / this.total) * 100;
      return isNaN(pct) ? 0 : Number(pct.toFixed(1));
    },
    sinContexto() {
      return this.total - this.conContexto;
    },
    hasNoData() {
      return !this.total || this.total === 0;
    }
  }
};
</script>

<style scoped>
.metric-pie-html {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.2rem 2rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem; 
  min-width: 240;
}

.pie-chart-wrapper {
  width: 130px;
  height: 130px;
  flex-shrink: 0;
}

.pie-chart {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.pie-bg {
  fill: none;
  stroke: #f3f4f6;
  stroke-width: 3.8;
}

.pie-value {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 3.8;
  stroke-linecap: round;
  stroke-dasharray: 0, 100;
  transition: stroke-dasharray 0.6s ease-out;
  animation: fillPie 1s ease-out forwards;
}

@keyframes fillPie {
  to {
    stroke-dasharray: var(--dasharray, 0), 100;
  }
}

.pie-text {
  fill: #111827;
  font-size: 0.35rem;
  font-weight: bold;
  text-anchor: middle;
  transform: rotate(90deg);
}

.pie-legend {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.8rem;
  font-size: 0.9rem;
  color: #1f2937;
  min-width: 120px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.legend-value {
  font-weight: 700;
  margin-left: auto;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.dot-context {
  background-color: #3b82f6;
}

.dot-nocontext {
  background-color: #e5e7eb;
}

.empty-pie {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  gap: 0.5rem;
  text-align: center;
  min-height: 100px;
}

.empty-pie i {
  font-size: 2.2rem;
  color: #d1d5db;
}

.empty-pie-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #6b7280;
}

@media (max-width: 768px) {
  .metric-pie-html {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 1rem;
  }

  .pie-legend {
    align-items: center;
    text-align: center;
  }

  .legend-item {
    justify-content: center;
    width: 100%;
  }

  .legend-value {
    margin-left: 0;
    margin-right: 0;
  }
}

</style>
