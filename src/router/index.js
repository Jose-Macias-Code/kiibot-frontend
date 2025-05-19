import { createRouter, createWebHashHistory } from "vue-router";

import LoginForm from "@/views/LoginForm.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import HomeView from "@/views/HomeView.vue";
import ChatView from "@/views/ChatView.vue";
import BackOffice from "@/views/BackOffice.vue";
import UserManagement from "@/views/UserManagement.vue";
import MetricsPanel from "@/views/MetricsPanel.vue";
import DocumentsPanel from "@/views/DocumentsPanel.vue";
import KnowledgeBase from "@/views/KnowledgeBase.vue";
import ChatNew from "@/views/ChatNew.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginForm },

  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "home", name: "Home", component: HomeView },
      { path: "chat/new", name: "ChatNew", component: ChatNew },
      { path: "chat/:id", name: "Chat", component: ChatView },
      {
        path: "backoffice",
        name: "BackOffice",
        component: BackOffice,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      { path: "users", name: "UserManagement", component: UserManagement },
      { path: "metrics", name: "MetricsPanel", component: MetricsPanel },
      { path: "documents", name: "DocumentsPanel", component: DocumentsPanel },
      { path: "embeddings", name: "KnowledgeBase", component: KnowledgeBase },
    ],
  },

  { path: "/:catchAll(.*)", redirect: "/home" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    next("/home");
  } else if (to.meta.requiresAdmin && userRole !== "admin") {
    next("/home");
  } else {
    next();
  }
});

export default router;
