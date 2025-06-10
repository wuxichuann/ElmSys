<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from '../../types/menu';

const props = defineProps<{
  show: boolean;
  isEditing: boolean;
  menuItem: MenuItem | null;
}>();

const emit = defineEmits(['close', 'save']);

const formData = ref<CreateMenuItemDto | UpdateMenuItemDto>({
  name: '',
  description: '',
  price: 0,
  category: '',
  image_url: '',
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.isEditing && props.menuItem) {
      formData.value = { ...props.menuItem }; // 预填充数据
    } else {
      formData.value = { // 重置为初始状态
        name: '',
        description: '',
        price: 0,
        category: '',
        image_url: '',
      };
    }
  }
});

const handleSubmit = () => {
  // 简单的表单验证
  if (!formData.value.name || !formData.value.category || !formData.value.price || formData.value.price <= 0) {
    alert('请填写完整的菜品信息，并确保价格大于0！');
    return;
  }
  emit('save', formData.value);
};

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ isEditing ? '编辑菜品' : '新增菜品' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">菜品名称:</label>
          <input id="name" v-model="formData.name" type="text" required />
        </div>
        <div class="form-group">
          <label for="category">分类:</label>
          <input id="category" v-model="formData.category" type="text" required />
        </div>
        <div class="form-group">
          <label for="price">价格:</label>
          <input id="price" v-model.number="formData.price" type="number" step="0.01" min="0.01" required />
        </div>
        <div class="form-group">
          <label for="description">描述:</label>
          <textarea id="description" v-model="formData.description"></textarea>
        </div>
        <div class="form-group">
          <label for="image_url">图片URL (可选):</label>
          <input id="image_url" v-model="formData.image_url" type="url" />
        </div>
        <div class="modal-actions">
          <button type="submit" class="save-button">保存</button>
          <button type="button" @click="closeModal" class="cancel-button">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 500px;
  max-width: 90%;
}

h3 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
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
.form-group input[type="url"],
.form-group textarea {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.save-button, .cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.save-button {
  background-color: #007bff;
  color: white;
}

.save-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
}
</style>