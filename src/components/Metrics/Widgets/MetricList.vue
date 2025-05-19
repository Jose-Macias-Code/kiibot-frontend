<template>
  <div class="metric-list">
    <div class="list-header">
      <i v-if="icon" :class="icon" class="list-icon"></i>
      <h4 class="list-title">{{ title }}</h4>
    </div>

    <div class="list-body">
      <template v-if="items.length > 0">
        <li
          v-for="(item, index) in items"
          :key="index"
          class="list-item"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div class="item-left">
            <span class="rank">#{{ index + 1 }}</span>
            <span class="label" :title="item.label">{{ item.label }}</span>
          </div>
          <span class="value">{{ item.value }}</span>
        </li>
      </template>
      <template v-else>
        <div class="empty-list-state">
          <i class="fas fa-list-ul"></i>
          <p class="empty-text">Sin datos disponibles</p>
          <small class="empty-subtext">Los elementos aparecerán aquí cuando haya métricas disponibles.</small>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricList',
  props: {
    title: { type: String, required: true },
    icon: { type: String, default: '' },
    items: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scoped>
.metric-list {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.4rem;
  margin-top: 1rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease-in-out;
  animation: fadeInContainer 0.4s ease-out;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
}

.list-icon {
  font-size: 1.25rem;
  color: #4b5563;
  background-color: #f3f4f6;
  padding: 0.4rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 36px;
}

.list-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.list-body {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: #ffffff;
  border-radius: 10px;
  border: 1.5px solid #f2f2f2f2;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
  animation: fadeInUp 0.4s ease-out both;
}

.list-item:hover {
  background-color: #f9fafb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  overflow: hidden;
}

.rank {
  background-color: #3b82f6;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  min-width: 28px;
  text-align: center;
}

.label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.value {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInContainer {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.empty-list-state {
  text-align: center;
  color: #9ca3af;
  padding: 2.5rem 1rem;
  border-radius: 10px;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.empty-list-state i {
  font-size: 2rem;
  color: #d1d5db;
}

.empty-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: #4b5563;
}

.empty-subtext {
  font-size: 0.85rem;
  color: #6b7280;
  text-align: center;
  max-width: 280px;
}

@media (max-width: 510px) {
  .metric-list {
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
  }

  .list-header {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  .list-icon {
    font-size: 1.3rem;
    width: 36px;
    height: 36px;
    padding: 0.45rem;
  }

  .list-title {
    font-size: 0.95rem;
    font-weight: 600;
  }

  .list-body {
    gap: 0.8rem;
  }

  .list-item {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1rem;
    text-align: center;
  }

  .item-left {
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }

  .rank {
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
    min-width: unset;
  }

  .label {
    font-size: 0.85rem;
    max-width: 100%;
    white-space: normal;
    word-break: break-word;
  }

  .value {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1f2937;
  }
}

</style>
