import os

def list_folder_contents(startpath):
    """
    爬取指定文件夹下所有文件和子文件夹的名称、类型，并保持其结构。

    Args:
        startpath (str): 开始爬取的文件夹路径。
    """
    for root, dirs, files in os.walk(startpath):
        # 计算当前层级的深度，用于打印缩进
        level = root.replace(startpath, '').count(os.sep)
        indent = '    ' * level

        # 打印当前文件夹
        print(f'{indent}📂 {os.path.basename(root)}/')

        # 打印子文件夹
        sub_indent = '    ' * (level + 1)
        for d in dirs:
            print(f'{sub_indent}📁 {d}/')

        # 打印文件
        for f in files:
            print(f'{sub_indent}📄 {f}')

if __name__ == "__main__":
    # 获取当前脚本运行的文件夹路径
    current_directory = os.getcwd()
    print(f"正在爬取文件夹：{current_directory}\n")
    list_folder_contents(current_directory)