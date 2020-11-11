<template>
  <div class="login">
    <div>
      <router-link to="/board">
        Regresar
      </router-link>
    </div>
    <div class="login-header">
      <h3 class="title">Crear Tablón</h3>
    </div>
    <div class="login-body">
      <form action class="form" @submit.prevent="createBoard">
        <div class="form-block">
          <label class="form-label" for="#name">Nombre</label>
          <input
            id="name"
            v-model="name"
            maxlength="4"
            class="form-input"
            type="text"
            required
            placeholder="Nombre del tablón"
          />
        </div>

        <div class="form-block">
          <label class="form-label" for="#desc">Descripción</label>
          <input id="desc" v-model="desc" class="form-input" type="text" required placeholder="Descripción del tablón" />
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
    <div class="login-footer"></div>
  </div>
</template>

<script>
/* eslint-disable no-alert */
import { createBoard } from '@/requests/board';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

const sections = ['ocio', 'regional', 'intereses'];

export default {
  data() {
    return {
      name: '',
      desc: '',
      section: '',
      status: '',
    };
  },
  computed: {
    sections() {
      return sections;
    },
  },
  methods: {
    createBoard() {
      this.status = LOADING;
      const data = {
        name: this.name,
        desc: this.desc,
        section: this.section,
      };
      createBoard(data)
        .then(() => {
          this.status = SUCCESS;
          alert('TABLÓN CREADO');
        })
        .catch(() => {
          this.status = ERROR;
          alert('No se pudo crear el tablón');
        });
    },
  },
};
</script>

<style scoped></style>
