import { Router } from "express";
import { Todo } from "../models/todo.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find();
        return res.json({
            success: true,
            data: todos,
            message: "All Todos fetched successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post("/", async (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
        return res.status(400).json({
            success: false,
            message: "Text should be present to create todo"
        });
    }
    try {
        const newTodo = new Todo({ text });
        const todo = await newTodo.save();
        return res.status(201).json({
            success: true,
            data: todo,
            message: "Todo created successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const { text, completed } = req.body;
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo with this ID is not present"
            });
        }
        if (text !== undefined) {
            todo.text = text;
        }
        if (completed !== undefined) {
            todo.completed = completed;
        }
        await todo.save();
        return res.status(200).json({
            success: true,
            data: todo,
            message: "Todo updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
