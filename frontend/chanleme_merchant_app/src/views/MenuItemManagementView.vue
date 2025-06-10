<script setup lang="ts">
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
</style>