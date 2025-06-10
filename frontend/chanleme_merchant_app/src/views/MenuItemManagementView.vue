<!-- <script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMenuStore } from '../stores/menu';
import { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from '../types/menu';
import MenuItemFormModal from '../components/menu/MenuItemFormModal.vue';

const menuStore = useMenuStore();
const showModal = ref(false);
const isEditing = ref(false);
const currentMenuItem = ref<MenuItem | null>(null);

onMounted(() => {
  menuStore.fetchMenuItems();
});

const openCreateModal = () => {
  isEditing.value = false;
  currentMenuItem.value = null;
  showModal.value = true;
};

const openEditModal = (item: MenuItem) => {
  isEditing.value = true;
  currentMenuItem.value = { ...item }; // 复制一份数据，避免直接修改 store
  showModal.value = true;
};

const handleSaveMenuItem = async (formData: CreateMenuItemDto | UpdateMenuItemDto) => {
  try {
    if (isEditing.value && currentMenuItem.value) {
      await menuStore.updateMenuItem(currentMenuItem.value.id, formData as UpdateMenuItemDto);
      alert('菜品更新成功！');
    } else {
      await menuStore.createMenuItem(formData as CreateMenuItemDto);
      alert('菜品新增成功！');
    }
    showModal.value = false;
  } catch (error) {
    alert('操作失败：' + menuStore.error);
  }
};

const handleDeleteMenuItem = async (id: number) => {
  if (confirm('确定要删除此菜品吗？')) {
    try {
      await menuStore.deleteMenuItem(id);
      alert('菜品删除成功！');
    } catch (error) {
      alert('删除失败：' + menuStore.error);
    }
  }
};

const toggleAvailability = async (item: MenuItem) => {
  try {
    await menuStore.toggleMenuItemAvailability(item.id, !item.is_available);
    alert('菜品可售状态已更新！');
  } catch (error) {
    alert('更新状态失败：' + menuStore.error);
  }
};
</script>

<template>
  <div class="menu-management-view">
    <h2>菜品管理</h2>
    <button @click="openCreateModal" class="add-new-button">+ 新增菜品</button>

    <div v-if="menuStore.loading" class="loading-message">加载中...</div>
    <div v-else-if="menuStore.error" class="error-message">{{ menuStore.error }}</div>
    <div v-else-if="menuStore.menuItems.length === 0" class="no-data-message">暂无菜品，点击“新增菜品”添加。</div>

    <table v-else class="menu-table">
      <thead>
        <tr>
          <th>图片</th>
          <th>菜品名称</th>
          <th>分类</th>
          <th>价格</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in menuStore.menuItems" :key="item.id">
          <td>
            <img :src="item.image_url || '/placeholder-food.png'" alt="菜品图片" class="menu-item-image">
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.category }}</td>
          <td>¥{{ item.price.toFixed(2) }}</td>
          <td>
            <button
              @click="toggleAvailability(item)"
              :class="['status-toggle-button', item.is_available ? 'available' : 'unavailable']"
            >
              {{ item.is_available ? '可售' : '下架' }}
            </button>
          </td>
          <td>
            <button @click="openEditModal(item)" class="action-button edit-button">编辑</button>
            <button @click="handleDeleteMenuItem(item.id)" class="action-button delete-button">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <MenuItemFormModal
      v-if="showModal"
      :show="showModal"
      :is-editing="isEditing"
      :menu-item="currentMenuItem"
      @close="showModal = false"
      @save="handleSaveMenuItem"
    />
  </div>
</template>

<style scoped>
.menu-management-view {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.add-new-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.add-new-button:hover {
  background-color: #218838;
}

.loading-message, .error-message, .no-data-message {
  text-align: center;
  padding: 20px;
  color: #666;
}
.error-message {
  color: #dc3545;
}

.menu-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.menu-table th, .menu-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  vertical-align: middle;
}

.menu-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

.menu-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.status-toggle-button {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.status-toggle-button.available {
  background-color: #28a745;
  color: white;
}

.status-toggle-button.unavailable {
  background-color: #ffc107;
  color: #333;
}

.action-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  transition: background-color 0.3s;
}

.action-button.edit-button {
  background-color: #007bff;
  color: white;
}

.action-button.edit-button:hover {
  background-color: #0056b3;
}

.action-button.delete-button {
  background-color: #dc3545;
  color: white;
}

.action-button.delete-button:hover {
  background-color: #c82333;
}
</style> -->
<!-- src/views/MenuItemManagementView.vue -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-extrabold text-gray-900 mb-8 text-center">菜品管理</h1>

    <div class="flex justify-between items-center mb-6">
      <button @click="openAddModal"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500">
        <i class="fas fa-plus mr-2"></i> 新增菜品
      </button>
    </div>

    <div v-if="menuStore.loading" class="text-center py-8">
      <p class="text-lg text-gray-600">加载菜品中...</p>
      <!-- 可以添加一个加载动画 -->
    </div>

    <div v-else-if="menuStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
      <p>{{ menuStore.error }}</p>
      <button @click="menuStore.fetchMenuItems" class="mt-2 text-blue-600 hover:underline">点击重试</button>
    </div>

    <div v-else-if="menuStore.menuItems.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
      <p class="text-xl text-gray-500">您还没有添加任何菜品，赶快添加第一个吧！</p>
      <button @click="openAddModal"
        class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500">
        添加菜品
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in menuStore.menuItems" :key="item.item_id"
        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
        <img :src="item.image_url || 'https://placehold.co/400x200/cccccc/333333?text=No+Image'"
             alt="Dish Image" class="w-full h-48 object-cover">
        <div class="p-6 flex flex-col flex-grow">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ item.item_name }}</h3>
          <p class="text-gray-600 text-sm mb-3 flex-grow">{{ item.description }}</p>
          <div class="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
            <span class="text-2xl font-bold text-red-600">¥{{ item.price.toFixed(2) }}</span>
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold', item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
              {{ item.is_available ? '可售' : '已下架' }}
            </span>
          </div>
          <div class="flex justify-end gap-3 mt-4">
            <button @click="openEditModal(item)"
              class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200">
              <i class="fas fa-edit mr-1"></i> 编辑
            </button>
            <button @click="confirmDelete(item)"
              class="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200">
              <i class="fas fa-trash-alt mr-1"></i> 删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 菜品表单弹窗 -->
    <MenuItemFormModal
      :is-visible="isModalVisible"
      :menu-item="selectedMenuItem"
      @close="closeModal"
    />

    <!-- 删除确认弹窗 -->
    <div v-if="isDeleteConfirmVisible" class="modal-overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-20">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">确认删除</h3>
        <p class="text-gray-700 mb-6">您确定要删除菜品 "{{ deleteCandidate?.item_name }}" 吗？此操作不可撤销。</p>
        <div class="flex justify-end gap-3">
          <button @click="cancelDelete"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200">
            取消
          </button>
          <button @click="executeDelete"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
            :disabled="menuStore.loading">
            {{ menuStore.loading ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useMenuStore } from '../stores/menu';
import MenuItemFormModal from '../components/menu/MenuItemFormModal.vue';
import { MenuItem } from '../types/menu'; // 导入 MenuItem 类型

export default defineComponent({
  name: 'MenuItemManagementView',
  components: {
    MenuItemFormModal,
  },
  setup() {
    const menuStore = useMenuStore();
    const isModalVisible = ref(false);
    const selectedMenuItem = ref<MenuItem | null>(null); // 用于编辑时传入菜品数据

    const isDeleteConfirmVisible = ref(false);
    const deleteCandidate = ref<MenuItem | null>(null); // 待删除的菜品

    onMounted(() => {
      menuStore.fetchMenuItems(); // 组件挂载时获取菜品列表
    });

    const openAddModal = () => {
      selectedMenuItem.value = null; // 清空，表示新增模式
      isModalVisible.value = true;
    };

    const openEditModal = (item: MenuItem) => {
      selectedMenuItem.value = item; // 传入要编辑的菜品
      isModalVisible.value = true;
    };

    const closeModal = () => {
      isModalVisible.value = false;
      selectedMenuItem.value = null; // 关闭后清除选中项
      // 重新获取数据以确保列表是最新的，或者让 store 自己处理更新
      menuStore.fetchMenuItems();
    };

    const confirmDelete = (item: MenuItem) => {
      deleteCandidate.value = item;
      isDeleteConfirmVisible.value = true;
    };

    const cancelDelete = () => {
      isDeleteConfirmVisible.value = false;
      deleteCandidate.value = null;
    };

    const executeDelete = async () => {
      if (deleteCandidate.value) {
        try {
          await menuStore.deleteMenuItem(deleteCandidate.value.item_id);
          cancelDelete(); // 删除成功后关闭确认弹窗
        } catch (error) {
          console.error('删除失败:', error);
          // 错误信息会通过 store.error 显示
        }
      }
    };

    return {
      menuStore,
      isModalVisible,
      selectedMenuItem,
      isDeleteConfirmVisible,
      deleteCandidate,
      openAddModal,
      openEditModal,
      closeModal,
      confirmDelete,
      cancelDelete,
      executeDelete,
    };
  },
});
</script>

<style scoped>
/* 可以在这里添加一些额外的样式 */
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
}
</style>
