<template>
  <div class="metric-progress-group">
    <h4 class="group-title">
      <i v-if="icon" :class="icon"></i>
      {{ title }}
    </h4>

    <div class="progress-items">
      <div
        class="progress-item"
        v-for="(item, index) in animatedMetrics"
        :key="index"
      >
        <div class="item-header">
          <div class="item-label">
            <i v-if="item.icon" :class="item.icon" />
            <span>{{ item.label }}</span>
          </div>

          <div class="item-value">
            <template v-if="loading">
              <div class="skeleton skeleton-text small"></div>
            </template>
            <template v-else-if="hasValidValue(item.value)">
              {{ item.displayValue }}
            </template>
            <template v-else>
              <i class="fas fa-ban no-data-icon"></i>
              <span class="no-data-text">Sin datos</span>
            </template>
          </div>
        </div>

        <div class="progress-bar">
          <template v-if="loading">
            <div class="skeleton skeleton-bar"></div>
          </template>
          <template v-else-if="hasValidValue(item.value)">
            <div class="progress-fill" :style="{ width: item.animatedWidth }"></div>
          </template>
          <template v-else>
            <div class="progress-fill empty"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricProgressGroup',
  props: {
    title: { type: String, required: true },
    icon: { type: String, default: '' },
    metrics: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      animatedMetrics: [],
    };
  },
  watch: {
    metrics: {
      handler(newVal) {
        if (!this.loading) {
          this.startAnimation(newVal);
        }
      },
      immediate: true,
    },
  },
  methods: {
    startAnimation(metrics) {
      const max = Math.max(...metrics.map((m) => m.value || 0)) || 1;

      this.animatedMetrics = metrics.map((item) => ({
        ...item,
        displayValue: '',
        animatedWidth: '0%',
      }));

      this.animatedMetrics.forEach((item, index) => {
        this.animateBoth(index, 0, item.value, max, 1000);
      });
    },
    animateBoth(index, start, end, max, duration) {
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = this.easeOutCubic(progress);
        const currentVal = Math.floor(start + (end - start) * eased);
        const percent = (end / max) * 100 * eased;

        this.animatedMetrics[index].displayValue = this.formatValue(currentVal);
        this.animatedMetrics[index].animatedWidth = `${percent.toFixed(2)}%`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.animatedMetrics[index].displayValue = this.formatValue(end);
          this.animatedMetrics[index].animatedWidth = `${((end / max) * 100).toFixed(2)}%`;
        }
      };

      requestAnimationFrame(animate);
    },
    formatValue(value) {
      return typeof value === 'number' ? value.toLocaleString() : value || '0';
    },
    easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    },
    hasValidValue(value) {
      return value !== null && value !== undefined && value !== '';
    },
  },
};
</script>

<style scoped>

.metric-progress-group {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.2rem;
  margin: 1rem 0;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease-in-out;
}

.group-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.4rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.progress-items {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #374151;
  font-weight: 500;
}

.item-label i {
  color: #6b7280;
  font-size: 1rem;
}

.item-value {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  min-width: 60px;
  text-align: right;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #f3f4f6;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  border-radius: 6px;
  transition: width 0.2s ease-out;
}

.skeleton {
  display: inline-block;
  background: linear-gradient(90deg, #f3f3f3 25%, #e2e8f0 50%, #f3f3f3 75%);
  background-size: 400% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 6px;
}

.skeleton-text {
  height: 14px;
  width: 40px;
}

.skeleton-bar {
  height: 10px;
  width: 100%;
}

.skeleton.small {
  width: 36px;
  height: 12px;
}

.no-data-icon {
  color: #9ca3af;
  margin-right: 0.4rem;
  font-size: 0.95rem;
}

.no-data-text {
  color: #9ca3af;
  font-size: 0.95rem;
  font-weight: 500;
}

.progress-fill.empty {
  background-color: #e5e7eb;
}

@keyframes shimmer {
  0% {
    background-position: -400% 0;
  }
  100% {
    background-position: 400% 0;
  }
}

@media (max-width: 430px) {
  .metric-progress-group {
    padding: 0.9rem;
    border-radius: 12px;
  }

  .group-title {
    font-size: 1rem;
    gap: 0.4rem;
    flex-wrap: wrap;
    word-break: break-word;
  }

  .progress-items {
    gap: 1.2rem;
  }

  .progress-item {
    gap: 0.4rem;
  }

  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }

  .item-label {
    font-size: 0.85rem;
    gap: 0.4rem;
    color: #4b5563;
  }

  .item-label i {
    font-size: 0.95rem;
  }

  .item-value {
    font-size: 0.9rem;
    text-align: left;
    font-weight: 600;
    color: #1f2937;
  }

  .progress-bar {
    height: 8px;
    border-radius: 4px;
  }

  .progress-fill {
    border-radius: 4px;
  }

  .skeleton.small {
    width: 32px;
    height: 10px;
  }

  .skeleton-text {
    height: 12px;
    width: 36px;
  }
}

</style>
