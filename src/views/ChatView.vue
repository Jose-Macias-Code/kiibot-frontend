<template>
  <div class="chat-wrapper">

    <transition-group name="message-fade" tag="div" class="chat-history">
      <div
        v-for="(msg, index) in flows[activeFlowIndex]"
        :key="msg.id"
        :ref="index === flows[activeFlowIndex].length - 1 ? 'lastMsg' : null"
        :class="['chat-bubble', msg.role === 'user' ? 'user' : 'bot']"
        @mouseenter="hoveredMessageId = msg.id"
        @mouseleave="hoveredMessageId = null"
      >
        <div
          v-if="editingMessageId !== msg.id"
          :class="['bubble-inner', 'markdown-body', msg.role === 'user' ? 'with-background' : '']"
          v-html="msg.versions[msg.activeVersion].content"
        ></div>

        <div
          v-else
          :class="['bubble-inner', 'markdown-body', msg.role === 'user' ? 'with-background' : '']"
        >
          <div
            class="edit-content"
            contenteditable="true"
            :ref="'editable-' + msg.id"
            @input="updateEditingText($event)"
            @keydown.enter.exact.prevent="saveEdit(msg)"
          >{{ editingText }}</div>

          <div class="edit-actions">
            <button class="cancel-btn" @click="cancelEdit">Cancelar</button>
            <button class="save-btn" @click="saveEdit(msg)">Enviar</button>
          </div>
        </div>

        <transition name="fade-slide">
          <div
            v-if="hoveredMessageId === msg.id && editingMessageId !== msg.id"
            :class="['message-actions', msg.role === 'user' ? 'user-actions' : 'bot-actions']"
          >
            <button class="action-btn" title="Copiar" @click="copyMessage(msg)">
              <i :class="copiedMessageId === msg.id ? 'fas fa-check' : 'fas fa-copy'"></i>
            </button>

            <button v-if="msg.role === 'user'" class="action-btn" title="Editar" @click="startEditing(msg)">
              <i class="fas fa-edit"></i>
            </button>

            <template v-if="msg.role === 'user' && msg.versions.length > 1">
              <button class="action-btn" @click="previousVersion(msg)" :disabled="msg.activeVersion === 0">
                <i class="fas fa-chevron-left"></i>
              </button>

              <span class="version-counter">{{ msg.activeVersion + 1 }}/{{ msg.versions.length }}</span>

              <button class="action-btn" @click="nextVersion(msg)" :disabled="msg.activeVersion === msg.versions.length - 1">
                <i class="fas fa-chevron-right"></i>
              </button>
            </template>
          </div>
        </transition>
      </div>

      <transition name="fade-in">
        <div
          v-if="isTyping"
          key="typing-indicator"
          class="chat-bubble bot typing-bubble"
        >
          <div class="dot-container">
            <span class="dot"></span>
          </div>
        </div>
      </transition>
    </transition-group>

    <transition name="scroll-fade">
      <button
        v-if="showScrollDownButton"
        class="scroll-to-bottom"
        @click="scrollToBottomSmooth"
      >
        <i class="fas fa-arrow-down"></i>
      </button>
    </transition>

    <div class="chat-input-fixed">
      <MessageInput class="input-existing" @send="handleSendMessage" />
    </div>

  </div>
</template>

<script>
import MessageInput from '../components/Chat/MessageInput.vue';
import { marked } from 'marked';
import hljs from 'highlight.js'; 
import 'highlight.js/styles/github.css';
import DOMPurify from 'dompurify';
import katex from 'katex';

marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});

export default {
  components: {
    MessageInput,
  },
  data() {
    return {
      showScrollDownButton: false,
      isTyping: false,
      hoveredMessageId: null,
      copiedMessageId: null,
      editingMessageId: null,
      editingText: '',
      activeFlowIndex: 0,
      flows: [
        [
          {
            id: 'msg1',
            role: 'user',
            versions: [
              { content: '<p>Hola, ¿qué tal?</p>' },
              { content: '<p>Buenas tardes, ¿me puedes ayudar?</p>' }
            ],
            activeVersion: 0
          },
          {
            id: 'msg2',
            role: 'bot',
            versions: [
              { content: '<p>¡Hola! 👋 Estoy muy bien, ¿en qué puedo ayudarte hoy?</p>' },
              { content: '<p>¡Buenas tardes! Claro, dime en qué necesitas ayuda.</p>' }
            ],
            activeVersion: 0
          },
          {
            id: 'msg3',
            role: 'user',
            versions: [
              { content: '<p>Quisiera saber sobre tu servicio.</p>' },
              { content: '<p>Me interesa saber los precios.</p>' }
            ],
            activeVersion: 0
          },
          {
            id: 'msg4',
            role: 'bot',
            versions: [
              { content: '<p>Por supuesto, ofrecemos distintos servicios. ¿Qué área te interesa?</p>' },
              { content: '<p>Claro, te paso los precios: Plan básico $50, Plan premium $100.</p>' }
            ],
            activeVersion: 0
          }
        ]
      ]
    };
  },
  mounted() {
    document.body.style.overflow = 'hidden';
    this.loadMessages();
    this.$nextTick(() => {
      const container = this.$el.querySelector('.chat-history');
      if (container) {
        container.addEventListener('scroll', () => {
          this.updateScrollButtonVisibility();
        });
      }
      this.scrollToBottomIfUserIsAtBottom(true);
    });
  },
  beforeUnmount() {
    document.body.style.overflow = '';
  },
  methods: {
    handleSendMessage({ text }) {
      const formatted = this.formatResponseText(text);
      const currentFlow = this.flows[this.activeFlowIndex];

      currentFlow.push({
        id: 'msg' + Date.now(),
        role: 'user',
        versions: [{ content: formatted }],
        activeVersion: 0
      });

      this.isTyping = true;

      this.$nextTick(() => {
        this.scrollToBottomIfUserIsAtBottom(true);
        this.updateScrollButtonVisibility();
      });

      setTimeout(() => {
        const reply = this.generateFakeBotReply(text);
        const formattedBot = this.formatResponseText(reply);

        currentFlow.push({
          id: 'msg' + Date.now(),
          role: 'bot',
          versions: [{ content: formattedBot }],
          activeVersion: 0
        });

        this.isTyping = false;

        this.$nextTick(() => {
          this.scrollToBottomIfUserIsAtBottom();
          this.updateScrollButtonVisibility();
          this.applyEnhancements();
        });
      }, 1200);
    },
    loadMessages() {
      this.$nextTick(() => {
        this.scrollToBottomIfUserIsAtBottom(true);
        this.updateScrollButtonVisibility();
        this.applyEnhancements();
      });
    },
    scrollToBottomIfUserIsAtBottom(force = false) {
      const container = this.$el.querySelector('.chat-history');
      const last = this.$refs.lastMsg;
      if (!container || !last) return;

      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10;

      if (force || isAtBottom) {
        if (Array.isArray(last)) {
          last[last.length - 1].scrollIntoView({ behavior: 'smooth' });
        } else {
          last.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    scrollToBottomSmooth() {
      const container = this.$el.querySelector('.chat-history');
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    },
    updateScrollButtonVisibility() {
      const container = this.$el.querySelector('.chat-history');
      if (!container) return;

      const atBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
      this.showScrollDownButton = !atBottom;
    },
    formatResponseText(text) {
      text = text.replace(/:::(note|warning)\s+([\s\S]+?):::/g, (_, type, content) => {
        return `<div class="alert ${type}">${marked.parseInline(content.trim())}</div>`;
      });

      text = text.replace(/==(.+?)==/g, '<mark>$1</mark>');
      text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');
      text = text.replace(/\\\((.+?)\\\)/gs, (_, formula) => {
        try {
          return katex.renderToString(formula, { displayMode: false });
        } catch {
          return `<code>${formula}</code>`;
        }
      });

      text = text.replace(/\$\$(.+?)\$\$/gs, (_, formula) => {
        try {
          return katex.renderToString(formula, { displayMode: true });
        } catch {
          return `<pre><code>${formula}</code></pre>`;
        }
      });

      const rawHtml = marked.parse(text);
      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ['loading'],
        ADD_TAGS: ['img', 'math', 'mi', 'mo', 'mn', 'msup', 'mrow']
      });

      return cleanHtml
        .replace(/<img /g, '<img loading="lazy" ')
        .replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
    },
    applyEnhancements() {
      this.highlightAllCode();
      this.labelAllLanguages();
      this.addAllCopyButtons();
    },
    highlightAllCode() {
      const codeBlocks = this.$el.querySelectorAll('pre code');
      codeBlocks.forEach(code => {
        const result = hljs.highlightAuto(code.innerText);
        code.innerHTML = result.value;
      });
    },
    labelAllLanguages() {
      const langAliasMap = { arcade: 'js', isbl: 'py', xml: 'html', csharp: 'java', haskell: 'bash', n1ql: 'sql' };
      const preBlocks = this.$el.querySelectorAll('pre');

      preBlocks.forEach(pre => {
        const code = pre.querySelector('code');
        if (!code || pre.querySelector('.code-lang')) return;

        const result = hljs.highlightAuto(code.innerText);
        const rawLang = result.language || 'text';
        const prettyLang = langAliasMap[rawLang.toLowerCase()] || rawLang.toLowerCase();

        const langLabel = document.createElement('div');
        langLabel.className = 'code-lang';
        langLabel.innerText = prettyLang;
        pre.insertBefore(langLabel, code);
      });
    },
    addAllCopyButtons() {
      const preBlocks = this.$el.querySelectorAll('pre');
      preBlocks.forEach(pre => {
        const code = pre.querySelector('code');
        if (!code || pre.querySelector('.copy-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.innerHTML = '<i class="fas fa-copy"></i>';
        btn.title = 'copiar';

        btn.addEventListener('click', () => {
          navigator.clipboard.writeText(code.innerText).then(() => {
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => (btn.innerHTML = '<i class="fas fa-copy"></i>'), 1500);
          });
        });

        pre.style.position = 'relative';
        pre.appendChild(btn);
      });
    },

    // Acciones 
    copyMessage(msg) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = msg.formattedContent;
      const text = tempDiv.innerText;
      navigator.clipboard.writeText(text).then(() => {
        this.copiedMessageId = msg.id;
        setTimeout(() => {
          this.copiedMessageId = null;
        }, 500);
      }).catch(err => {
        console.error('Error al copiar', err);
      });
    },
    startEditing(msg) {
      this.editingMessageId = msg.id;
      const div = document.createElement('div');
      div.innerHTML = msg.versions[msg.activeVersion].content;
      this.editingText = div.innerText;
    },
    saveEdit(msg) {
      const updatedText = this.formatResponseText(this.editingText);
      msg.versions.push({ content: updatedText });
      msg.activeVersion = msg.versions.length - 1;
      this.cancelEdit();
      this.cutAfter(msg);
    },
    cancelEdit() {
      this.editingMessageId = null;
      this.editingText = '';
    },
    updateEditingText(e) {
      this.editingText = e.target.innerText;
    },
    previousVersion(msg) {
      if (msg.activeVersion > 0) {
        const oldFlow = this.flows[this.activeFlowIndex];
        const pivotIndex = oldFlow.findIndex(m => m.id === msg.id);
        if (pivotIndex === -1) return;

        const clonedFlow = JSON.parse(JSON.stringify(oldFlow.slice(0, pivotIndex)));
        const editedMsg = { ...oldFlow[pivotIndex] };
        editedMsg.activeVersion--;

        clonedFlow.push(editedMsg);

        const botMsg = oldFlow[pivotIndex + 1];
        if (botMsg && botMsg.role === 'bot') {
          const newBot = { ...botMsg };
          if (newBot.versions.length > editedMsg.activeVersion) {
            newBot.activeVersion = editedMsg.activeVersion;
          }
          clonedFlow.push(newBot);
        }

        this.flows.push(clonedFlow);
        this.activeFlowIndex = this.flows.length - 1;
      }
    },
    nextVersion(msg) {
      if (msg.activeVersion < msg.versions.length - 1) {
        const oldFlow = this.flows[this.activeFlowIndex];
        const pivotIndex = oldFlow.findIndex(m => m.id === msg.id);
        if (pivotIndex === -1) return;

        const clonedFlow = JSON.parse(JSON.stringify(oldFlow.slice(0, pivotIndex)));
        const editedMsg = { ...oldFlow[pivotIndex] };
        editedMsg.activeVersion++;

        clonedFlow.push(editedMsg);

        const botMsg = oldFlow[pivotIndex + 1];
        if (botMsg && botMsg.role === 'bot') {
          const newBot = { ...botMsg };
          if (newBot.versions.length > editedMsg.activeVersion) {
            newBot.activeVersion = editedMsg.activeVersion;
          }
          clonedFlow.push(newBot);
        }

        this.flows.push(clonedFlow);
        this.activeFlowIndex = this.flows.length - 1;
      }
    },
    cutAfter(msg) {
      const flow = this.flows[this.activeFlowIndex];
      const index = flow.findIndex(m => m.id === msg.id);
      if (index !== -1) {
        this.flows[this.activeFlowIndex] = flow.slice(0, index + 1);
      }
    }
  }
};
</script>

<style scoped>
.chat-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 92vh;
  width: calc(100% + 17px);
}

.chat-input-fixed {
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.chat-history::-webkit-scrollbar {
  width: 8px;
}

.chat-history::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.chat-history::-webkit-scrollbar-track {
  background-color: transparent;
}

.scroll-to-bottom {
  position: absolute;
  right: 50%;
  bottom: 110px; 
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.scroll-to-bottom:hover {
  background-color: #f3f4f6;
  transform: scale(1.05);
}

.scroll-fade-enter-active,
.scroll-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.scroll-fade-enter-from,
.scroll-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.scroll-fade-enter-to,
.scroll-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Edit Mode */
.edit-textarea {
  width: 100%;
  border: none;
  resize: none;
  background-color: transparent;
  padding: 0;
  outline: none;
}

.edit-content {
  outline: none;
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: 30px;
  text-align: left;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
  padding-right: 2px;
}

.cancel-btn,
.save-btn {
  font-size: 14px;
  font-weight: 500;
  border-radius: 9999px;
  padding: 6px 16px;
  transition: all 0.2s ease-in-out;
  font-family: 'Inter', sans-serif;
}

.cancel-btn {
  background: #fff;
  border: 1.5px solid #d1d5db;
  color: #374151;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.save-btn {
  background: #111827;
  color: #fff;
  border: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.cancel-btn:hover {
  background: #f3f4f6;
  border-color: #cbd5e1;
  color: #1f2937;
}

.save-btn:hover {
  background: #000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}
</style>

<style>
.chat-bubble {
  max-width: 75%;
  margin: 8px;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.4;
}

.user {
  align-self: flex-end;
  border-top-right-radius: 0;
  text-align: right;
  max-width: 70%
}

.bot {
  align-self: flex-start;
  background-color: transparent;
  border-top-left-radius: 0;
  text-align: left;
}

.bubble-inner {
  padding: 8px 14px;
  border-radius: 18px;
  overflow: hidden;
  display: inline-block;
}

.with-background {
  background-color: #f1f1f1 !important;
}

.bubble-inner > *:first-child {
  margin-top: 0;
}

.bubble-inner > *:last-child {
  margin-bottom: 0;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.3s ease;
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.message-fade-enter-to,
.message-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/*  */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.message-actions {
  display: flex;
  font-size: 12px;
}

.user-actions {
  justify-content: flex-end;
  text-align: right;
  margin-right: 0px;
  margin-bottom: -26px;
}

.bot-actions {
  justify-content: flex-start;
  text-align: left;
  margin-left: 10px;
  margin-top: -10px;
  margin-bottom: -16px;
}

.action-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 6px 8px;
  font-size: 14px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, color 0.2s ease;
}

.action-btn:disabled {
  opacity: 0.4;
}

.action-btn i {
  pointer-events: none;
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #111827;
}

.version-counter {
  font-size: 12px;
  margin: 0 4px;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
}

/* Indicador de escritura */
.fade-in-enter-active {
  animation: fadeInTyping 0.4s ease-out forwards;
}
@keyframes fadeInTyping {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dot-container {
  background-color: transparent;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #111827;
  border-radius: 50%;
  animation: pulse-dot 1.3s infinite ease-in-out;
}

@keyframes pulse-dot {
  0%, 100% {
    transform: scale(0.9);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.typing-bubble {
  align-self: flex-start;
  border-top-left-radius: 0;
  background: transparent;
}

/* Code */
pre code {
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  display: block;
  overflow-x: auto;
  background: #f6f8fa;
  line-height: 1.5;
}

.copy-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  color: #7b7b7b;
  background-color: transparent;
  font-size: 12px;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn:hover {
  color: #000;
}

.copy-btn i {
  pointer-events: none;
}

.code-lang {
  position: absolute;
  top: 12px;
  left: 8px;
  color: #7b7b7b;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  z-index: 5;
  pointer-events: none;
  font-family: 'Inter', sans-serif;
}

pre {
  position: relative;
  border: 1px solid #ccc;
}

/* Table */
.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 14px 0;
  font-size: 14px;
  overflow-x: auto;
  display: block;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid #e5e7eb;
  padding: 12px 14px;
  text-align: left;
  vertical-align: top;
  word-break: break-word;
}

.markdown-body th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #111827;
}

.markdown-body tr:nth-child(even) {
  background-color: #f8f9fc;
}

.markdown-body tr:hover {
  background-color: #f1f5f9;
}

/* ChechBox */
.markdown-body input[type="checkbox"] {
  accent-color: #6b7280; 
  width: 16px;
  height: 16px;
  margin-right: 8px;
  cursor: default;
  vertical-align: middle;
}

.markdown-body li {
  margin-bottom: 6px;
}

.markdown-body li:has(input[type="checkbox"]) {
  list-style: none;
  display: flex;
  align-items: center;
}

/* Imagenes */
.markdown-body img {
  max-width: 100%;
  max-height: 320px;
  height: auto;
  border-radius: 6px;
  margin: 12px 0;
  display: block;
}

.max-img-limit img {
  max-height: 500px;
  object-fit: contain;
}

/* Enlaces */
.markdown-body a {
  color: #2563eb;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.markdown-body a:hover {
  color: #1d4ed8;
}

/* Notas + Texto RayadoYa casi */
.alert.note {
  border-left: 4px solid #2196f3;
  padding: 8px 15px;
  border-radius: 6px;
  margin: 12px 0;
  color: #1a202c;
  font-size: 14px;
}

.alert.warning {
  border-left: 4px solid #ffa726;
  padding: 8px 15px;
  border-radius: 6px;
  margin: 12px 0;
  color: #1a202c;
  font-size: 14px;
}

del {
  color: #9ca3af;
  text-decoration: line-through;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .chat-wrapper {
    height: 88vh;
    width: 100%;
    padding: 0;
  }

  .chat-history {
    padding: 10px;
  }

  .chat-bubble {
    max-width: 90%;
    font-size: 14px;
    margin: 6px;
  }

  .bubble-inner {
    padding: 10px 12px;
  }

  .edit-content {
    font-size: 14px;
  }

  .message-actions {
    font-size: 12px;
  }

  .version-counter {
    font-size: 11px;
  }

  .edit-actions {
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
    padding: 8px 12px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .chat-bubble {
    max-width: 96%;
    font-size: 13px;
  }

  .bubble-inner {
    padding: 8px 10px;
  }

  .dot {
    width: 8px;
    height: 8px;
  }

  .copy-btn {
    top: 6px;
    right: 6px;
    font-size: 10px;
  }

  .code-lang {
    top: 6px;
    left: 6px;
    font-size: 10px;
  }

  .chat-input-fixed {
    padding: 0 6px;
  }

  pre code {
    font-size: 13px;
    padding: 10px;
  }
}

</style>