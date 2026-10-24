<template>
  <el-drawer
    :title="popTitle"
    :visible.sync="drawerVisible"
    direction="rtl"
    size="500px"
    :show-close="true"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    @close="closeDrawer"
  >
    <!-- 加载中 -->
    <div v-if="loading" class="loading-wrapper">
      <el-skeleton :rows="6" animated />
      <p class="loading-tip">数据加载中，请稍候...</p>
    </div>

    <!-- 数据展示 -->
    <div v-else-if="infoList.length" class="vote-info-list">
      <div class="vote-info" v-for="item in infoList" :key="item.id">
        <!-- type=7：表单标题 -->
        <div class="form-title" v-if="item.type == 7">
          {{ item.answer || '--' }}
        </div>

        <!-- type=3：案例名称 -->
        <div v-else-if="item.type == 3">
          <div class="desc-title">{{ item.title || '--' }}</div>
          <div class="title-div">{{ item.answer || '--' }}</div>
        </div>

        <!-- type=4：案例描述（支持HTML） -->
        <div v-else-if="item.type == 4">
          <div class="desc-title">{{ item.title || '--' }}</div>
          <div class="vote-user-desc" v-html="item.answer || '--'"></div>
        </div>

        <div v-else-if="item.type == 5">
  <div class="desc-title">{{ item.title || '--' }}</div>
  <div v-if="item.answer && item.answer.length" class="img-grid">
    <el-image
      v-for="(img, idx) in item.answer"
      :key="idx"
      :src="img.url"
      :preview-src-list="item.answer.map(i => i.url)"
      fit="cover"
      class="img-item"
    >
      <div slot="error" class="img-error">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
  </div>
  <div v-else class="fallback-text">暂无图片</div>
</div>


        <!-- type=2：多选 -->
        <div v-else-if="item.type == 2">
          <div class="desc-title">{{ item.title || '--' }}</div>
          <div class="vote-user-desc">
            {{ item.answer && item.answer.length ? item.answer.join(',') : '--' }}
          </div>
        </div>

        <!-- type=1：单选 -->
        <div v-else-if="item.type == 1">
          <div class="desc-title">{{ item.title || '--' }}</div>
          <div class="vote-user-desc">
            {{ item.answer || '--' }}
          </div>
        </div>

        <!-- type=6：视频 -->
        <div v-else-if="item.type == 6">
          <div class="desc-title">{{ item.title || '--' }}</div>
          <div v-if="item.answer && item.answer.video && item.answer.video.length" class="vote-video">
            <video muted loop playsinline controls style="width: 100%;">
              <source :src="item.answer.video[0].url" type="video/mp4" />
            </video>
          </div>
          <div v-else class="fallback-text">暂无视频</div>
        </div>
      </div>
    </div>

    <!-- 空数据 -->
    <el-empty v-else description="暂无数据" />
  </el-drawer>
</template>

<script>
export default {
  name: 'TopicDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    infoList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    popTitle: {
      type: String,
      default: '详情',
    },
  },
  computed: {
    drawerVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  methods: {
    closeDrawer() {
      this.$emit('closeDrawer');
    },
  },
};
</script>

<style scoped>
/* ============ 通用标题样式（type 1~6） ============ */
.desc-title {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 0.3rem;
  line-height: 1.4;
}

/* ============ 表单标题（type=7） ============ */
.form-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  text-align: center;
  padding: 0.6rem 0;
  margin-bottom: 0.3rem;
  background: #f5f7fa;
  border-radius: 4px;
}

/* ============ 案例名称 ============ */
.title-div {
  font-size: 16px;
  /* font-weight: bold; */
  text-align: center;
  margin-bottom: 0.2rem;
}

/* ============ 描述文字 ============ */
.vote-user-desc {
  word-break: break-all;
  line-height: 1.5;
  color: #333;
  font-size: 13px;
}

/* ============ 图片轮播 ============ */
.vote-user-imgs {
  margin: 0;
}
.vote-user-imgs img {
  width: 100%;
  display: block;
  border-radius: 4px;
}

/* ============ 视频 ============ */
.vote-video {
  border-radius: 4px;
  overflow: hidden;
}
.vote-video video {
  width: 100%;
  display: block;
}

/* ============ 兜底占位 ============ */
.fallback-img {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #999;
  font-size: 13px;
  border-radius: 4px;
}
.fallback-text {
  padding: 1rem;
  text-align: center;
  color: #999;
  font-size: 13px;
  background: #fafafa;
  border-radius: 4px;
}

/* ============ 加载 ============ */
.loading-wrapper {
  padding: 1rem;
}
.loading-tip {
  text-align: center;
  color: #999;
  font-size: 13px;
  margin-top: 0.8rem;
}

/* ============ 列表 ============ */
.vote-info-list {
  padding: 0 0.75rem;
}
.vote-info {
  margin-bottom: 0.4rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid #f0f0f0;
}
.vote-info:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

/* ============ 图片网格 ============ */
.img-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.img-item {
  width: calc((100% - 16px) / 3);  /* 三列，减去两个 gap */
  height: 90px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #eee;
  box-sizing: border-box;
}

.img-item ::v-deep .el-image__inner {
  transition: transform 0.3s ease;
}

.img-item:hover ::v-deep .el-image__inner {
  transform: scale(1.05);
}

/* ============ 图片加载失败占位 ============ */
.img-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #ccc;
  font-size: 24px;
}

</style>
