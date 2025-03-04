<template>
  <div id="slideVerify" class="slide-verify" onselectstart="return false;">
    <canvas :width="props.w" :height="props.h" ref="canvasRef" />
    <div v-if="show" class="slide-verify-refresh-icon" :style="{ backgroundImage: `url(${icoImg})` }"
      @click="refresh" />
    <canvas ref="blockRef" :width="props.w" :height="props.h" class="slide-verify-block" />
    <div class="slide-verify-slider" :class="{
      'container-active': containerActive,
      'container-success': containerSuccess,
      'container-fail': containerFail
    }">
      <div class="slide-verify-slider-mask" :style="{ width: sliderMaskWidth }">
        <div @mousedown="sliderDown" @touchstart="touchStartEvent" @touchmove="touchMoveEvent" @touchend="touchEndEvent"
          class="slide-verify-slider-mask-item" :style="{ left: sliderLeft }">
          <div class="slide-verify-slider-mask-item-icon" :style="{ backgroundImage: `url(${icoImg})` }" />
        </div>
      </div>
      <span class="slide-verify-slider-text">{{ props.sliderText }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { random } from 'lodash-es'

import icoImg from '@/assets/images/imgValid/icon_light.png'

const PI = Math.PI

const sum = (x: number, y: number): number => x + y

const square = (x: number): number => x * x

defineOptions({
  name: 'SlideVerify'
})

interface Props {
  l: number
  r: number
  w: number
  h: number
  left: number
  sliderText: string
  accuracy: number
  show: boolean
  imgs: string[]
}
const props = withDefaults(defineProps<Props>(), {
  l: 42,
  r: 10,
  w: 310,
  h: 155,
  left: 200,
  sliderText: 'Slide filled right',
  accuracy: 5,
  show: true,
  imgs: () => []
})

interface Emits {
  (e: 'refresh'): void
  (e: 'success'): void
  (e: 'fail'): void
  (e: 'again'): void
  (e: 'fulfilled'): void
}

const emit = defineEmits<Emits>()

let containerActive = false // container active class
let containerSuccess = false // container success class
let containerFail = false // container fail class
let canvasCtx: any = null
let blockCtx: any = null
const canvasRef = ref<HTMLCanvasElement>()
const blockRef = ref()
let block_x: any = undefined // container random position
let block_y: any = undefined
const L = props.l + props.r * 2 + 3 // block real length
let img: any = undefined
let originX: any = undefined
let originY: any = undefined
let isMouseDown = false
const trail: Array<any> = []
const sliderLeft = ref('0px') // block right offset
let sliderMaskWidth = '0px' // mask width

onMounted(() => {
  init()
})

function init() {
  initDom()
  initImg()
  bindEvents()
}

function initDom() {
  canvasCtx = (canvasRef.value as HTMLCanvasElement).getContext('2d')
  blockCtx = blockRef.value.getContext('2d')
}

function initImg() {
  img = createImg(() => {
    drawBlock()
    canvasCtx.drawImage(img, 0, 0, props.w, props.h)
    blockCtx.drawImage(img, 0, 0, props.w, props.h)

    // const { block_x: x, block_y: y, r, L } = this
    const _y = block_y - props.r * 2 - 1
    const ImageData = blockCtx.getImageData(block_x, _y, L, L)
    blockRef.value.width = L
    blockCtx.putImageData(ImageData, 0, _y)
  })
}

function drawBlock() {
  // block_x = random(L + 10, w - (L + 10))
  block_x = props.left
  block_y = random(10 + props.r * 2, props.h - (L + 10))
  draw(canvasCtx, block_x, block_y, 'fill')
  draw(blockCtx, block_x, block_y, 'clip')
}

function draw(ctx: any, x: number, y: number, operation: string) {
  const { l, r } = props
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
  ctx.lineTo(x + l, y)
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
  ctx.lineTo(x + l, y + l)
  ctx.lineTo(x, y + l)
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
  ctx.lineTo(x, y)
  ctx.lineWidth = 2
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.stroke()
  ctx[operation]()
  ctx.globalCompositeOperation = 'overlay'
}

function createImg(onload: any) {
  const imgDom = document.createElement('img')
  imgDom.crossOrigin = 'Anonymous'
  imgDom.onload = onload
  imgDom.onerror = () => {
    imgDom.src = getRandomImg()
  }
  imgDom.src = getRandomImg()

  return imgDom
}

// 随机生成img src
function getRandomImg(): string {
  // return require('../assets/img.jpg')
  const len = props.imgs.length
  return props.imgs[random(0, len)] as string || ''
}

function refresh() {
  emit('refresh')
  reset()
}

function sliderDown(event: MouseEvent) {
  originX = event.clientX
  originY = event.clientY
  isMouseDown = true
}

function touchStartEvent(e: TouchEvent) {
  originX = e.changedTouches[0].pageX
  originY = e.changedTouches[0].pageY
  isMouseDown = true
}

function bindEvents() {
  document.addEventListener('mousemove', (e) => {
    if (!isMouseDown) {
      return false
    }

    const moveX = e.clientX - originX
    const moveY = e.clientY - originY

    if (moveX < 0 || moveX + 38 >= props.w) {
      return false
    }

    sliderLeft.value = moveX + 'px'
    const blockLeft = (props.w - 40 - 20) / (props.w - 40) * moveX
    blockRef.value.style.left = blockLeft + 'px'

    containerActive = true // add active
    sliderMaskWidth = moveX + 'px'
    trail.push(moveY)
  })
  document.addEventListener('mouseup', (e: MouseEvent) => {
    if (!isMouseDown) {
      return false
    }

    isMouseDown = false

    if (e.clientX === originX) {
      return false
    }

    containerActive = false // remove active

    const { spliced } = verify()

    if (spliced) {
      if (props.accuracy === -1) {
        containerSuccess = true
        emit('success')
        return
      }
      // if (TuringTest) {
      containerSuccess = true
      emit('success')
      // } else {
      //   containerFail = true
      //   emit('again')
      // }
    } else {
      containerFail = true
      emit('fail')
      setTimeout(() => {
        reset()
      }, 1000)
    }
  })
}

function touchMoveEvent(e: TouchEvent) {
  if (!isMouseDown) {
    return false
  }

  const moveX = e.changedTouches[0].pageX - originX
  const moveY = e.changedTouches[0].pageY - originY

  if (moveX < 0 || moveX + 38 >= props.w) {
    return false
  }

  sliderLeft.value = moveX + 'px'
  const blockLeft = (props.w - 40 - 20) / (props.w - 40) * moveX
  blockRef.value.style.left = blockLeft + 'px'

  containerActive = true
  sliderMaskWidth = moveX + 'px'
  trail.push(moveY)
}

function touchEndEvent(e: TouchEvent) {
  if (!isMouseDown) {
    return false
  }

  isMouseDown = false

  if (e.changedTouches[0].pageX === originX) {
    return false
  }

  containerActive = false

  const { spliced, TuringTest } = verify()

  if (spliced) {
    if (props.accuracy === -1) {
      containerSuccess = true
      emit('success')
      return
    }
    if (TuringTest) {
      // succ
      containerSuccess = true
      emit('success')
    } else {
      containerFail = true
      emit('again')
    }
  } else {
    containerFail = true
    emit('fail')
    setTimeout(() => {
      reset()
    }, 1000)
  }
}

function verify() {
  const arr = trail // drag y move distance
  const average = arr.reduce(sum) / arr.length // average
  const deviations = arr.map((x: number) => x - average) // deviation array
  const stdDev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length) // standard deviation
  const left = parseInt(blockRef.value.style.left)
  const accuracy = props.accuracy <= 1
    ? 1
    : props.accuracy > 10
      ? 10
      : props.accuracy

  return {
    spliced: Math.abs(left - block_x) <= accuracy,
    TuringTest: average !== stdDev // equal => not person operate
  }
}

function reset() {
  containerActive = false
  containerSuccess = false
  containerFail = false
  sliderLeft.value = '0px'
  blockRef.value.style.left = 0
  sliderMaskWidth = '0px'
  // canvas
  const { w, h } = props
  canvasCtx.clearRect(0, 0, w, h)
  blockCtx.clearRect(0, 0, w, h)
  blockRef.value.width = w

  // generate img
  img.src = getRandomImg()
  emit('fulfilled')
}

</script>

<style lang="scss" scoped>
.slide-verify {
  position: relative;
  width: 310px;

  .slide-verify-refresh-icon {
    position: absolute;
    right: 0;
    top: 0;
    width: 34px;
    height: 34px;
    cursor: pointer;
    background-position: 0 -437px;
    background-size: 34px 471px;
  }

  .slide-verify-block {
    position: absolute;
    left: 0;
    top: 0;
  }

  .slide-verify-slider {
    position: relative;
    text-align: center;
    width: 310px;
    height: 40px;
    line-height: 40px;
    margin-top: 15px;
    background: #f7f9fa;
    color: #45494c;
    border: 1px solid #e4e7eb;

    .slide-verify-slider-mask {
      position: absolute;
      left: 0;
      top: 0;
      height: 40px;
      border: 0 solid #07c1ac;
      background: #D1E9FE;

      .slide-verify-slider-mask-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 38px;
        background: #fff;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
        cursor: move;
        transition: background .2s linear;

        &:hover {
          background: #07c1ac;

          .slide-verify-slider-mask-item-icon {
            background-position: 0 -13px;
          }
        }

        .slide-verify-slider-mask-item-icon {
          position: absolute;
          top: 15px;
          left: 13px;
          width: 14px;
          height: 12px;
          background-position: 0 -26px;
          background-size: 34px 471px;
        }
      }
    }

    &.container-active {
      .slide-verify-slider-mask {
        height: 38px;
        border-width: 1px;

        .slide-verify-slider-mask-item {
          height: 38px;
          top: -1px;
          border: 1px solid #07c1ac;
        }
      }

      &.container-success {
        .slide-verify-slider-mask {
          .slide-verify-slider-mask-item {
            height: 38px;
            top: -1px;
            border: 1px solid #52CCBA;
            background-color: #52CCBA !important;
          }
        }
      }
    }

    &.container-success {
      .slide-verify-slider-mask {
        height: 38px;
        border: 1px solid #52CCBA;
        background-color: #D2F4EF;

        .slide-verify-slider-mask-item {
          .slide-verify-slider-mask-item-icon {
            background-position: 0 0 !important;
          }
        }
      }
    }

    &.container-fail {
      .slide-verify-slider-mask {
        height: 38px;
        border: 1px solid #f57a7a;
        background-color: #fce1e1;

        .slide-verify-slider-mask-item {
          height: 38px;
          top: -1px;
          border: 1px solid #f57a7a;
          background-color: #f57a7a !important;

          .slide-verify-slider-mask-item-icon {
            top: 14px;
            background-position: 0 -82px !important;
          }
        }
      }
    }

    &.container-active,
    &.container-success,
    &.container-fail {
      .slide-verify-slider-text {
        display: none;
      }
    }
  }
}
</style>
