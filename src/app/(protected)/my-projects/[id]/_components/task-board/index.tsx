import { useOptimisticAddTask, useQueryListProjectTasks } from "@/hooks/api/tasks/useQueryListProjectTasks";
import { ITask } from "@/models/task";
import { Check, Code, EditIcon, Glasses, Loader } from "lucide-react";

import { useEffect, useState } from "react";
import { Column, ColumnBadge, ColumnBody, ColumnHeader, ColumnTitle } from "./column";
import { BoardContextProvider } from "./context";
import { Task } from "./task";

type ColumnData = {
  tasks: ITask[],
  total: number,
}

export const TaskBoard = ({ id }: { id: string }) => {
  const [todo, setTodo] = useState<ColumnData>({
    tasks: [],
    total: 0,
  });

  const [inProgress, setInProgress] = useState<ColumnData>({
    tasks: [],
    total: 0,
  });

  const [toReview, setToReview] = useState<ColumnData>({
    tasks: [],
    total: 0,
  });

  const [toQA, setToQA] = useState<ColumnData>({
    tasks: [],
    total: 0,
  });

  const [done, setDone] = useState<ColumnData>({
    tasks: [],
    total: 0,
  });

  const { data: listTodoTasks } = useQueryListProjectTasks("todo", id)
  useEffect(() => {
    setTodo({
      tasks: listTodoTasks?.pages.flatMap((page) => page.items) ?? [],
      total: listTodoTasks?.pages[0].totalItems ?? 0,
    })
  }, [listTodoTasks])

  const { data: listInProgressTasks } = useQueryListProjectTasks("in-progress", id)
  useEffect(() => {
    setInProgress({
      tasks: listInProgressTasks?.pages.flatMap((page) => page.items) ?? [],
      total: listInProgressTasks?.pages[0].totalItems ?? 0,
    })
  }, [listInProgressTasks])

  const { data: listToReviewTasks } = useQueryListProjectTasks("to-review", id)
  useEffect(() => {
    setToReview({
      tasks: listToReviewTasks?.pages.flatMap((page) => page.items) ?? [],
      total: listToReviewTasks?.pages[0].totalItems ?? 0,
    })
  }, [listToReviewTasks])

  const { data: listToQATasks } = useQueryListProjectTasks("to-qa", id)
  useEffect(() => {
    setToQA({
      tasks: listToQATasks?.pages.flatMap((page) => page.items) ?? [],
      total: listToQATasks?.pages[0].totalItems ?? 0,
    })
  }, [listToQATasks])

  const { data: listDoneTasks } = useQueryListProjectTasks("done", id)
  useEffect(() => {
    setDone({
      tasks: listDoneTasks?.pages.flatMap((page) => page.items) ?? [],
      total: listDoneTasks?.pages[0].totalItems ?? 0,
    })
  }, [listDoneTasks])
  
  const onTaskCreated = useOptimisticAddTask()

  return (
    <div className="w-full max-w-full h-full p-4 gap-4 border rounded-md bg-neutral-50 overflow-auto flex flex-row flex-nowrap">
      <BoardContextProvider value={{ projectId: id, onTaskCreated }}>

        <Column status="todo" items={todo.tasks}>
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

        <Column status="in-progress" items={inProgress.tasks}>
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


        <Column status="to-review" items={toReview.tasks}>
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

        <Column status="to-qa" items={toQA.tasks}>
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

        <Column status="done" items={done.tasks}>
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
    </div>
  )
}