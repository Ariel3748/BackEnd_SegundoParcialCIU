const Tag = require("../models/tag");
const { invalidateCache } = require("../services/cache.service");

const createTag = async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al crear etiqueta", error: error.message });
  }
};

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obetener las etiquetas",
        error: error.message,
      });
  }
};

const editTag = async (req, res) => {
  try {
    const { id } = req.params;
    const updateTag = await Tag.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateTag)
      return res.status(404).json({ message: "Etiqueta no encontrada" });

    await invalidateCache(["tags:all"]);
    res.status(200).json(updateTag);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al editar la etiqueta", error: error.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    await invalidateCache(["tags:all"]);
    res.status(200).json({ message: "Etiqueta eliminada con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la etiqueta", error: error.message });
  }
};

module.exports = { createTag, getAllTags, editTag, deleteTag };
