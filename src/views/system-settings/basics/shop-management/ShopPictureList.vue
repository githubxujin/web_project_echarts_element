<template>
  <div class="shop-picture-list" v-loading="loading">
    <header class="title">门店图片</header>
    <section class="section">
      <el-upload
        ref="upload"
        :headers="{token:tokenInfo}"
        class="avatar-uploader"
        multiple
        :action="$store.state.base.uploadUrl"
        :on-success="handleAvatarSuccess"
        :show-file-list="false"
        :file-list="pictureList"
        :accept="$common.getMimeTypeList('jpg,png,gif').join(',')"
      >
        <div class="plus-block">
          <i class="el-icon-plus"></i>
        </div>
      </el-upload>
      <div class="picture-list-box">
        <el-scrollbar
          ref="scrollbar"
          tag="div"
          wrap-class="picture-list-wrap"
          view-class="picture-list"
        >
          <div class="back-tip" v-show="!pictureList.length">请上传门店图片</div>
          <viewer :images="images" class="img-viewer">
            <div class="img-cell" v-for="(item, index) in pictureList" :key="index">
              <img height="100%" :src="item.url" alt />
              <div class="handle-bar">
                <el-upload
                  :headers="{token:tokenInfo}"
                  class="exchange-uploader"
                  :action="$store.state.base.uploadUrl"
                  :on-success="handleEditSuccess"
                  :show-file-list="false"
                  :file-list="[item]"
                  :accept="$common.getMimeTypeList('jpg,png,gif').join(',')"
                >
                  <i class="el-icon-sort" title="替换"></i>
                </el-upload>
                <i @click="deleteImage(item)" class="el-icon-delete" title="删除"></i>
              </div>
            </div>
          </viewer>
        </el-scrollbar>
      </div>
    </section>
  </div>
</template>
<script>
import { shopPictureQuery, shopPictureAdd, shopPictureDelete, shopPictureEdit } from '@/services/system-settings.js'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)
export default {
  name: 'shop-picture-list',
  data () {
    return {
      loading: true,
      shopNumber: (this.$store.getters.getUserInfo || {}).shopNumber,
      pictureList: []
    }
  },
  created () {
    this.initData()
  },
  computed: {
    images () {
      let images = JSON.parse(JSON.stringify(this.pictureList)).map(item => {
        return item.url
      })
      return images
    },
    tokenInfo () {
      return this.$store.getters.getTokenInfo
    }
  },
  methods: {
    shopPictureQuery,
    shopPictureAdd,
    shopPictureDelete,
    shopPictureEdit,
    initData () {
      this.loading = true
      const shopNumber = (this.$store.getters.getUserInfo || {}).shopNumber
      this.shopPictureQuery({ shopNumber }).then(res => {
        let pictureList = res.data.array
        pictureList.forEach(item => {
          item.name = item.pictureName
          item.url = item.pictureUrl
        });
        this.pictureList = pictureList
        let _self = this
        setTimeout(function () {
          _self.$refs.scrollbar && _self.$refs.scrollbar.update()
        }, 500)
        this.loading = false
        console.log('门店图片列表:', res.data.array);
      }).catch(_ => {
        this.loading = false
        console.error('获取门店图片列表失败(errorMessage):', _);
      })
    },
    handleAvatarSuccess (res, file) { // 门店图片上传完成
      let data = res.data
      console.log('图片信息：', data)
      let item = [{
        pictureName: data.fileName,
        pictureUrl: data.filePath,
        shopNumber: this.shopNumber
      }]
      // 保存修改后的图片链接，提交时候判断是否有，有则提交picture无则给picture置空
      this.shopPictureAdd(item).then(res => {
        if (res.code !== 200) return Promise.reject('上传失败')
        // 不论新增还是更新删除都要重新获取~
        this.initData()
      }).catch(_ => {
        console.error('新增图片失败(errorMessage):', _);
      })
    },
    handleEditSuccess (res, file, fileList) { // 门店图片上传完成
      let { id, originalUrl, shopNumber } = (fileList[0] || {})
      let data = res.data
      let item = {
        id,
        originalUrl,
        shopNumber,
        pictureName: data.fileName,
        pictureUrl: data.filePath,
      }
      // 保存修改后的图片链接，提交时候判断是否有，有则提交picture无则给picture置空
      this.shopPictureEdit(item).then(res => {
        if (res.code !== 200) return Promise.reject('替换失败')
        // 不论新增还是更新删除都要重新获取~
        this.initData()
      }).catch(_ => {
        console.error('替换图片失败(errorMessage):', _);
      })
    },
    deleteImage (image) { // 删除图片
      this.$confirm('确认删除该门店图片？', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        this.shopPictureDelete(image).then(res => {
          if (res.code !== 200) return Promise.reject('删除失败!')
          this.$message.success('删除门店图片成功！')
          this.initData()
        }).catch(_ => {
          console.error('删除门店图片失败(errorMessage):', _);
          this.$message.error('删除门店图片失败！')
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.shop-picture-list {
  .title {
    padding: 10px 0;
    font-size: 16px;
  }
  .section {
    $size: 200px;
    height: 200px;
    padding: 20px 0;
    box-sizing: initial;
    position: relative;
    .avatar-uploader {
      position: absolute;
      .plus-block {
        width: $size;
        height: $size;
        line-height: $size;
        box-sizing: border-box;
        border: 1px dotted #aaa;
        border-radius: 10px;
        color: rgba(200, 200, 200, 0.5);
        &:hover {
          border-color: #888;
          color: rgba(150, 150, 150, 0.5);
        }
        i {
          font-size: 56px;
          font-weight: 900;
          line-height: unset;
        }
      }
    }
    .picture-list-box {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding-left: 220px;
      /deep/ .el-scrollbar {
        height: 100%;
        /deep/ .is-vertical {
          display: none;
        }
        .picture-list-wrap {
          height: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow-x: auto;
          overflow-y: hidden;
          .picture-list {
            position: relative;
            height: 100%;
            white-space: nowrap;
            .back-tip {
              font-size: 48px;
              position: absolute;
              width: 400px;
              line-height: 70px;
              text-align: center;
              box-sizing: border-box;
              left: calc(50% - 200px);
              top: calc(50% - 35px);
              color: #ddd;
            }
            .img-viewer {
              height: 100%;
              .img-cell {
                display: inline-block;
                height: 100%;
                position: relative;
                margin-left: 20px;
                &:first-child {
                  margin-left: 0;
                }
                img {
                  cursor: pointer;
                }
                .handle-bar {
                  position: absolute;
                  left: 0;
                  bottom: 0;
                  width: 100%;
                  line-height: 40px;
                  height: 0;
                  transition: height 0.1s ease-out;
                  text-align: center;
                  background: rgba(0, 0, 0, 0.2);
                  cursor: pointer;
                  .exchange-uploader {
                    display: inline-block;
                    line-height: normal;
                  }
                  i {
                    display: inline-block;
                    font-size: 18px;
                    color: white;
                    padding: 0 10px;
                    vertical-align: middle;
                    &:hover {
                      color: rgba(25, 130, 191, 0.8);
                    }
                    &.el-icon-delete:hover {
                      color: red;
                    }
                  }
                }
                &:hover {
                  .handle-bar {
                    height: 40px;
                  }
                }
              }
            }
          }
        }
      }
      /deep/ .el-scrollbar__bar.is-horizontal {
        height: 0px;
        .el-scrollbar__thumb {
          background: rgba(144, 147, 153, 0.6);
        }
      }
    }
  }
}
</style>
