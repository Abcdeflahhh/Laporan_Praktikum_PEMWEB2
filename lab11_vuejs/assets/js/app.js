const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// URL API CodeIgniter
const apiUrl = "http://localhost:8080";

// ======================================================
// AXIOS INTERCEPTORS - MODUL 14
// ======================================================
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");

    console.log("TOKEN YANG DIKIRIM:", token);

    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      alert(
        "Sesi Anda telah berakhir atau token tidak sah. Silakan login kembali.",
      );

      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userToken");

      window.location.href = "#/login";
    }

    return Promise.reject(error);
  },
);

// Daftar Route
const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/artikel",
    component: Artikel,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/about",
    component: About,
    meta: {
      requiresAuth: true,
    },
  },
];

// Membuat Router
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Route Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated =
    localStorage.getItem("isLoggedIn") === "true" &&
    localStorage.getItem("userToken");

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    alert("Akses Ditolak! Anda harus login terlebih dahulu.");
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    next("/artikel");
  } else {
    next();
  }
});

// Membuat Aplikasi Vue
const app = createApp({
  data() {
    return {
      isLoggedIn: false,
    };
  },

  mounted() {
    this.checkLoginStatus();
  },

  methods: {
    checkLoginStatus() {
      this.isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true" &&
        localStorage.getItem("userToken");
    },

    logout() {
      if (confirm("Apakah Anda yakin ingin keluar aplikasi?")) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userToken");

        this.isLoggedIn = false;
        this.$router.push("/login");
      }
    },
  },
});

// Menggunakan Router
app.use(router);

// Menjalankan Aplikasi
app.mount("#app");
