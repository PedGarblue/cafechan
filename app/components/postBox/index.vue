<template>
  <div>
    <form @submit.prevent="sendPost">
      <table class="postform">
        <tbody>
          <tr>
            <td v-if="!replyPosting" class="postblock">Título</td>
            <td v-else></td>
            <td>
              <input v-if="!replyPosting" v-model="title" type="text" name="title" />
              <input class="enviar" type="submit" :value="isLoading ? '...' : 'Enviar'" />
            </td>
          </tr>
          <tr>
            <td class="postblock">Post</td>
            <td>
              <textarea v-model="message" cols="46" rows="9"></textarea>
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
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
import { sendPost } from '@/requests/post';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  props: {
    postType: {
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
    boardname: {
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
    threadseqid: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      title: '',
      message: '',
      errorMsg: '',
      status: '',
    };
  },
  computed: {
    replyPosting() {
      return this.threadid.length > 0 && this.threadseqid.length > 0;
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
    sendPost() {
      this.status = LOADING;
      let request = sendPost(this.boardname, this.boardid);

      if (this.postType === 'Thread') {
        request = request.thread(this.title, this.message);
      } else {
        request = request.reply(this.threadid, this.threadseqid, this.message);
      }
      request
        .then(() => {
          this.status = SUCCESS;
          setTimeout(() => {
            // eslint-disable-next-line no-restricted-globals
            location.reload();
          }, 1000);
        })
        .catch(err => {
          this.status = ERROR;
          this.errorMsg = err.message;
        });
    },
  },
};
</script>
