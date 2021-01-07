<template>
  <form :class="{ 'block-floating': isQuickReply }" @submit.prevent="sendPost">
    <table class="postform">
      <tbody>
        <tr v-if="isQuickReply">
          <td colspan="2">
            <button class="close-button button button--right" @click="closeQuickReply">X</button>
          </td>
        </tr>
        <tr v-if="isQuickReply" class="header">
          <td class="block" colspan="2">
            {{ `Respondiendo al hilo ${thread.seq_id} de /${board.name}/` }}
          </td>
        </tr>
        <tr>
          <td v-if="!replyPosting" class="block">Título</td>
          <td v-else></td>
          <td>
            <input v-if="!replyPosting" v-model="post.title" type="text" name="title" class="input__title" />
            <input
              class="input__submit button button--right button--medium"
              type="submit"
              :value="isLoading ? '...' : 'Enviar'"
            />
          </td>
        </tr>
        <tr>
          <td class="block">Post</td>
          <td>
            <textarea v-model="post.message" class="input__message" rows="9"></textarea>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <input ref="postfile" type="file" class="input__file" name="postfile" @change="handleFileUpload" />
          </td>
        </tr>
        <tr>
          <td v-if="hasError" colspan="2" class="block">
            {{ errorMsg }}
          </td>
          <td v-if="succesfulRequest" colspan="2" class="block">
            Post enviado correctamente.
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <div class="upload-info">
              <span>Tipos de archivo: {{ filetypes }}.</span>
              <span>Tamaño máximo: {{ board.max_file_size }}.</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
</template>

<script>
import { sendPost } from '@/app/requests/post';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  props: {
    type: {
      type: String,
      default() {
        return 'Thread';
      },
      validator(type) {
        return ['Thread', 'Reply', 'QuickReply'].indexOf(type) !== -1;
      },
    },
    board: {
      type: Object,
      required: true,
    },
    thread: {
      type: Object,
      default() {
        if (this.type !== 'Reply') return {};
        throw new Error('"thread" is required for post reply');
      },
    },
  },
  data() {
    return {
      post: {
        title: '',
        message: '',
        file: '',
      },
      errorMsg: '',
      status: '',
    };
  },
  computed: {
    filetypes() {
      return this.board.allowed_filetypes.join(', ');
    },
    threadPosting() {
      return this.type === 'Thread';
    },
    replyPosting() {
      return ['Reply', 'QuickReply'].indexOf(this.type) !== -1;
    },
    isQuickReply() {
      return this.type === 'QuickReply';
    },
    isLoading() {
      return this.status === LOADING;
    },
    succesfulRequest() {
      return this.status === SUCCESS;
    },
    hasError() {
      return this.status === ERROR;
    },
  },
  methods: {
    clean() {
      this.post.title = '';
      this.post.message = '';
      this.post.file = '';
    },
    handleFileUpload() {
      const [file] = this.$refs.postfile.files;
      this.post.file = file;
    },
    closeQuickReply() {
      this.$emit('close-quick-reply');
    },
    async sendPost() {
      this.status = LOADING;
      let request = sendPost(this.board.id);

      if (this.type === 'Thread') {
        request = request.thread(this.post);
      } else {
        request = request.reply(this.thread.id, this.post);
      }
      return request
        .then(() => {
          this.status = SUCCESS;
          this.clean();
          this.$emit('posted');
        })
        .catch(err => {
          this.status = ERROR;
          this.errorMsg = err.message;
        });
    },
  },
};
</script>

<style scoped>
table {
  margin: 1rem auto;
}
.button {
  border: none;
  font-size: 13px;
  color: var(--text-color);
  font-weight: bold;
  background-color: var(--primary-light-color);
  cursor: pointer;
}
.button--right {
  float: right;
  margin-left: auto;
}
.button--medium {
  padding: 0.7em 0.8em;
}
.button:hover {
  background-color: var(--primary-lighter-color);
}
.block-floating {
  position: fixed;
  left: 51%;
  background-color: #7d715a;
  border: solid 1px var(--primary-lighter-color);
}
.block-floating table {
  margin: 0 auto;
}
.block {
  background: var(--primary-light-color);
  text-align: center;
  color: var(--text-color);
  padding: 5px;
  font-weight: bold;
}
.close-button {
  float: right;
}
.input__submit {
}
.input__title,
.input__message {
  border: 1px solid #b3917b;
  border-radius: 3px;
  background-color: #ffffff;
}
.input__message {
  width: 99%;
}
.input__title {
  padding: 0.6em 0.1em;
}
.input__file {
  width: 100%;
}
.upload-info {
  text-align: center;
  font-size: 0.9em;
}

@media screen and (max-width: 720px) {
  .block-floating {
    left: auto;
  }
}
</style>
