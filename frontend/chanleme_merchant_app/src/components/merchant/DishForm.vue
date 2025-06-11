<template>
  <form @submit.prevent="submitForm" class="dish-form">
    <div class="form-group">
      <label for="dishName">菜品名称:</label>
      <input type="text" id="dishName" v-model="dishForm.name" required />
    </div>
    <div class="form-group">
      <label for="dishDescription">菜品描述:</label>
      <textarea id="dishDescription" v-model="dishForm.description"></textarea>
    </div>
    <div class="form-group">
      <label for="dishPrice">价格:</label>
      <input type="number" id="dishPrice" v-model.number="dishForm.price" step="0.01" min="0" required />
    </div>
    <div class="form-group">
      <label for="dishImageUrl">图片 URL:</label>
      <input type="text" id="dishImageUrl" v-model="dishForm.image_url" />
    </div>
    <div class="form-group checkbox-group">
      <input type="checkbox" id="isAvailable" v-model="dishForm.is_available" />
      <label for="isAvailable">是否上架</label>
    </div>

    <p v-if="formError" class="error-message">{{ formError }}</p>

    <div class="button-group">
      <button type="submit" :disabled="submitting">
        {{ submitting ? '提交中...' : '保存' }}
      </button>
      <button type="button" @click="cancelForm" class="cancel-button">取消</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

interface Dish {
  id?: string; // id 可能在新增时不存在
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  // ... 其他菜品字段
}

const props = defineProps<{
  initialDish: Dish | null;
}>();

const emit = defineEmits(['submit', 'cancel']);

const dishForm = ref<Dish>({
  name: '',
  description: '',
  price: 0,
  image_url: '',
  is_available: true,
});

const submitting = ref(false);
const formError = ref<string | null>(null);

// 监听 initialDish 的变化，用于编辑时初始化表单
watch(() => props.initialDish, (newVal) => {
  if (newVal) {
    // 复制所有属性，包括 id，因为在提交时可能需要
    dishForm.value = { ...newVal };
  } else {
    // 重置表单为默认值
    dishForm.value = {
      name: '',
      description: '',
      price: 0,
      image_url: '',
      is_available: true,
    };
  }
}, { immediate: true }); // 立即执行一次，以便在组件挂载时根据 initialDish 渲染

const submitForm = () => {
  formError.value = null;
  if (!dishForm.value.name || dishForm.value.price <= 0) {
    formError.value = '菜品名称和价格是必填项，且价格必须大于0。';
    return;
  }
  submitting.value = true;
  emit('submit', dishForm.value); // 触发 submit 事件，将表单数据传递出去
  // 提交后父组件会处理loading和关闭modal
  submitting.value = false; // 在这里简单重置，实际异步操作应由父组件控制
};

const cancelForm = () => {
  emit('cancel'); // 触发 cancel 事件
};
</script>

<style scoped>
.dish-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

.checkbox-group label {
  margin-bottom: 0;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

button[type="submit"] {
  background-color: #42b983;
  color: white;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #368e6b;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>