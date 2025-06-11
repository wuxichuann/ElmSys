<!-- <template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <h3>{{ dish ? '编辑菜品' : '新增菜品' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">菜品名称:</label>
          <input type="text" id="name" v-model="formData.item_name" required />
        </div>
        <div class="form-group">
          <label for="description">描述:</label>
          <textarea id="description" v-model="formData.description"></textarea>
        </div>
        <div class="form-group">
          <label for="price">价格:</label>
          <input type="number" id="price" v-model.number="formData.price" required step="0.01" />
        </div>
        <div class="form-group">
          <label for="image_url">图片URL:</label>
          <input type="text" id="imageu_url" v-model="formData.image_url" />
        </div>
        <div class="form-group checkbox-group">
  <input type="checkbox" id="is_available" v-model="formData.is_available" />
  <label for="is_available">是否在售</label>
</div>
<div class="form-group">
  <label for="category">分类:</label>
  <input type="text" id="category" v-model="formData.category" required />
  </div>

        <div class="modal-actions">
          <button type="submit">{{ dish ? '保存修改' : '添加菜品' }}</button>
          <button type="button" @click="emit('close')" class="cancel-button">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, PropType } from 'vue';
import { Dish } from '@/api/merchantApi'; // 导入 Dish 接口

// 定义 props
const props = defineProps({
  dish: {
    type: Object as PropType<Dish | null>,
    default: null,
  },
});

// 定义 emit 事件
const emit = defineEmits(['close', 'save']);

// // 初始表单数据
// const initialFormData = {
//   id: undefined, // 对于新增菜品，id 是 undefined
//   name: '',
//   description: '',
//   price: 0,
//   imageUrl: '',
//   isAvailable: true,
//   // restaurantId, createdAt, updatedAt 等字段由后端处理，前端新增/编辑时不需要提供
// };
const initialFormData: Partial<Dish> = {
  id: undefined,
  item_name: '',
  description: '',
  price: 0,
  image_url: '',
  category: '', // 确保这里初始化为空字符串
  is_available: true, // 确保这里初始化为布尔值
};

// 响应式表单数据
const formData = ref<Partial<Dish>>({ ...initialFormData });

// 监听 props.dish 的变化，用于编辑模式下填充表单
watch(
  () => props.dish,
  (newDish) => {
    if (newDish) {
      // 填充现有菜品数据进行编辑
      formData.value = { ...newDish };
    } else {
      // 重置表单数据为初始状态（新增菜品）
      formData.value = { ...initialFormData };
    }
  },
  { immediate: true } // 立即执行一次监听，确保初始状态正确
);

const handleSubmit = () => {
  // 确保 price 是数字，如果输入框为空，v-model.number 可能会将其设为 null
  if (formData.value.price === null || formData.value.price === undefined) {
    formData.value.price = 0;
  }
   if (!formData.value.category) {
    alert('菜品分类不能为空！');
    return;
  }
  // 检查 is_available 是否为布尔值，并确保不为空
  // 由于 v-model.checkbox 会自动处理布尔值，这里主要检查它是否被正确设置。
  // 如果后端要求严格的 `isNotEmpty` 对于布尔值，那么 `true` 或 `false` 都是“非空”的。
  if (formData.value.is_available === null || formData.value.is_available === undefined) {
      alert('请设置菜品的可售状态！');
      return;
  }
  // 触发 save 事件，将表单数据传递出去
  emit('save', formData.value);
};
</script> -->
<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <h3>{{ dish ? '编辑菜品' : '新增菜品' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="item_name">菜品名称:</label> <input type="text" id="item_name" v-model="formData.item_name" required /> </div>
        <div class="form-group">
          <label for="description">描述:</label>
          <textarea id="description" v-model="formData.description"></textarea>
        </div>
        <div class="form-group">
          <label for="price">价格:</label>
          <input type="number" id="price" v-model.number="formData.price" required step="0.01" />
        </div>
        <div class="form-group">
          <label for="image_url">图片URL:</label>
          <input type="text" id="image_url" v-model="formData.image_url" /> </div>
        <div class="form-group checkbox-group">
          <input type="checkbox" id="is_available" v-model="formData.is_available" />
          <label for="is_available">是否在售</label>
        </div>
        <div class="form-group">
          <label for="category">分类:</label>
          <input type="text" id="category" v-model="formData.category" required />
        </div>

        <div class="modal-actions">
          <button type="submit">{{ dish ? '保存修改' : '添加菜品' }}</button>
          <button type="button" @click="emit('close')" class="cancel-button">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, PropType } from 'vue';
import { Dish } from '@/api/merchantApi';

const props = defineProps({
  dish: {
    type: Object as PropType<Dish | null>,
    default: null,
  },
});

const emit = defineEmits(['close', 'save']);

const initialFormData: Partial<Dish> = {
  item_id: undefined,
  item_name: '',
  description: '',
  price: 0,
  image_url: '',
  category: '',
  is_available: true,
};

const formData = ref<Partial<Dish>>({ ...initialFormData });

watch(
  () => props.dish,
  (newDish) => {
    if (newDish) {
      formData.value = { ...newDish };
      // **调试日志：检查填充后formData的ID**
      console.log('DEBUG: DishModal - Form populated with existing dish. ID:', formData.value.item_id, 'Full data:', formData.value);
    } else {
      formData.value = { ...initialFormData };
      // **调试日志：检查重置后formData的ID**
      console.log('DEBUG: DishModal - Form reset for new dish. ID:', formData.value.item_id);
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (formData.value.price === null || formData.value.price === undefined) {
    formData.value.price = 0;
  }
  if (!formData.value.category) {
    alert('菜品分类不能为空！');
    return;
  }
  if (formData.value.is_available === null || formData.value.is_available === undefined) {
      alert('请设置菜品的可售状态！');
      return;
  }

  // **调试日志：检查提交前formData的ID**
  console.log('DEBUG: DishModal - Submitting form data. ID:', formData.value.item_id, 'Full data:', formData.value);
  emit('save', formData.value);
};
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  box-sizing: border-box;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.2);
}

.checkbox-group label {
  margin-bottom: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.modal-actions button[type="submit"] {
  background-color: #007bff;
  color: white;
}

.modal-actions button[type="submit"]:hover {
  background-color: #0056b3;
}

.modal-actions .cancel-button {
  background-color: #6c757d;
  color: white;
}

.modal-actions .cancel-button:hover {
  background-color: #5a6268;
}
</style>