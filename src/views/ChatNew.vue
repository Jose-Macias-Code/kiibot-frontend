<template>
  <div class="chat-new-container">
    <div class="chat-new-content">
      <!-- Imagen -->
      <div class="chat-image">
        <img src="../assets/img/inicio.webp" alt="KIIBOT" loading="lazy"/>
      </div>

      <!-- Texto -->
      <div class="chat-text">
        <h1 class="chat-new-title">
          <span class="highlight">KIIBOT</span> te acompaña en lo que necesites
        </h1>
      </div>

     <MessageInput class="input-new" @send="handleSendMessage" />

    </div>
  </div>
</template>

<script>
import MessageInput from '../components/Chat/MessageInput.vue';

export default {
  components: {
    MessageInput
  },
  methods: {
    handleSendMessage(message) {
      console.log("Mensaje enviado desde input:", message);
    }
  }
};
</script>

<style scoped>
.chat-new-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.chat-new-content {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
}

.chat-image img {
  height: 140px;
  width: auto;
  margin: 0 auto 1rem;
  display: block;
  animation: floatIn 0.8s ease-in-out;
  margin-top: -2rem;
  background-color: transparent;
}

.chat-new-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
  animation: fadeSlideIn 0.8s ease-in-out;
}

.chat-new-title .highlight {
  color: #2563eb;
  font-weight: 800;
  letter-spacing: 0.5px;
}

@keyframes floatIn {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  60% {
    transform: translateY(10px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .chat-new-container {
    padding: 1.5rem 1rem;
  }

  .chat-new-title {
    font-size: 1.2rem;
    padding: 0 0.5rem;
  }

  .chat-image img {
    width: 130px;
    height: auto;
    margin-bottom: 1rem;
    margin-top: -1rem;
  }
}

@media (max-width: 480px) {
  .chat-new-container {
    padding: 1rem 0.5rem;
  }

  .chat-new-title {
    font-size: 1.1rem;
    line-height: 1.3;
  }

  .chat-image img {
    width: 110px;
    margin-top: 0;
  }
}
</style>
