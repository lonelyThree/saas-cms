<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <!-- <div class="editor-custom-btn-container">
      <editorImage
        color="#1890ff"
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
      />
    </div> -->
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
// import upload from "@/mixins/upload2";
// import config from '@/config/api.js'
// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN =
  'https://lib.baomitu.com/tinymce/4.9.3/tinymce.min.js'

export default {
  // mixins: [upload],
  name: 'Tinymce',
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: function() {
        // return (
        //   'vue-tinymce-' +
        //   +new Date() +
        //   ((Math.random() * 1000).toFixed(0) + '')
        // )
        return 'tinymc-cms-pharmacy-enterprise'
      },
    },
    value: {
      type: String,
      default: '',
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    menubar: {
      type: String,
      // default: 'file edit insert view format table'
      default: '',
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360,
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto',
    },
    tinyHasChange: { type: Boolean, default: false },
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        en: 'en',
        zh: 'zh_CN',
        es: 'es_MX',
        ja: 'ja',
      },
      imgBase: '',
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    },
  },
  watch: {
    value(val) {
      // console.log(val)
      // console.log(this.hasChange, this.hasInit)
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => {
          // console.log('nexttick')
          window.tinymce.get(this.tinymceId).setContent(val || '')
        })
      }
    },
  },
  mounted() {
    // let env = config.ENV
    // this.imgBase = config.pathUrl([env]).baseImgUrl
    this.init()
  },
  created() {
    console.log('created')
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // console.log('init')
      // dynamic load tinymce from cdn
      load(tinymceCDN, err => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      // console.log('init tinymce')
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language_url: 'https://vipimg.ai-xbys.com/base/js/tinymce-zh_CN.js',
        language: this.languageTypeList['zh'],
        height: this.height,
        branding: false,
        body_class: 'panel-body',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        // imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        // default_link_target: "_blank",
        // link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', e => {
            _this.fullscreen = e.state
          })
        },
        // it will try to keep these URLs intact
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        // convert_urls: false,
        // 整合七牛上传
        // images_dataimg_filter(img) {
        //   setTimeout(() => {
        //     const $image = $(img);
        //     $image.removeAttr('width');
        //     $image.removeAttr('height');
        //     if ($image[0].height && $image[0].width) {
        //       $image.attr('data-wscntype', 'image');
        //       $image.attr('data-wscnh', $image[0].height);
        //       $image.attr('data-wscnw', $image[0].width);
        //       $image.addClass('wscnph');
        //     }
        //   }, 0);
        //   return img
        // },
        images_upload_handler(blobInfo, success, failure, progress) {
          console.log('images upload handler')
          console.log(blobInfo.blob())
          const isLt2M = blobInfo.blob().size / 1024 / 1024 < 2
          if (!isLt2M) {
            this.$message({
              message: '上传图片大小不能超过 2M!',
              type: 'warning',
            })
            return false
          } else {
            var formData = new FormData()
            formData.append('file', blobInfo.blob())
            formData.append('type', 9)
            _this.$http.post(API.upload, formData).then(res => {
              const { status, url } = res
              if (status && status == 200) {
                success(url)
              } else {
                this.$message.error(res.msg)
              }
            })
          }

          // progress(0);
          // const token = _this.$store.getters.token;
          // getToken(token).then(response => {
          //   const url = response.data.qiniu_url;
          //   const formData = new FormData();
          //   formData.append('token', response.data.qiniu_token);
          //   formData.append('key', response.data.qiniu_key);
          //   formData.append('file', blobInfo.blob(), url);

          //   // upload(formData).then(() => {
          //   //   success(url);
          //   //   progress(100);
          //   // })
          // }).catch(err => {
          //   failure('出现未知问题，刷新页面，或者联系程序员')
          //   console.log(err);
          // });
        },
      })
    },
    destroyTinymce() {
      console.log('destroy')
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      console.log(value)
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      arr.forEach(v =>
        window.tinymce
          .get(this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v.url}" >`)
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
