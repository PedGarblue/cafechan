<template>
  <Form return-route="/board" title="Edit Board" @form-submit="editBoard">
    <FormBlock name="#name" title="Board Name">
      <input id="name" v-model="name" class="form-input" type="text" placeholder="Nombre" />
    </FormBlock>

    <FormBlock name="#desc" title="Board description">
      <input id="desc" v-model="desc" class="form-input" type="text" placeholder="Descripción" />
    </FormBlock>

    <FormBlock name="#section" title="Board section">
      <select id="section" v-model="section" class="form-input">
        <option v-for="(sectionval, sectionkey) in sections" :key="sectionkey" :value="sectionval">
          {{ sectionval }}
        </option>
      </select>
    </FormBlock>
    <template #footer>
      <div v-if="isLoading"><Loading /></div>
      <div v-else-if="boardEditSuccess" class="form-success">¡TABLON EDITADO CORRECTAMENTE!</div>
      <div v-else-if="hasError" class="form-error">ERROR: {{ errorMsg }}</div>
    </template>
  </Form>
</template>

<script>
import { editBoard, getBoard } from '@/requests/board';
import Form from '@/components/lib/form';
import FormBlock from '@/components/lib/form-block';
import Loading from '@/components/lib/loading';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

const sections = ['ocio', 'regional', 'intereses'];

export default {
  components: {
    Form,
    FormBlock,
    Loading,
  },
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
          this.errorMsg = err.message;

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
          this.errorMsg = err.message;
          this.status = ERROR;
        });
    },
  },
};
</script>
