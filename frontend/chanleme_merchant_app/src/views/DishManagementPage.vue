<!-- <template>
  <div class="dish-management">
    <h2>菜品管理</h2>

    <LoadingSpinner v-if="loading" />
    <ErrorDisplay v-if="error" :message="error" />

    <div v-if="dishes.length === 0 && !loading && !error" class="no-dishes">
      <p>暂无菜品。</p>
      <button @click="openAddDishModal">添加新菜品</button>id
    </div>

    <div v-else-if="dishes.length > 0" class="dish-list">
      <div v-for="dish in dishes" :key="dish.id" class="dish-card">
        <h3>{{ dish.name }}</h3>
        <p>{{ dish.description }}</p>
        <p>价格: ¥{{ dish.price?.toFixed(2) }}</p>
        <p>状态: {{ dish.isAvailable ? '在售' : '下架' }}</p>
        <div class="actions">
          <button @click="openEditDishModal(dish)">编辑</button>
          <button @click="deleteDish(dish.id)">删除</button>
        </div>
      </div>
    </div>

    <DishModal
      v-if="isModalOpen"
      :dish="currentDish"
      @close="closeModal"
      @save="handleSaveDish"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { merchantDishService, Dish } from '@/api/merchantApi';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorDisplay from '@/components/common/ErrorDisplay.vue';
// 导入 DishModal 组件，假设它在 components/merchant/DishModal.vue
import DishModal from '@/components/common/DishModal.vue';

const dishes = ref<Dish[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// 模态框相关：取消注释这些变量
const isModalOpen = ref(false);
const currentDish = ref<Dish | null>(null); // 用于编辑时传递菜品数据，或添加时为 null

const fetchDishes = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await merchantDishService.getMerchantDishes();
    // 核心修改：在接收到数据后，将 price 转换为数字类型
    dishes.value = data.map(dish => ({
      ...dish,
      // 如果 dish.price 是字符串，则使用 parseFloat 转换为浮点数
      // 如果已经是数字，则保持不变
      price: typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price
    }));
    console.log('Fetched dishes (with price converted):', dishes.value);
    // 可以在控制台检查第一个菜品的价格类型，验证是否已转换为数字
    console.log('Type of first dish price:', typeof dishes.value[0]?.price);
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || '获取菜品列表失败';
    console.error('Error fetching dishes:', err);
    dishes.value = [];
  } finally {
    loading.value = false;
  }
};

// 添加菜品：取消注释这个函数
const openAddDishModal = () => {
  console.log('点击了“添加新菜品”按钮');
  currentDish.value = null; // 清空 currentDish，表示是新增操作
  isModalOpen.value = true; // 打开模态框
};

// 编辑菜品：取消注释这个函数
const openEditDishModal = (dish: Dish) => {
  console.log('点击了“编辑菜品”按钮，编辑菜品ID:', dish.id);
  currentDish.value = { ...dish }; // 复制菜品对象进行编辑，避免直接修改原始数据
  isModalOpen.value = true; // 打开模态框
};

// 处理模态框保存事件：取消注释这个函数
const handleSaveDish = async (savedDish: Dish) => {
  console.log('模态框保存了菜品数据:', savedDish);
  try {
    if (savedDish.id) {
      // 假设更新菜品不需要 restaurantId，后端会从token或路由参数中获取
      await merchantDishService.updateDish(savedDish.id, savedDish);
      alert('菜品更新成功！');
    } else {
      // 新增菜品时，需要确保后端能正确处理没有 id 的数据，并自动添加 restaurantId
      // 这里传递的 savedDish 应该不包含 id 和 restaurantId
      await merchantDishService.addDish(savedDish);
      alert('菜品添加成功！');
    }
    closeModal(); // 关闭模态框
    await fetchDishes(); // 刷新菜品列表
  } catch (err: any) {
    alert(`保存菜品失败: ${err.response?.data?.message || err.message || '未知错误'}`);
    console.error('Error saving dish:', err);
  }
};

// 关闭模态框：取消注释这个函数
const closeModal = () => {
  console.log('关闭模态框');
  isModalOpen.value = false; // 关闭模态框
  currentDish.value = null; // 清空 currentDish
};

const deleteDish = async (dishId: number) => {
  if (!confirm('确定要删除此菜品吗？')) return;
  try {
    await merchantDishService.deleteDish(dishId);
    alert('菜品删除成功！');
    await fetchDishes();
  } catch (err: any) {
    alert(`删除菜品失败: ${err.response?.data?.message || err.message || '未知错误'}`);
    console.error('Error deleting dish:', err);
  }
};

onMounted(() => {
  fetchDishes();
});
</script>

<style scoped>
/* 样式保持不变 */
.dish-management {
  max-width: 1000px;
  margin: 20px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
}

.no-dishes {
  text-align: center;
  color: #777;
  font-style: italic;
  padding: 30px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  margin-top: 20px;
}

.no-dishes button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.no-dishes button:hover {
  background-color: #0056b3;
}

.dish-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.dish-card {
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dish-card h3 {
  margin-top: 0;
  color: #333;
  font-size: 1.4em;
  margin-bottom: 10px;
}

.dish-card p {
  margin: 5px 0;
  color: #666;
  font-size: 0.95em;
}

.dish-card .actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.dish-card .actions button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
}

.dish-card .actions button:first-child {
  background-color: #ffc107; /* 黄色 */
  color: #333;
}

.dish-card .actions button:first-child:hover {
  background-color: #e0a800;
}

.dish-card .actions button:last-child {
  background-color: #dc3545; /* 红色 */
  color: white;
}

.dish-card .actions button:last-child:hover {
  background-color: #c82333;
}
</style> -->
<template>
  <div class="dish-management">
    <h2>菜品管理</h2>

    <LoadingSpinner v-if="loading" />
    <ErrorDisplay v-if="error" :message="error" />

    <div v-if="dishes.length === 0 && !loading && !error" class="no-dishes">
      <p>暂无菜品。</p>
      <button @click="openAddDishModal">添加新菜品</button>
    </div>

    <div v-else-if="dishes.length > 0" class="dish-list">
      <div v-for="dish in dishes" :key="dish.item_id" class="dish-card">
        <h3>{{ dish.item_name }}</h3> <p>{{ dish.description }}</p>
        <p>价格: ¥{{ dish.price?.toFixed(2) }}</p>
        <p>状态: {{ dish.is_available ? '在售' : '下架' }}</p> <div class="actions">
          <button @click="openEditDishModal(dish)">编辑</button>
          <button @click="deleteDish(dish.item_id)">删除</button>
        </div>
      </div>
    </div>

    <DishModal
      v-if="isModalOpen"
      :dish="currentDish"
      @close="closeModal"
      @save="handleSaveDish"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { merchantDishService, Dish } from '@/api/merchantApi';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorDisplay from '@/components/common/ErrorDisplay.vue';
// 导入 DishModal 组件，假设它在 components/merchant/DishModal.vue
import DishModal from '@/components/common/DishModal.vue'; // 确保路径正确，之前是 '@/components/common/DishModal.vue'

const dishes = ref<Dish[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const isModalOpen = ref(false);
const currentDish = ref<Dish | null>(null);

const fetchDishes = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await merchantDishService.getMerchantDishes();
    dishes.value = data.map(dish => ({
      ...dish,
      price: typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price
    }));
    console.log('Fetched dishes (with price converted):', dishes.value);
    console.log('Type of first dish price:', typeof dishes.value[0]?.price);
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || '获取菜品列表失败';
    console.error('Error fetching dishes:', err);
    dishes.value = [];
  } finally {
    loading.value = false;
  }
};

const openAddDishModal = () => {
  console.log('点击了“添加新菜品”按钮');
  currentDish.value = null;
  isModalOpen.value = true;
};

const openEditDishModal = (dish: Dish) => {
  console.log('点击了“编辑菜品”按钮，编辑菜品ID:', dish.item_id);
  // **调试日志：打印传递给模态框的完整菜品对象，确保id存在且为数字**
  console.log('DEBUG: DishManagementPage - Dish passed to edit modal:', dish);
  currentDish.value = {
    ...dish,
    price: typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price // 再次确保price是数字
  };
  isModalOpen.value = true;
};

const handleSaveDish = async (savedDish: Dish) => {
  console.log('模态框保存了菜品数据:', savedDish);
  // **调试日志：确认接收到的 savedDish 的 id**
  console.log('DEBUG: DishManagementPage - Received savedDish ID:', savedDish.item_id);
  try {
    if (savedDish.item_id) {
      await merchantDishService.updateDish(savedDish.item_id, savedDish);
      alert('菜品更新成功！');
    } else {
      await merchantDishService.addDish(savedDish);
      alert('菜品添加成功！');
    }
    closeModal();
    await fetchDishes();
  } catch (err: any) {
    alert(`保存菜品失败: ${err.response?.data?.message || err.message || '未知错误'}`);
    console.error('Error saving dish:', err);
  }
};

const closeModal = () => {
  console.log('关闭模态框');
  isModalOpen.value = false;
  currentDish.value = null;
};

const deleteDish = async (dishId: number) => {
  if (!confirm('确定要删除此菜品吗？')) return;
  try {
    await merchantDishService.deleteDish(dishId);
    alert('菜品删除成功！');
    await fetchDishes();
  } catch (err: any) {
    alert(`删除菜品失败: ${err.response?.data?.message || err.message || '未知错误'}`);
    console.error('Error deleting dish:', err);
  }
};

onMounted(() => {
  fetchDishes();
});
</script>

<style scoped>
/* 样式保持不变 */
.dish-management {
  max-width: 1000px;
  margin: 20px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
}

.no-dishes {
  text-align: center;
  color: #777;
  font-style: italic;
  padding: 30px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  margin-top: 20px;
}

.no-dishes button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.no-dishes button:hover {
  background-color: #0056b3;
}

.dish-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.dish-card {
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dish-card h3 {
  margin-top: 0;
  color: #333;
  font-size: 1.4em;
  margin-bottom: 10px;
}

.dish-card p {
  margin: 5px 0;
  color: #666;
  font-size: 0.95em;
}

.dish-card .actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.dish-card .actions button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
}

.dish-card .actions button:first-child {
  background-color: #ffc107; /* 黄色 */
  color: #333;
}

.dish-card .actions button:first-child:hover {
  background-color: #e0a800;
}

.dish-card .actions button:last-child {
  background-color: #dc3545; /* 红色 */
  color: white;
}

.dish-card .actions button:last-child:hover {
  background-color: #c82333;
}
</style>