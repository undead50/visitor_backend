const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchCategorys = async (req, res) => {
  try {
    const data = await prisma.Category.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createCategory = async (req, res) => {
  const  categoryobject  = req.body;
  const category = await prisma.category.create({
    data: categoryobject,
  });
  console.log('Created category:', category);
  res.status(200).json(category);
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    // Delete the category using Prisma's delete method
    const deletedCategory = await prisma.category.delete({
      where: { id: parseInt(categoryId) },
    });

    res.status(200).json(deletedCategory);

    console.log(`Deleted category with ID: ${deletedCategory.id}`);
  } catch (error) {
    console.error('Error deleting category:', error);
  }
};

const  updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const updatedCategoryData = req.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(categoryId) },
      data: updatedCategoryData,
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
}

module.exports = { fetchCategorys, createCategory, deleteCategory, updateCategory };
