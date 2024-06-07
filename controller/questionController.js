const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const listQuestions = async (req, res) => {
  try {
    const data = await prisma.$queryRaw`SELECT a.*,b.categoryName AS category_name FROM tbl_question a
      JOIN tbl_category b ON a.categoryId = b.id`
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createQuestion = async (req, res) => {
  const { question, ref, category, weight } = req.body;
  const questions = await prisma.Questions.create({
    data: {
      question: question,
      status: 'A',
      ref: ref,
      categoryId: category.toString(),
      weightOfelement: weight,
      created_at: new Date(),
    },
  });

  console.log('Created category:', questions);
  res.status(200).json(questions);
};

const updateQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { question, ref, category, weight } = req.body;

  try {
    const updatedQuestion = await prisma.questions.update({
      where: { id: parseInt(questionId) },
      data: {
        question: question,
        status: 'A',
        ref: ref,
        categoryId: category.toString(),
        weightOfelement: weight,
      },
    });

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
}

const deleteQuestion = async (req, res) => {
  const { questionId } = req.params;
  try {
    // Delete the question using Prisma's delete method
    const deletedQuestion = await prisma.questions.delete({
      where: { id: parseInt(questionId) },
    });

    res.status(200).json(deletedQuestion);

    console.log(`Deleted question with ID: ${deletedQuestion.id}`);
  } catch (error) {
    console.error('Error deleting question:', error);
  }
};


module.exports = { listQuestions, createQuestion, updateQuestion, deleteQuestion }  