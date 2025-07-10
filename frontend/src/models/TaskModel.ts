import { types, flow, castToSnapshot, type Instance } from "mobx-state-tree";

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
  }))
  .views((self) => ({
    get pendingTasks() {
      return self.tasks.filter((t) => !t.completed);
    },
  }));
