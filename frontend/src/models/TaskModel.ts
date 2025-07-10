import { types, flow, castToSnapshot, type Instance, t } from "mobx-state-tree";

export const Task = types.model("Task", {
  id: types.identifierNumber,
  title: types.string,
  completed: types.boolean,
  userId: types.number,
});

export const User = types.model("User", {
  id: types.identifierNumber,
  name: types.string,
  tasks: types.array(types.reference(Task)),
});

export const RootStore = types
  .model("RootStore", {
    users: types.array(User),
    tasks: types.array(Task),
  })
  .actions((self) => ({
    // 同步action
    addTask: (task: Instance<typeof Task>) => {
      self.tasks.push(task);
    },
    addUser: (user: Instance<typeof User>) => {
      self.users.push(user);
    },
    deleteTask: flow(function* (taskId: number) {
      self.tasks = castToSnapshot(
        self.tasks.filter((task) => task.id !== taskId)
      );

      // 故意写成同步删除. 体现同步
      // try {
      //   const response = yield fetch(`/api/tasks/${taskId}`, {
      //     method: "DELETE",
      //   });
      //   if (!response.ok) {
      //     throw new Error("Failed to delete task");
      //   }
      // } catch (err) {
      //   console.error("Delete failed", err);
      // }
    }),
    deleteUser: flow(function* (userId: number) {
      self.users = castToSnapshot(
        self.users.filter((user) => user.id !== userId)
      );
      // 故意写成同步删除. 体现同步
      // try {
      //   const response = yield fetch(`/api/users/${userId}`, {
      //     method: "DELETE",
      //   });
      //   if (!response.ok) {
      //     throw new Error("Failed to delete user");
      //   }
      // } catch (err) {
      //   console.error("Delete failed", err);
      // }
    }),
    // 异步action
    fetchTasks: flow(function* () {
      try {
        const response = yield fetch("/api/tasks");
        const tasks = yield response.json();
        self.tasks = castToSnapshot(tasks);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    }),
    fetchUsers: flow(function* () {
      try {
        const response = yield fetch("/api/users");
        const users = yield response.json();
        self.users = castToSnapshot(users);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    }),
    postTask: flow(function* (task: Instance<typeof Task>) {
      try {
        const response = yield fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });
        if (!response.ok) {
          throw new Error("Failed to create task");
        }
        self.tasks.push(task);
      } catch (err) {
        console.error("Post failed", err);
      }
    }),
    postUser: flow(function* (user: Instance<typeof User>) {
      try {
        const response = yield fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        if (!response.ok) {
          throw new Error("Failed to create user");
        }
        self.users.push(user);
      } catch (err) {}
    }),
    updateTask: flow(function* (
      task: Instance<typeof Task>,
      completed: boolean
    ) {
      self.tasks = castToSnapshot(
        self.tasks.map((t) => (t.id === task.id ? { ...task, completed } : t))
      );
      try {
        const response = yield fetch(`/api/tasks/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });
        if (!response.ok) {
          throw new Error("Failed to update task");
        }
        self.tasks = castToSnapshot(
          self.tasks.map((t) => (t.id === task.id ? task : t))
        );
      } catch (err) {
        console.error("Update failed", err);
      }
    }),
  }))
  .views((self) => ({
    get pendingTasks() {
      return self.tasks.filter((t) => !t.completed);
    },
  }));
