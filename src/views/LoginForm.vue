<template>
  <div class="login-container">
    <h1 class="login-title">¡Bienvenido(a) de nuevo!</h1>
    <p class="login-subtitle">Por favor, inicia sesión para continuar.</p>

    <div class="cred-tooltip">
      <i class="fas fa-info-circle"></i>
      <div class="tooltip-content">
        <strong>Credenciales de prueba:</strong><br>
        Correo: <code>admin@gmail.com</code><br>
        Contraseña: <code>123456</code>
      </div>
    </div>

    <form @submit.prevent="handleLogin">
      <div class="input-group" :class="{ 'error-border': emailError }">
        <input
          type="email"
          id="email"
          v-model="email"
          @focus="focusedField = 'email'"
          @blur="validateEmail"
        />
        <label
          :class="{ active: focusedField === 'email' || email, 'error-label': emailError }"
          for="email"
        >
          Dirección de correo electrónico*
        </label>
      </div>
      <p v-if="emailError" class="error-message">{{ emailError }}</p>

      <div class="input-group" :class="{ 'error-border': passwordError }">
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          v-model="password"
          @focus="focusedField = 'password'"
          @blur="validatePassword"
        />
        <label
          :class="{ active: focusedField === 'password' || password, 'error-label': passwordError }"
          for="password"
        >
          Contraseña*
        </label>
        <i 
          :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
          class="toggle-password"
          @click="togglePassword"
        ></i>
      </div>
      <p v-if="passwordError" class="error-message">{{ passwordError }}</p>

      <button 
        type="submit" 
        class="login-button" 
        :disabled="isLocked"
      >
        <span v-if="!isLocked">Iniciar sesión</span>
        <span v-else class="loading-spinner"></span>
      </button>
    </form>
    <transition name="fade">
      <p v-if="errorMessage" class="general-error-message">
        {{ errorMessage }}
      </p>
    </transition>
  </div>
</template>

<script>
const fake_user = {
  email: "admin@gmail.com",
  password: "123456",
  name: "Jose",
  role: "admin",
  profile_photo: "https://i.pravatar.cc/150?img=3"
};

export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
      focusedField: "",
      emailError: "",
      passwordError: "",
      showPassword: false,
      errorMessage: "",
      isLocked: false
    };
  },
  methods: {
    validateEmail() {
      if (!this.email.trim()) {
        this.emailError = "El correo no puede estar vacío.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        this.emailError = "Ingresa un correo válido.";
      } else {
        this.emailError = "";
      }
    },
    validatePassword() {
      if (!this.password.trim()) {
        this.passwordError = "La contraseña no puede estar vacía.";
      } else if (this.password.length < 6) {
        this.passwordError = "La contraseña debe tener al menos 6 caracteres.";
      } else {
        this.passwordError = "";
      }
    },
    async handleLogin() {
      this.validateEmail();
      this.validatePassword();

      if (!this.emailError && !this.passwordError) {
        this.isLocked = true;

        setTimeout(() => {
          if (
            this.email === fake_user.email &&
            this.password === fake_user.password
          ) {
            localStorage.setItem("token", "token-123456"); 
            localStorage.setItem("role", fake_user.role);
            localStorage.setItem("name", fake_user.name);
            localStorage.setItem("email", fake_user.email);
            localStorage.setItem("profile_photo", fake_user.profile_photo);

            this.$router.push("/chat/new");
          } else {
            this.errorMessage = "Credenciales incorrectas.";
            setTimeout(() => (this.errorMessage = ""), 2500);
          }

          this.isLocked = false;
        }, 800); 
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    handleTokenExpired() {
      this.errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
    }
  },
  mounted() {
    window.addEventListener("token-expired", this.handleTokenExpired);
  },
  beforeUnmount() {
    window.removeEventListener("token-expired", this.handleTokenExpired);
  }
};
</script>

<style scoped>
.login-container {
  text-align: center;
  margin-top: 100px;
}

.login-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.login-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

.input-group {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 25px auto;
}

.input-group input {
  width: 100%;
  padding: 15px 12px 10px;
  font-size: 1rem;
  border: 1px solid #c4c4c4;
  border-radius: 8px;
  outline: none;
  transition: border 0.3s ease, box-shadow 0.3s ease;
  background: transparent;
}

.input-group label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: #aaa;
  transition: all 0.3s ease;
  pointer-events: none;
  background-color: #f7f7f7;
  padding: 0 5px;
}

.input-group label.active {
  top: 2px;
  font-size: 0.85rem;
  color: #23a36e;
}

.input-group label.error-label {
  color: #ec1a03 !important;
}

.input-group input:focus {
  border: 2px solid #23a36e;
  box-shadow: 0px 4px 10px rgba(35, 163, 110, 0.2);
}

.error-message {
  color: #ec1a03;
  font-size: 0.9rem;
  text-align: left;
  max-width: 400px;
  margin: -10px auto 15px;
}

.error-border input {
  border: 2px solid #ec1a03 !important;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
  font-size: 1.2rem;
  transition: 0.3s ease;
}

.toggle-password:hover {
  color: #23a36e;
}

.login-button {
  width: 100%;
  max-width: 250px;
  padding: 14px;
  background-color: #23a36e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: block;
  margin: 20px auto 0; 
  text-align: center;
}

.login-button:hover {
  background-color: #1c8658;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
}

.login-button:active {
  background-color: #166746;
  transform: scale(0.98);
}

.login-button:disabled {
  background-color: #b3b3b3;
  cursor: not-allowed;
  box-shadow: none;
}

.loading-spinner {
  width: 22px;
  height: 22px;
  border: 3px solid #fff;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.general-error-message {
  background-color: #ff4b5c;
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-size: 1rem;
  margin-bottom: 15px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-active {
  transition: opacity 0.1s ease-in;
}

.fade-leave-active {
  transition: opacity 1s ease-out; 
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .login-container {
    margin-top: 100px;
  }

  .login-title {
    font-size: 1.8rem;
  }

  .login-subtitle {
    font-size: 1.1rem;
  }

  .input-group {
    max-width: 350px;
    margin: 20px auto;
  }

  .input-group input {
    font-size: 0.95rem;
    padding: 12px 10px;
  }

  .input-group label {
    font-size: 0.9rem;
  }

  .login-button {
    max-width: 230px;
    padding: 12px;
  }

  .error-message {
    font-size: 0.85rem;
    max-width: 350px;
  }
}

@media (max-width: 480px) {
  .login-container {
    margin-top: 100px;
    padding: 0 15px;
  }

  .login-title {
    font-size: 1.6rem;
  }

  .login-subtitle {
    font-size: 1rem;
  }

  .input-group {
    max-width: 80%;
    margin: 15px auto;
  }

  .input-group input {
    font-size: 0.9rem;
    padding: 10px;
  }

  .input-group label {
    font-size: 0.85rem;
  }

  .toggle-password {
    font-size: 1rem;
    right: 8px;
  }

  .login-button {
    max-width: 200px;
    padding: 10px;
    font-size: 0.9rem;
  }

  .error-message {
    font-size: 0.8rem;
    max-width: 80%;
    padding: 0 5px;
  }
}

.cred-tooltip {
  position: relative;
  display: inline-block;
  color: #555;
  font-size: 0.95rem;
  cursor: help;
}

.cred-tooltip i {
  font-size: 1.2rem;
  color: #23a36e;
}

.tooltip-content {
  visibility: hidden;
  background-color: #f0f0f0;
  color: #333;
  text-align: left;
  border-radius: 8px;
  padding: 12px;
  position: absolute;
  z-index: 100;
  width: max-content;
  min-width: 230px;
  left: 50%;
  transform: translateX(-50%);
  top: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
  font-family: monospace;
}

.cred-tooltip:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
}
</style>
