<template>
  <Form return-route="/board" title="Edit Board" @form-submit="editBoard">
    <FormBlock name="#name" title="Board Name:">
      <input id="name" v-model="board.name" class="form-input" type="text" placeholder="Nombre" />
    </FormBlock>

    <FormBlock name="#desc" title="Board description:">
      <input id="desc" v-model="board.desc" class="form-input" type="text" placeholder="Descripción" />
    </FormBlock>

    <FormBlock name="#section" title="Board section:">
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

    <FormBlock v-if="board.section === 'regional'" ref="flag-input" name="#flag" title="Flag: ">
      <input id="flag" v-model="board.flag" class="form-input" type="text" />
      <span v-if="board.flag">
        <img :src="`/assets/countryballs/${board.flag}.png`" alt="Bandera no encontrada" />
      </span>
    </FormBlock>

    <template #footer>
      <div v-if="isLoading"><Loading /></div>
      <div v-else-if="successEdit" class="form-success">Board edited!</div>
      <div v-else-if="hasError" class="form-error">ERROR: {{ errorMsg }}</div>
    </template>
  </Form>
</template>

<script>
import { mapGetters } from 'vuex';

import { editBoard, getBoard } from '@/app/requests/board';
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
      id: this.$route.params.boardId,
      board: {
        name: '',
        desc: '',
        section: '',
        allowedfiletypes: [],
        maxfilesize: 0,
        locked: false,
        maxpages: 0,
        maxreplies: 0,
        postsperpage: 0,
        nsfw: false,
        flag: '',
      },
      errorMsg: '',
      successEdit: false,
      status: '',
    };
  },
  computed: {
    ...mapGetters(['accessToken']),
    sections() {
      return sections;
    },
    fileTypes() {
      return fileTypes;
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
    async getBoard() {
      this.status = LOADING;
      return getBoard(this.accessToken.token, { id: this.id })
        .then(resp => {
          const {
            name,
            desc,
            section,
            allowedfiletypes,
            maxfilesize,
            locked,
            maxpages,
            maxreplies,
            postsperpage,
            nsfw,
            flag,
          } = resp;
          this.board.name = name;
          this.board.desc = desc;
          this.board.section = section;
          this.board.maxfilesize = maxfilesize;
          this.board.allowedfiletypes = allowedfiletypes;
          this.board.locked = locked;
          this.board.maxpages = maxpages;
          this.board.maxreplies = maxreplies;
          this.board.postsperpage = postsperpage;
          this.board.nsfw = nsfw;
          this.board.flag = flag;

          this.status = SUCCESS;
        })
        .catch(err => {
          this.errorMsg = err.message;
          this.status = ERROR;
        });
    },
    async editBoard() {
      this.status = LOADING;
      const data = this.board;
      return editBoard(this.accessToken.token, this.id, data)
        .then(() => {
          this.successEdit = true;
          this.status = SUCCESS;
        })
        .catch(err => {
          this.errorMsg = err.message;
          this.status = ERROR;
        });
    },
  },
};
</script>

<style scoped>
#filetype {
  height: 4em;
}
</style>
