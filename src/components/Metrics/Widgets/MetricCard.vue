<template>
  <div class="metric-card">
    <div class="icon-container" v-if="icon">
      <i :class="icon"></i>
    </div>
    <div class="metric-content">
      <h4 class="metric-title">{{ title }}</h4>
      <p class="metric-value">
        <template v-if="loading">
          <span class="spinner"></span>
          <span class="loading-label">Cargando...</span>
        </template>
        <template v-else-if="value === null || value === ''">
          <i class="fas fa-ban no-data-icon"></i>
          <span class="no-data-text">Sin datos</span>
        </template>
        <span v-else>{{ animatedValue }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    title: { type: String, required: true },
    value: { type: [String, Number, null], default: null },
    icon: { type: String, default: '' },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      animatedValue: '',
      interval: null
    };
  },
  computed: {
    isLoading() {
      return this.loading || this.value === null || this.value === '' || this.value === undefined;
    }
  },
  watch: {
    value(newVal) {
      if (typeof newVal === 'number') {
        this.startCountAnimation(newVal);
      } else if (typeof newVal === 'string') {
        this.handleStringValue(newVal);
      }
    }
  },
  mounted() {
    if (!this.isLoading) {
      if (typeof this.value === 'number') {
        this.startCountAnimation(this.value);
      } else if (typeof this.value === 'string') {
        this.handleStringValue(this.value);
      }
    }
  },
  methods: {
    startCountAnimation(target, suffix = '') {
      clearInterval(this.interval);
      const duration = 1000;
      const frameRate = 24;
      const steps = duration / (1000 / frameRate);
      const increment = target / steps;
      let current = 0;
      this.interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          clearInterval(this.interval);
          this.animatedValue = `${Math.round(target).toLocaleString()}${suffix}`;
        } else {
          this.animatedValue = `${Math.round(current).toLocaleString()}${suffix}`;
        }
      }, 1000 / frameRate);
    },
    handleStringValue(val) {
      if (typeof val !== 'string') {
        this.animatedValue = '';
        return;
      }

      const match = val.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (match) {
        const number = parseFloat(match[1]);
        const suffix = match[2]?.trim() || '';
        if (!isNaN(number)) {
          this.startCountAnimation(number, suffix);
        } else {
          this.animatedValue = val;
        }
      } else {
        this.animatedValue = val;
      }
    },
  },
  beforeUnmount() {
    clearInterval(this.interval);
  }
};
</script>

<style scoped>
.metric-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.2rem 1.4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  transition: transform 0.15s ease-in-out;
  min-width: 200px;
  flex: 1;
}

.icon-container {
  font-size: 1.4rem;
  color: #4b5563;
  background-color: #f3f4f6;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
}

.metric-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.metric-title {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.metric-value {
  font-size: 1.3rem;
  font-weight: 600;
  color: #111827;
  text-align: left;
  margin-left: 40px;
}

.loading-label {
  margin-left: 0.4rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #6b7280;
  animation: fadeIn 1.2s ease-in-out infinite alternate;
}

@keyframes fadeIn {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

.no-data-icon {
  color: #9ca3af;
  margin-right: 0.4rem;
  font-size: 1rem;
}

.no-data-text {
  color: #9ca3af;
  font-size: 1rem;
  font-weight: 500;
}

@media (max-width: 500px) {
  .metric-card {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0;
  }

  .icon-container {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    padding: 0.5rem;
    align-self: center;
  }

  .metric-title {
    font-size: 0.85rem;
  }

  .metric-value {
    font-size: 1.1rem;
    text-align: center;
    margin-left: 0;
  }
}

@media (max-width: 430px) {
  .metric-card {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    gap: 0.3rem;
    min-width: auto;
  }

  .icon-container {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
    padding: 0.4rem;
  }

  .metric-title {
    font-size: 0.78rem;
    margin-bottom: 0.15rem;
  }

  .metric-value {
    font-size: 1rem;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border-width: 2px;
  }
}

</style>
