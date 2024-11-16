import { useQueryListProjectTasks } from "@/hooks/api/tasks/useQueryListProjectTasks";
import { isStatus, ITask, Status } from "@/models/task";
import { Check, Code, EditIcon, Glasses, Loader } from "lucide-react";

import { closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { ScrollContainer } from 'react-indiana-drag-scroll';
import 'react-indiana-drag-scroll/dist/style.css';
import { Column, ColumnBadge, ColumnBody, ColumnHeader, ColumnTitle } from "./column";
import { BoardContextProvider } from "./context";
import { Task } from "./task";
import { useUpdateTaskStatusAndOrder } from "@/hooks/api/tasks/useUpdateTaskStatusAndOrder";

type ColumnData = {
  status: Status,
  tasks: ITask[],
  total: number,
  hasMore?: boolean,
}

export const TaskBoard = ({ id }: { id: string }) => {
  const { mutateAsync: updateTaskStatusAndOrder } = useUpdateTaskStatusAndOrder();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  const [todo, setTodo] = useState<ColumnData>({
    status: "todo",
    tasks: [],
    hasMore: false,
    total: 0,
  });

  const [inProgress, setInProgress] = useState<ColumnData>({
    status: "in-progress",
    tasks: [],
    hasMore: false,
    total: 0,
  });

  const [toReview, setToReview] = useState<ColumnData>({
    status: "to-review",
    tasks: [],
    hasMore: false,
    total: 0,
  });

  const [toQA, setToQA] = useState<ColumnData>({
    status: "to-qa",
    tasks: [],
    hasMore: false,
    total: 0,
  });

  const [done, setDone] = useState<ColumnData>({
    status: "done",
    tasks: [],
    hasMore: false,
    total: 0,
  });

  const { data: listTodoTasks, hasNextPage: todoHasNextPage, fetchNextPage: fetchNextToDoTasks } = useQueryListProjectTasks("todo", id)
  useEffect(() => {
    setTodo(todo => ({
      ...todo,
      tasks: listTodoTasks?.pages.flatMap((page) => page.items) ?? [],
      total: listTodoTasks?.pages[0].totalItems ?? 0,
      hasMore: todoHasNextPage,
    }))
  }, [listTodoTasks])

  const { data: listInProgressTasks, hasNextPage: inProgressHasNextPage, fetchNextPage: fetchNextInProgressTasks } = useQueryListProjectTasks("in-progress", id)
  useEffect(() => {
    setInProgress(inProgress => ({
      ...inProgress,
      tasks: listInProgressTasks?.pages.flatMap((page) => page.items) ?? [],
      total: listInProgressTasks?.pages[0].totalItems ?? 0,
      hasMore: inProgressHasNextPage,
    }))
  }, [listInProgressTasks])

  const { data: listToReviewTasks, hasNextPage: toReviewHasNextPage, fetchNextPage: fetchNextToReviewTasks } = useQueryListProjectTasks("to-review", id)
  useEffect(() => {
    setToReview((toReview) => ({
      ...toReview,
      tasks: listToReviewTasks?.pages.flatMap((page) => page.items) ?? [],
      total: listToReviewTasks?.pages[0].totalItems ?? 0,
      hasMore: toReviewHasNextPage,
    }))
  }, [listToReviewTasks])

  const { data: listToQATasks, hasNextPage: toQAHasNextPage, fetchNextPage: fetchNextToQATasks } = useQueryListProjectTasks("to-qa", id)
  useEffect(() => {
    setToQA((qa) => ({
      ...qa,
      tasks: listToQATasks?.pages.flatMap((page) => page.items) ?? [],
      total: listToQATasks?.pages[0].totalItems ?? 0,
      hasMore: toQAHasNextPage,
    }))
  }, [listToQATasks])

  const { data: listDoneTasks, hasNextPage: doneHasNextPage, fetchNextPage: fetchNextDoneTasks } = useQueryListProjectTasks("done", id)
  useEffect(() => {
    setDone(done => ({
      ...done,
      tasks: listDoneTasks?.pages.flatMap((page) => page.items) ?? [],
      total: listDoneTasks?.pages[0].totalItems ?? 0,
      hasMore: doneHasNextPage,
    }))
  }, [listDoneTasks])


  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = [
      todo.tasks,
      inProgress.tasks,
      toReview.tasks,
      toQA.tasks,
      done.tasks,
    ]
      .flatMap((col) => col)
      .find((task) => task.id === active.id);
    
    if (task) {
      setActiveTask(task);
    }
  };

  const getColumnSetter = (column: ColumnData) => {
    switch (column) {
      case todo:
        return setTodo;
      case inProgress:
        return setInProgress;
      case toReview:
        return setToReview;
      case toQA:
        return setToQA;
      default:
        return setDone;
    }
  }

  const getColumnByStatus = (status: Status) => {
    switch (status) {
      case "todo":
        return todo;
      case "in-progress":
        return inProgress;
      case "to-review":
        return toReview;
      case "to-qa":
        return toQA;
      case "done":
        return done;
    }
  }

  /**
   * Calculate the order of the task based on the next and previous task.
   * Useful when dragging a task around the board
   */
  const getOrder = (nextTask: ITask | undefined, previousTask: ITask | undefined) => {
    if (!nextTask && !previousTask) return 1;
    if (!nextTask) return previousTask!.order + 1;
    if (!previousTask) return nextTask!.order - 1;
    return (nextTask!.order + previousTask!.order) / 2;
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = [
      todo.tasks,
      inProgress.tasks,
      toReview.tasks,
      toQA.tasks,
      done.tasks,
    ]
      .flatMap((col) => col)
      .find((task) => task.id === active.id);
    if (!activeTask) return;
    const columns = [
      todo,
      inProgress,
      toReview,
      toQA,
      done,
    ];

    const activeColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === active.id)
    );
    
    
    let overColumn: ColumnData | undefined = undefined;
    if (isStatus(over.id)) {
      overColumn = getColumnByStatus(over.id);
    } else {
      overColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === over.id)
      );
    }

    if (!activeColumn || !overColumn) return;

    if (activeColumn === overColumn) {
      const oldIndex = activeColumn.tasks.findIndex(
        (task) => task.id === active.id
      );
      const newIndex = activeColumn.tasks.findIndex(
        (task) => task.id === over.id
      );

      const newTasks = arrayMove(activeColumn.tasks, oldIndex, newIndex);
      getColumnSetter(activeColumn)({ ...activeColumn, tasks: newTasks });
      
      const nextTask = newTasks[newIndex + 1];
      const previousTask = newTasks[newIndex - 1];
      
      updateTaskStatusAndOrder({
        projectId: id,
        taskId: activeTask.id,
        status: activeTask.status,
        order: getOrder(nextTask, previousTask),
      });
    } else {
      const activeIndex = activeColumn.tasks.findIndex(
        (task) => task.id === active.id
      );
      const overIndex = overColumn.tasks.findIndex(
        (task) => task.id === over.id
      );

      const newActiveColumnTasks = [...activeColumn.tasks];
      newActiveColumnTasks.splice(activeIndex, 1);

      const newOverColumnTasks = [...overColumn.tasks];
      newOverColumnTasks.splice(overIndex, 0, activeTask);

      getColumnSetter(activeColumn)({ ...activeColumn, total: activeColumn.total - 1,  tasks: newActiveColumnTasks });
      getColumnSetter(overColumn)({ ...overColumn, total: overColumn.total + 1, tasks: newOverColumnTasks });

      const nextTask = newOverColumnTasks[overIndex + 2];
      const previousTask = newOverColumnTasks[overIndex];

      updateTaskStatusAndOrder({
        projectId: id,
        taskId: activeTask.id,
        status: overColumn.status,
        order: getOrder(nextTask, previousTask),
      });
    }

    setActiveTask(null);
  };

  const onTaskCreated = (task: ITask) => {
    const column = getColumnByStatus(task.status);
    getColumnSetter(column)({ ...column, tasks: [...column.tasks, task], total: column.total + 1 });
  }

  return (
    <ScrollContainer
      className="size-full p-4 gap-4 border rounded-md bg-neutral-50 flex flex-row flex-nowrap"
      mouseScroll={{ ignoreElements: '[prevent-drag-scroll]' }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <DragOverlay>
          {activeTask ? <Task task={activeTask} /> : null}
        </DragOverlay>          
        <BoardContextProvider value={{ projectId: id, onTaskCreated }}>
          <Column status="todo" items={todo.tasks} hasMore={todo.hasMore} onLoadMore={fetchNextToDoTasks}>
            <ColumnHeader>
              <ColumnTitle title="To Do" />
              <ColumnBadge count={todo.total} Icon={EditIcon} backgroundClass="bg-red-100/30" textClass="text-red-600" />
            </ColumnHeader>
            <ColumnBody>
              {todo.tasks.map((task) => (
                <Task key={task.id} task={task}/>
              ))}
            </ColumnBody>
          </Column>

          <Column status="in-progress" items={inProgress.tasks} hasMore={inProgress.hasMore} onLoadMore={fetchNextInProgressTasks}>
            <ColumnHeader>
              <ColumnTitle title="In Progress" />
              <ColumnBadge count={inProgress.total} Icon={Loader} backgroundClass="bg-blue-100/30" textClass="text-blue-600" />
            </ColumnHeader>
            <ColumnBody>
              {inProgress.tasks.map((task) => (
                <Task key={task.id} task={task}/>
              ))}
            </ColumnBody>
          </Column>


          <Column status="to-review" items={toReview.tasks} hasMore={toReview.hasMore} onLoadMore={fetchNextToReviewTasks}>
            <ColumnHeader>
              <ColumnTitle title="To Review" />
              <ColumnBadge count={toReview.total} Icon={Code} backgroundClass="bg-yellow-100/30" textClass="text-yellow-600" />
            </ColumnHeader>
            <ColumnBody>
              {toReview.tasks.map((task) => (
                <Task key={task.id} task={task}/>
              ))}
            </ColumnBody>
          </Column>

          <Column status="to-qa" items={toQA.tasks} hasMore={toQA.hasMore} onLoadMore={fetchNextToQATasks}>
            <ColumnHeader>
              <ColumnTitle title="To QA" />
              <ColumnBadge count={toQA.total} Icon={Glasses} backgroundClass="bg-orange-100/30" textClass="text-orange-600" />
            </ColumnHeader>
            <ColumnBody>
              {toQA.tasks.map((task) => (
                <Task key={task.id} task={task}/>
              ))}
            </ColumnBody>
          </Column>

          <Column status="done" items={done.tasks} hasMore={done.hasMore} onLoadMore={fetchNextDoneTasks}>
            <ColumnHeader>
              <ColumnTitle title="Done" />
              <ColumnBadge count={done.total} Icon={Check} backgroundClass="bg-green-100/30" textClass="text-green-600" />
            </ColumnHeader>
            <ColumnBody>
              {done.tasks.map((task) => (
                <Task key={task.id} task={task}/>
              ))}
            </ColumnBody>
          </Column>
        </BoardContextProvider>
      </DndContext>
    </ScrollContainer>
  )
}