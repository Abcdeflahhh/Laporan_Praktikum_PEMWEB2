const Login = {
  template: `
    <div class="login-container">
        <div class="login-box">

            <h2>Form Login Admin</h2>

            <form @submit.prevent="handleLogin">

                <div class="form-group">
                    <label>Username / Email</label>
                    <input
                        type="text"
                        v-model="username"
                        placeholder="Masukkan username"
                        required>
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        v-model="password"
                        placeholder="Masukkan password"
                        required>
                </div>

                <button
                    type="submit"
                    class="btn-login">
                    Masuk Aplikasi
                </button>

            </form>

            <p
                v-if="errorMessage"
                class="error-msg">
                {{ errorMessage }}
            </p>

        </div>
    </div>
  `,

  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },

  mounted() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("userToken");

    if (isLoggedIn === "true" && token) {
      this.$router.replace("/artikel");
    }
  },

  methods: {
    handleLogin() {
      this.errorMessage = "";

      axios
        .post(apiUrl + "/api/login", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          console.log("Response login:", response.data);

          if (response.data.status === 200) {
            const token = response.data.data.token;

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userToken", token);

            console.log("Token dari backend:", token);
            console.log("Token tersimpan:", localStorage.getItem("userToken"));

            this.$root.isLoggedIn = true;
            this.$router.replace("/artikel");
          } else {
            this.errorMessage = "Login gagal.";
          }
        })
        .catch((error) => {
          console.log("Error login:", error);

          if (error.response && error.response.data.messages) {
            this.errorMessage = error.response.data.messages;
          } else {
            this.errorMessage = "Terjadi kesalahan jaringan atau server.";
          }
        });
    },
  },
};
