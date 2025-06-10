<!-- <script setup lang="ts">
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
</style> -->
<!-- src/components/menu/MenuItemFormModal.vue -->
<template>
  <div v-if="isVisible" class="modal-overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
    <div class="modal-container bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">{{ isEditing ? '编辑菜品' : '新增菜品' }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="item_name" class="block text-gray-700 text-sm font-bold mb-2">菜品名称:</label>
          <input type="text" id="item_name" v-model="formData.item_name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            required>
        </div>

        <div class="mb-4">
          <label for="description" class="block text-gray-700 text-sm font-bold mb-2">描述:</label>
          <textarea id="description" v-model="formData.description" rows="3"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            required></textarea>
        </div>

        <div class="mb-4">
          <label for="price" class="block text-gray-700 text-sm font-bold mb-2">价格:</label>
          <input type="number" id="price" v-model.number="formData.price" step="0.01" min="0"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            required>
        </div>

        <div class="mb-4">
          <label for="category" class="block text-gray-700 text-sm font-bold mb-2">分类:</label>
          <input type="text" id="category" v-model="formData.category"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            required>
        </div>

        <div class="mb-4">
          <label for="image_url" class="block text-gray-700 text-sm font-bold mb-2">图片URL (可选):</label>
          <input type="url" id="image_url" v-model="formData.image_url"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500">
        </div>

        <div class="mb-6 flex items-center">
          <input type="checkbox" id="is_available" v-model="formData.is_available"
            class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
          <label for="is_available" class="text-gray-700 text-sm font-bold">是否可售</label>
        </div>

        <div v-if="menuStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <p>{{ menuStore.error }}</p>
        </div>

        <div class="flex justify-end gap-3">
          <button type="button" @click="closeModal"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200">
            取消
          </button>
          <button type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
            :disabled="menuStore.loading">
            {{ menuStore.loading ? '提交中...' : (isEditing ? '保存修改' : '新增菜品') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';
import { useMenuStore } from '../../stores/menu';
import { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from '../../types/menu';

export default defineComponent({
  name: 'MenuItemFormModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    menuItem: { // 当为编辑模式时传入，新增时为 null 或 undefined
      type: Object as PropType<MenuItem | null>,
      default: null,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const menuStore = useMenuStore();

    const initialFormData: CreateMenuItemDto = {
      item_name: '',
      description: '',
      price: 0,
      category: '',
      image_url: '',
      is_available: true,
    };

    const formData = ref<CreateMenuItemDto>(JSON.parse(JSON.stringify(initialFormData))); // Deep copy
    const isEditing = ref(false);

    // 监听 menuItem prop 的变化，用于填充表单数据
    watch(() => props.menuItem, (newItem) => {
      if (newItem) {
        // 编辑模式：填充现有数据
        formData.value = { ...newItem };
        isEditing.value = true;
      } else {
        // 新增模式：重置表单
        formData.value = JSON.parse(JSON.stringify(initialFormData));
        isEditing.value = false;
      }
    }, { immediate: true }); // immediate: true 确保在组件初始化时也运行一次

    const handleSubmit = async () => {
      try {
        if (isEditing.value && props.menuItem) {
          // 编辑现有菜品
          await menuStore.updateMenuItem(props.menuItem.item_id, formData.value as UpdateMenuItemDto);
        } else {
          // 新增菜品
          await menuStore.addMenuItem(formData.value as CreateMenuItemDto);
        }
        closeModal(); // 提交成功后关闭弹窗
      } catch (error) {
        // 错误信息已经在 store 中设置，这里只需捕获并阻止关闭
        console.error('提交菜品表单失败:', error);
      }
    };

    const closeModal = () => {
      menuStore.error = null; // 清除错误信息
      emit('close');
    };

    return {
      formData,
      isEditing,
      menuStore,
      handleSubmit,
      closeModal,
    };
  },
});
</script>

<style scoped>
/* Modal 居中和基本样式 */
.modal-overlay {
  z-index: 1000;
}
.modal-container {
  max-height: 90vh; /* 限制最大高度 */
  overflow-y: auto; /* 超出部分滚动 */
}
</style>
