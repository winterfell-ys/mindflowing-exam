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
      } catch (err) {}
    }),
    deleteTask: flow(function* (taskId: number) {
      try {
        const response = yield fetch(`/api/tasks/${taskId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete task");
        }
      } catch (err) {
        console.error("Delete failed", err);
      }
    }),
    deleteUser: flow(function* (userId: number) {
      try {
        const response = yield fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
      } catch (err) {
        console.error("Delete failed", err);
      }
    }),
  }))
  .views((self) => ({
    get pendingTasks() {
      return self.tasks.filter((t) => !t.completed);
    },
  }));
