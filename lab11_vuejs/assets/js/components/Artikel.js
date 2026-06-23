const Artikel = {
  template: `
    <div>
        <h2>Manajemen Data Artikel</h2>

        <button id="btn-tambah" @click="tambah">
            Tambah Data
        </button>

        <!-- Modal Form -->
        <div class="modal" v-if="showForm">
            <div class="modal-content">
                <span class="close" @click="tutupForm">&times;</span>

                <form>
                    <h3>{{ formTitle }}</h3>

                    <div>
                        <input
                            type="text"
                            v-model="formData.judul"
                            placeholder="Judul Artikel"
                        >
                    </div>

                    <div>
                        <textarea
                            v-model="formData.isi"
                            rows="6"
                            placeholder="Isi Artikel"
                        ></textarea>
                    </div>

                    <div>
                        <select v-model="formData.status">
                            <option
                                v-for="option in statusOptions"
                                :key="option.value"
                                :value="option.value"
                            >
                                {{ option.text }}
                            </option>
                        </select>
                    </div>

                    <input type="hidden" v-model="formData.id">

                    <button type="button" @click="saveData">Simpan</button>
                    <button type="button" @click="tutupForm">
                        Batal
                    </button>
                </form>
            </div>
        </div>

        <!-- Tabel Artikel -->
        <table border="1" cellpadding="8">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Judul</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, index) in artikel" :key="row.id">
                    <td>{{ row.id }}</td>
                    <td>{{ row.judul }}</td>
                    <td>{{ statusText(row.status) }}</td>

                    <td>
                        <a href="#" @click.prevent="edit(row)">Edit</a>
                        |
                        <a href="#" @click.prevent="hapus(index, row.id)">Hapus</a>
                    </td>
                </tr>

                <tr v-if="artikel.length === 0">
                    <td colspan="4" align="center">
                        Data artikel belum tersedia.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  `,

  data() {
    return {
      artikel: [],

      formData: {
        id: null,
        judul: "",
        isi: "",
        status: "draft",
      },

      showForm: false,
      formTitle: "Tambah Data",

      statusOptions: [
        { text: "Draft", value: "draft" },
        { text: "Publish", value: "publish" },
      ],
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      axios
        .get(apiUrl + "/post")
        .then((response) => {
          this.artikel = response.data.artikel;
        })
        .catch((error) => {
          console.log("Error load data:", error);
        });
    },

    tambah() {
      this.showForm = true;
      this.formTitle = "Tambah Data";

      this.formData = {
        id: null,
        judul: "",
        isi: "",
        status: "draft",
      };
    },

    edit(data) {
      this.showForm = true;
      this.formTitle = "Ubah Data";

      this.formData = {
        id: data.id,
        judul: data.judul,
        isi: data.isi,
        status: data.status,
      };
    },

    hapus(index, id) {
      if (confirm("Yakin menghapus data?")) {
        axios
          .delete(apiUrl + "/post/" + id)
          .then(() => {
            this.artikel.splice(index, 1);
          })
          .catch((error) => {
            console.log("Error hapus data:", error);
            alert("Gagal menghapus data.");
          });
      }
    },

    saveData() {
      console.log("Tombol simpan diklik");
      console.log("Data form:", this.formData);

      if (this.formData.judul.trim() === "") {
        alert("Judul artikel wajib diisi.");
        return;
      }

      if (this.formData.isi.trim() === "") {
        alert("Isi artikel wajib diisi.");
        return;
      }

      const payload = {
        judul: this.formData.judul,
        isi: this.formData.isi,
        status: this.formData.status,
      };

      if (this.formData.id) {
        axios
          .put(apiUrl + "/post/" + this.formData.id, payload)
          .then((response) => {
            console.log("Update berhasil:", response.data);

            this.loadData();
            this.tutupForm();
          })
          .catch((error) => {
            console.log("Error update data:", error);
            alert("Gagal mengubah data. Cek Console.");
          });
      } else {
        axios
          .post(apiUrl + "/post", payload)
          .then((response) => {
            console.log("Tambah berhasil:", response.data);

            this.loadData();
            this.tutupForm();
          })
          .catch((error) => {
            console.log("Error tambah data:", error);
            alert("Gagal menyimpan data. Cek Console.");
          });
      }
    },

    tutupForm() {
      this.showForm = false;
      this.resetForm();
    },

    resetForm() {
      this.formData = {
        id: null,
        judul: "",
        isi: "",
        status: "draft",
      };
    },

    statusText(status) {
      if (status === "publish") {
        return "Publish";
      }

      return "Draft";
    },
  },
};
