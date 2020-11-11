<template>
  <div class="login">
    <div>
      <router-link to="/board">
        Regresar
      </router-link>
    </div>

    <div class="login-header">
      <h3 class="title">Editar tablón: {{ isLoaded ? desc : '[...]' }}</h3>
    </div>

    <div class="login-body">
      <form v-if="isLoaded" action class="form" @submit.prevent="editBoard">
        <div class="form-block">
          <label class="form-label" for="#name">Nombre</label>
          <input id="name" v-model="name" class="form-input" type="text" placeholder="Nombre" />
        </div>

        <div class="form-block">
          <label class="form-label" for="#desc">Descripción</label>
          <input id="desc" v-model="desc" class="form-input" type="text" placeholder="Descripción" />
        </div>

        <div class="form-block">
          <label class="form-label" for="#section">Sección</label>
          <select id="section" v-model="section" class="form-input">
            <option v-for="(sectionval, sectionkey) in sections" :key="sectionkey" :value="sectionval">
              {{ sectionval }}
            </option>
          </select>
        </div>

        <input class="form-submit" type="submit" value="Crear" />
      </form>
    </div>
    <div class="login-footer">
      <div v-if="isLoading">
        [...]
      </div>
      <div v-else-if="boardEditSuccess">
        ¡TABLON EDITADO CORRECTAMENTE!
      </div>
      <div v-else-if="hasError">ERROR: {{ errorMsg }}</div>
    </div>
  </div>
</template>

<script>
import { editBoard, getBoard } from '@/requests/board';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

const sections = ['ocio', 'regional', 'intereses'];

export default {
  data() {
    return {
      id: this.$route.params.boardId,
      name: '',
      desc: '',
      section: '',
      errorMsg: '',
      successEdit: false,
      status: '',
    };
  },
  computed: {
    sections() {
      return sections;
    },
    boardEditSuccess() {
      return this.boardStatus === 'success' && this.successEdit;
    },
    isLoading() {
      return this.status === LOADING;
    },
    isLoaded() {
      return this.status === SUCCESS;
    },
    hasError() {
      return this.status === ERROR;
    },
  },
  mounted() {
    this.getBoard();
  },
  methods: {
    getBoard() {
      this.status = LOADING;
      getBoard({ id: this.id })
        .then(resp => {
          const { name, desc, section } = resp;
          this.name = name;
          this.desc = desc;
          this.section = section;

          this.status = SUCCESS;
        })
        .catch(err => {
          this.errorMsg = err.data.message || err;

          this.status = ERROR;
        });
    },
    editBoard() {
      this.status = LOADING;

      const data = {
        id: this.id,
        name: this.name,
        desc: this.desc,
        section: this.section,
      };
      editBoard(data)
        .then(() => {
          this.successEdit = true;
          this.status = SUCCESS;
        })
        .catch(err => {
          this.errorMsg = err.data.message || err;
          this.status = ERROR;
        });
    },
  },
};
</script>
