<template>
  <div class="dashboard-container">
    <header class="header-container">
      <div class="header-image">
        <img src="../assets/img/saludo.webp" alt="KIIBOT Logo" loading="lazy">
      </div>

      <div class="header-text">
        <h1>Bienvenido al Panel de <span class="highlight">KIIBOT</span></h1>
        <p>
          Gestiona y supervisa todas las funciones de KIIBOT de manera rápida y eficiente.
          <br><strong>Optimiza y mantén KIIBOT siempre actualizado.</strong>
        </p>
      </div>
    </header>

    <section class="options-container">
      <div class="section-box" @click="$router.push('/users')">
        <div class="box-header">
          <i class="fas fa-users"></i>
          <span>Usuarios</span>
        </div>
        <p class="box-description">
          Administra los usuarios registrados en el sistema. Puedes ver, editar, eliminar y asignar roles según los permisos necesarios.
        </p>
      </div>
      <div class="section-box" @click="$router.push('/metrics')">
        <div class="box-header">
          <i class="fas fa-chart-line"></i>
          <span>Métricas</span>
        </div>
        <p class="box-description">
          Consulta estadísticas sobre la actividad de KIIBOT, incluyendo el número de conversaciones activas, tiempo de respuesta, etc etc.
        </p>
      </div>
      <div class="section-box" @click="$router.push('/documents')">
        <div class="box-header">
          <i class="fas fa-folder-open"></i>
          <span>Documentos</span>
        </div>
        <p class="box-description">
          Gestiona los archivos que alimentan la base de conocimiento de KIIBOT. Sube nuevos documentos y actualiza información
        </p>
      </div>
      <div class="section-box" @click="$router.push('/embeddings')">
        <div class="box-header">
          <i class="fas fa-brain"></i>
          <span>Base de Conocimiento</span>
        </div>
        <p class="box-description">
          Edita y gestiona los fragmentos de conocimiento que usa KIIBOT para responder con precisión.
        </p>
      </div>
    </section>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap');

.header-container {
  display: flex;
  align-items: center;
  justify-content: center; 
  margin-top: 0;
  gap: 1rem; 
}

.header-image {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; 
}

.header-image img {
  width: 130px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.1));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(5px); }
  100% { transform: translateY(0); }
}

.header-text {
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  max-width: 600px; 
  font-family: 'Inter', sans-serif; 
}

.header-text h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.header-text .highlight {
  color: #007bff;
}

.header-text p {
  font-size: 1rem;
  color: #444;
  line-height: 1.4;
  font-weight: 400;
}

.footer-text {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

@media (max-width: 850px) {
  .header-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    padding: 1rem;
  }

  .header-image img {
    width: 120px; 
  }

  .header-text {
    max-width: 90%; 
    text-align: center;
  }

  .header-text h1 {
    font-size: 1.3rem; 
  }

  .header-text p {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .header-container {
    gap: 0.8rem;
    padding: 0.8rem;
  }

  .header-image img {
    width: 100px;
  }

  .header-text h1 {
    font-size: 1.2rem;
  }

  .header-text p {
    font-size: 0.9rem;
  }

  .footer-text {
    font-size: 0.85rem;
  }
}

.options-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  justify-content: center;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
}

.section-box {
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  justify-content: flex-start;
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-in-out;
  position: relative;
  z-index: 1;
  border: 2px solid transparent;
  padding: 1rem;
  cursor: pointer;
}

.box-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 1rem;
}

.section-box i {
  font-size: 1.5rem;
  color: #007bff;
  transition: color 0.3s ease-in-out;
  margin-right: 5px;
}

.box-description {
  font-size: 0.95rem;
  font-weight: 400;
  color: #555;
  margin-top: 0.5rem;
  line-height: 1.4;
}

.section-box:hover {
  border-color: #007bff;
  animation: glow 1s infinite linear;
}

.section-box:hover i {
  color: #0056b3;
}

.options-container:hover .section-box {
  opacity: 0.5;
}

.options-container:hover .section-box:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.2rem;
    padding: 1.2rem;
  }

  .header-image img {
    width: 110px;
  }

  .header-text h1 {
    font-size: 1.25rem;
  }

  .header-text p {
    font-size: 0.95rem;
  }

  .options-container {
    grid-template-columns: 1fr;
    padding: 1.5rem 1rem 0;
  }

  .section-box {
    min-height: 120px;
    padding: 1rem;
  }

  .box-description {
    font-size: 0.9rem;
    line-height: 1.5;
  }
}

@media (max-width: 480px) {
  .options-container .section-box:nth-child(4) {
    display: none !important;
  }
  
  .header-container {
    padding: 1rem 0.5rem;
    gap: 0.8rem;
  }

  .header-text h1 {
    font-size: 1.1rem;
  }

  .header-text p {
    font-size: 0.85rem;
  }

  .header-image img {
    width: 90px;
  }

  .section-box {
    padding: 0.9rem;
  }

  .box-header span {
    font-size: 0.95rem;
  }

  .box-description {
    font-size: 0.85rem;
    margin-top: 0;
  }
}

</style>
