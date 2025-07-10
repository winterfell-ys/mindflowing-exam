import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../providers/StoreProvider';
import { Task, User } from '../models/TaskModel';
import type { Instance } from 'mobx-state-tree';
type TaskInstance = Instance<typeof Task>;
type UserInstance = Instance<typeof User>;

const TaskList: React.FC = observer(() => {
    const store = useStore();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [userId, setUserId] = useState(1);

    const reload = async () => {
        await store.fetchUsers();
        await store.fetchTasks();
    };
    useEffect(() => {
        reload();
    }, [store]);
    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;
        const newUser = User.create({
            id: userId,
            name: 'user' + userId,
            tasks: []
        });
        const newTask = {
            id: Date.now(),
            title: newTaskTitle,
            completed: false,
            userId: userId,
        };
        store.addUser(newUser);
        store.addTask(newTask);
        await store.postUser(newUser);
        await store.postTask(newTask);

        setUserId(1);
        setNewTaskTitle('');
    };
    return (
        <div>
            <h2>所有任务</h2>
            <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="输入新任务"
            />
            UserId:
            <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(Number(e.target.value))}
            />
            <button onClick={handleAddTask}>添加任务</button>

            <ul>
                {store.tasks.map((task: TaskInstance) => (
                    <li key={task.id}>
                        {task.title} - {task.completed ? '已完成' : '未完成'}
                    </li>
                ))}
            </ul>

            <h3>待办任务: {store.pendingTasks.length}</h3>
            <h2>人员列表</h2>
            <ul>
                {store.users.map((user: UserInstance) => (
                    <li key={user.id}>
                        {user.name}
                        <button onClick={async () => {
                            await store.deleteUser(user.id);
                            await reload();
                        }}>del</button>
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default TaskList;