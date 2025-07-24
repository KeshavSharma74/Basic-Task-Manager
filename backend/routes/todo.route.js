import { Router } from "express";
import { Todo } from "../models/todo.model.js";

const router=Router()

router.get('/',async(req,res)=>{
    try{
        const todos=await Todo.find();
        return res.json({
            success:true,
            data:todos,
            message:"All Todos fetched successfully"
        });
    }
    catch(error){
        console.log(error.message)
        return res.json({
            success:false,
            message:error.message
        })
    }
})

router.post('/',async(req,res)=>{
    const {text}=req.body;
    if(!text.trim()){
        return res.status(400).json({
            success:false,
            message:"Text should be present to create todo"
        })
    }
    try{
        const newTodo=new Todo({
            text
        })
        const todo=await newTodo.save()
        if(!todo){
            return res.status(500).json({
                success:false,
                message:"Can't save todo to the database",
            })
        }
        return res.status(200).json({
            success:true,
            data:todo,
            message:"Todo created successfully..!!!"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
})

router.patch('/:id',async(req,res)=>{
    try{
        const todo=await Todo.findById(req.params.id);
        if(!todo){
            return res.json({
                success:false,
                message:"Todo with this id is not present"
            })
        }
        if(todo.text!==undefined){
            todo.text=req.body.text
        }
        if(todo.completed!=undefined){
            todo.completed=req.body.completed
        }
        return res.status(200).json({
            success:false,
            data:todo,
            message:"Todo is updated successfully"
        })
    }
    catch(error){
        console.log(error.message);
        return res.status(200).json({
            success:false,
            message:error.message,
        })
    }
})

router.delete('/:id',async(req,res)=>{   
    try{
        await Todo.findByIdAndDelete(req.body.id);
        return res.status(200).json({
            success:true,
            message:"Todo deleted successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
})

export default router