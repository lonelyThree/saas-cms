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
        return 'vue-tinymce-' + this._uid
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
          const editor = window.tinymce && window.tinymce.get && window.tinymce.get(this.tinymceId)
          if (editor) editor.setContent(val || '')
        })
      }
    },
  },
  mounted() {
    // let env = config.ENV
    // this.imgBase = config.pathUrl([env]).baseImgUrl
    this.init()
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
        images_upload_handler(blobInfo, success, failure) {
          const file = blobInfo.blob()
          if (file.size > 2 * 1024 * 1024) {
            _this.$message.warning('上传图片大小不能超过 2M')
            failure('上传图片大小不能超过 2M')
            return
          }
          _this.uploadImageToOss(file).then(success).catch(err => {
            _this.$message.error(err && err.message ? err.message : '图片上传失败')
            failure(err && err.message ? err.message : '图片上传失败')
          })
        },
      })
    },
    uploadImageToOss(file) {
      return this.$http.uploadImage(file)
    },
    destroyTinymce() {
      if (!window.tinymce || !window.tinymce.get) return
      const tinymce = window.tinymce.get(this.tinymceId)
      if (!tinymce) return
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }
      tinymce.destroy()
    },
    setContent(value) {
      if (!window.tinymce || !window.tinymce.get(this.tinymceId)) return
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      const editor = window.tinymce && window.tinymce.get && window.tinymce.get(this.tinymceId)
      return editor ? editor.getContent() : ''
    },
    imageSuccessCBK(arr) {
      const editor = window.tinymce && window.tinymce.get && window.tinymce.get(this.tinymceId)
      if (!editor) return
      arr.forEach(v => {
        let url = String(v.url || '')
        try {
          const parsed = new URL(url, window.location.origin)
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return
          url = parsed.href.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
        } catch (e) {
          return
        }
        editor.insertContent(`<img class="wscnph" src="${url}" >`)
      })
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
