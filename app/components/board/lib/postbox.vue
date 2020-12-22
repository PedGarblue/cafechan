<template>
  <form @submit.prevent="sendPost">
    <table class="postform">
      <tbody>
        <tr>
          <td v-if="!replyPosting" class="postblock">Título</td>
          <td v-else></td>
          <td>
            <input v-if="!replyPosting" v-model="post.title" type="text" name="title" class="title" />
            <input class="enviar" type="submit" :value="isLoading ? '...' : 'Enviar'" />
          </td>
        </tr>
        <tr>
          <td class="postblock">Post</td>
          <td>
            <textarea v-model="post.message" cols="46" rows="9"></textarea>
          </td>
        </tr>
        <tr>
          <td class="postblock">Archivo</td>
          <td>
            <input ref="postfile" type="file" name="postfile" @change="handleFileUpload" />
          </td>
        </tr>
        <tr>
          <td v-if="hasError" colspan="2" class="postblock">
            {{ errorMsg }}
          </td>
          <td v-if="succesfulRequest" colspan="2" class="postblock">
            Post enviado correctamente.
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <div class="upload-info">
              <span>Tipos de archivo: {{ filetypes }}.</span>
              <span>Tamaño máximo: {{ maxfilesize }}.</span>
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
        return type === 'Thread' || type === 'Reply';
      },
    },
    boardid: {
      type: String,
      default() {
        return '';
      },
    },
    threadid: {
      type: String,
      default() {
        return '';
      },
    },
    maxfilesize: {
      type: String,
      default() {
        return '10 MB';
      },
    },
    allowedfiletypes: {
      type: Array,
      default() {
        return [];
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
      return this.allowedfiletypes.join(', ');
    },
    replyPosting() {
      return this.type === 'Reply';
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
    sendPost() {
      this.status = LOADING;
      let request = sendPost(this.boardid);

      if (this.type === 'Thread') {
        request = request.thread(this.post);
      } else {
        request = request.reply(this.threadid, this.post);
      }
      request
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
.postblock {
  background: var(--primary-light-color);
  text-align: center;
  color: var(--text-color);
  padding: 5px;
  font-weight: bold;
}
.enviar {
  border: none;
  border-radius: 3px;
  font-size: 13px;
  color: var(--text-color);
  font-weight: bold;
  padding: 3px 9px;
  background-color: var(--primary-light-color);
  cursor: pointer;
  margin-left: 10px;
  padding: 9px 10px 9px 10px;
  float: right;
}
.enviar:hover {
  background-color: var(--primary-lighter-color);
}
input[type='text'],
textarea {
  border: 1px solid #b3917b;
  border-radius: 3px;
  background-color: #ffffff;
}
.title {
  padding: 0.6em 0.1em;
}
.upload-info {
  text-align: center;
  font-size: 0.9em;
}
</style>
