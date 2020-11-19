<template>
  <Form return-route="/board" title="Crear Tablón" @form-submit="createBoard">
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
    <template #footer>
      <div v-if="successRequest">Board Created!</div>
      <div v-else-if="isLoading"><Loading /></div>
      <div v-else-if="hasError">Error: {{ errorMsg }}</div>
    </template>
  </Form>
</template>

<script>
/* eslint-disable no-alert */
import { createBoard } from '@/requests/board';
import Form from '@/components/lib/form';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

const sections = ['ocio', 'regional', 'intereses'];

export default {
  components: {
    Form,
  },
  data() {
    return {
      name: '',
      desc: '',
      section: '',
      status: '',
    };
  },
  computed: {
    isLoading() {
      return this.status === LOADING;
    },
    hasError() {
      return this.status === ERROR;
    },
    successRequest() {
      return this.status === SUCCESS;
    },
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
        })
        .catch(() => {
          this.status = ERROR;
        });
    },
  },
};
</script>

<style scoped></style>
