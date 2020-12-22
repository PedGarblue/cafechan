<template>
  <Form return-route="/board" title="Crear Tablón" @form-submit="createBoard">
    <FormBlock name="#name" title="Name">
      <input id="name" v-model="board.name" maxlength="4" class="form-input" type="text" required placeholder="Board name" />
    </FormBlock>

    <FormBlock name="#desc" title="Board description">
      <input id="desc" v-model="board.desc" class="form-input" type="text" required placeholder="Descripción del tablón" />
    </FormBlock>

    <FormBlock name="section" title="Board section">
      <select id="section" v-model="board.section" class="form-input">
        <option v-for="(sectionval, sectionkey) in sections" :key="sectionkey" :value="sectionval">
          {{ sectionval }}
        </option>
      </select>
    </FormBlock>

    <FormBlock name="#filetype" title="Board board filetypes:">
      <select id="filetype" v-model="board.allowedfiletypes" class="form-input" multiple>
        <option v-for="(fileval, filekey) in fileTypes" :key="filekey" :value="filekey">
          {{ fileval }}
        </option>
      </select>
    </FormBlock>

    <FormBlock name="#maxfilesize" title="Max file upload size (Bytes):">
      <input id="maxfilesize" v-model="board.maxfilesize" class="form-input" type="number" />
    </FormBlock>

    <FormBlock name="#postsperpage" title="Max threads per page:">
      <input id="postsperpage" v-model="board.postsperpage" class="form-input" type="number" />
    </FormBlock>

    <FormBlock name="#maxpages" title="Max pages:">
      <input id="maxpages" v-model="board.maxpages" class="form-input" type="number" />
    </FormBlock>

    <FormBlock name="#maxreplies" title="Max bumps per thread:">
      <input id="maxreplies" v-model="board.maxreplies" class="form-input" type="number" />
    </FormBlock>

    <FormBlock name="#locked" title="Close Board: " inline checkbox>
      <input id="locked" v-model="board.locked" class="form-input" type="checkbox" :value="board.locked" />
    </FormBlock>

    <FormBlock name="#nsfw" title="NSFW: " inline checkbox>
      <input id="nsfw" v-model="board.nsfw" class="form-input" type="checkbox" :value="board.nsfw" />
    </FormBlock>

    <FormBlock v-if="board.section === 'regional'" name="#flag" title="Flag: ">
      <input id="flag" v-model="board.flag" class="form-input" type="text" />
      <span v-if="board.flag">
        <img :src="`/assets/countryballs/${board.flag}.png`" alt="Bandera no encontrada" />
      </span>
    </FormBlock>

    <template #footer>
      <div v-if="successRequest" class="form-success">Board Created!</div>
      <div v-else-if="isLoading"><Loading /></div>
      <div v-else-if="hasError" class="form-error">Error: {{ errorMsg }}</div>
    </template>
  </Form>
</template>

<script>
/* eslint-disable no-alert */
import { createBoard } from '@/app/requests/board';
import Loading from '@/app/components/lib/loading';
import Form from '../../lib/form';
import FormBlock from '../../lib/form-block';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

const sections = ['ocio', 'regional', 'intereses'];
const fileTypes = { 'image/png': 'PNG', 'image/jpeg': 'JPG' };

export default {
  components: {
    Form,
    FormBlock,
    Loading,
  },
  data() {
    return {
      board: {
        name: '',
        desc: '',
        section: '',
        allowedfiletypes: [],
        maxfilesize: 10000000,
        locked: false,
        maxpages: 7,
        maxreplies: 200,
        postsperpage: 10,
        nsfw: false,
        flag: '',
      },
      status: '',
      errorMsg: '',
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
    fileTypes() {
      return fileTypes;
    },
  },
  methods: {
    createBoard() {
      this.status = LOADING;
      const data = this.board;
      if (data.section !== 'regional') delete data.flag;
      createBoard(data)
        .then(() => {
          this.status = SUCCESS;
        })
        .catch(err => {
          this.status = ERROR;
          this.errorMsg = err.message;
        });
    },
  },
};
</script>

<style scoped></style>
