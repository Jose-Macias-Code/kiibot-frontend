<template>
  <div class="modal-overlay">
    <div class="modal-card">
      <p class="modal-title">¿Eliminar chat?</p>
      <hr class="divider" />

      <div class="modal-body">
        <div class="modal-text-wrapper">
          <p class="modal-text">
            Esto eliminará <strong>{{ chatName }}</strong>.
          </p>
          <p class="modal-subtext">
            Al eliminar este chat, <strong>KIIBOT</strong> olvidará todo lo aprendido durante esta conversación. Esta acción no se puede deshacer.
          </p>
        </div>

        <div class="modal-image">
          <img src="../../assets/img/advertencia.webp" alt="KIIBOT Adv" loading="lazy"/>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" @click="$emit('cancel-delete')">Cancelar</button>
        <button class="btn-delete" @click="$emit('confirm-delete', chatId)">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDeleteModal',
  props: {
    chatId: {
      type: [String, Number],
      required: true
    },
    chatName: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.modal-card {
  background-color: #ffffff;
  border-radius: 20px;
  width: 95%;
  max-width: 400px;
  padding: 1rem 2rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-title {
  font-size: 24px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  margin: 0;
  text-align: center;
  letter-spacing: 1px;
  text-align: left;
}

.divider {
  margin: 15px 0 15px;
  border: none;
  height: 1.2px;
  background-color: #ddd;
}

.modal-body {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.modal-image {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.modal-text-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items:flex-start;
  max-width: 350px;
}

.modal-text {
  font-size: 18px;
  color: #222;
  margin: 0;
  font-family: 'Inter', sans-serif;
  margin-bottom: 5px;
}

.modal-text strong {
  font-weight: 700;
  color: #000;
}

.modal-subtext {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin: 0;
  text-align: left;
  max-width: 300px;
}

.modal-subtext strong {
  color: #007bff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
}

.btn-cancel {
  padding: 10px 22px;
  font-size: 15px;
  border-radius: 9999px;
  background-color: #fff;
  color: #333;
  border: 2px solid #ccc;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-cancel:hover {
  background-color: #f5f5f5;
  border-color: #bbb;
}

.btn-delete {
  padding: 10px 22px;
  font-size: 15px;
  border-radius: 9999px;
  background-color: #d93025;
  color: #fff;
  border: 2px solid #d93025;
  box-shadow: 0 0 0 2px white inset;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.btn-delete:hover {
  background-color: #b9281f;
  border-color: #b9281f;
}


/* Responsive */
@media (max-width: 600px) {
  .modal-card {
    padding: 1rem 1.2rem;
    max-width: 80%;
    border-radius: 14px;
  }

  .modal-title {
    font-size: 20px;
    text-align: center;
  }

  .modal-body {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .modal-image {
    width: 80px;
    height: 80px;
    margin: 0 auto;
  }

  .modal-text-wrapper {
    align-items: center;
    max-width: 100%;
  }

  .modal-text {
    font-size: 16px;
    text-align: center;
  }

  .modal-subtext {
    font-size: 13px;
    text-align: center;
    max-width: 100%;
  }

  .modal-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-top: 24px;
  }

  .btn-cancel,
  .btn-delete {
    width: 100%;
    font-size: 14px;
    padding: 10px 16px;
  }
}
</style>