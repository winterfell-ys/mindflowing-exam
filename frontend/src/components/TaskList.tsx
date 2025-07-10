import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../providers/StoreProvider';
import type { TaskVO } from '../shared/types';

const TaskList: React.FC = observer(() => {
    const store = useStore();

    useEffect(() => {
        store.fetchTasks();
    }, [store]);

    return (
        <div>
            <h2>所有任务</h2>
            <ul>
                {store.tasks.map((task: TaskVO) => (
                    <li key={task.id}>
                        {task.title} - {task.completed ? '已完成' : '未完成'}
                    </li>
                ))}
            </ul>

            <h3>待办任务: {store.pendingTasks.length}</h3>
        </div>
    );
});

export default TaskList;