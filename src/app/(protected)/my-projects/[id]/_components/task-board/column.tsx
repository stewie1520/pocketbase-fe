import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ITask, Status } from "@/models/task"
import { Loader2, LucideProps, Plus } from "lucide-react"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { createContext, ForwardRefExoticComponent, RefAttributes, useContext, useEffect, useState } from "react"
import { CreateTaskDrawer } from "../create-task-drawer"
import { useBoardContext } from "./context"
import { useDroppable } from "@dnd-kit/core"
import InfiniteScroll from 'react-infinite-scroll-component';

const ColumnContext = createContext<{
  setHeaderComp: (headerComp: React.ReactNode) => void;
  status: Status;
  items: ITask[];
  hasMore?: boolean;
  onLoadMore?: () => void;
}>({
  setHeaderComp: () => {},
  items: [],
  status: "todo",
})

const useColumnContext = () => {
  return useContext(ColumnContext)
}

export const Column = ({
  children,
  status,
  items,
  hasMore,
  onLoadMore,
}: {
  children: React.ReactNode,
  status: Status;
  items: ITask[];
  hasMore?: boolean;
  onLoadMore?: () => void;
}) => {
  const [headerComp, setHeaderComp] = useState<React.ReactNode>(null)
  return (
    <SortableContext items={items.map(task => task.id)} strategy={verticalListSortingStrategy}>
      <ColumnContext.Provider value={{ setHeaderComp, status, items, hasMore, onLoadMore }}>
        <div className="relative flex flex-col gap-2 w-[320px] h-full flex-shrink-0">
          {headerComp}
          {children}
        </div>
      </ColumnContext.Provider>
    </SortableContext>
  )
}

const ColumnBadgeContext = createContext<{
  setBadgeComp: (badgeComp: React.ReactNode) => void
}>({
  setBadgeComp: () => {},
})

const useColumnBadgeContext = () => {
  return useContext(ColumnBadgeContext)
}

const ColumnTitleContext = createContext<{
  setTitleComp: (titleComp: React.ReactNode) => void
}>({
  setTitleComp: () => {},
})

const useColumnTitleContext = () => {
  return useContext(ColumnTitleContext)
}

export const ColumnHeader = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  const { setHeaderComp, status } = useColumnContext()
  const { projectId, onTaskCreated } = useBoardContext()
  const [titleComp, setTitleComp] = useState<React.ReactNode>(null)
  const [badgeComp, setBadgeComp] = useState<React.ReactNode>(null)

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHeaderComp(
      <ColumnTitleContext.Provider value={{ setTitleComp }}>
        <ColumnBadgeContext.Provider value={{ setBadgeComp }}>
          <div className="w-full p-2 flex items-center bg-white h-fit rounded-md border shadow-sm">
            <div className="flex flex-row justify-between w-full items-center">
              <div className="flex flex-row items-center gap-2">
                <Button className="size-fit p-1" variant="ghost" onClick={() => setOpen(true)}>
                  <Plus size={16} className="text-neutral-500" />
                </Button>
                {titleComp}
                {children}
              </div>
              {badgeComp}
            </div>
          </div>
        </ColumnBadgeContext.Provider>
      </ColumnTitleContext.Provider>
    )
  }, [children, titleComp, badgeComp])

  return (
    <CreateTaskDrawer
      open={open}
      onOpenChange={setOpen}
      projectId={projectId}
      status={status}
      onTaskCreated={onTaskCreated}
    />
  )
}

export const ColumnTitle = ({ title }: { title: string }) => {
  const { setTitleComp } = useColumnTitleContext();

  useEffect(() => {
    setTitleComp(<p className="font-medium text-base text-neutral-700">{title}</p>)
  }, [title])
  
  return null;
}

export const ColumnBadge = ({
  count,
  Icon,
  backgroundClass,
  textClass,
}: {
  count: number;
  Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
  backgroundClass: string;
  textClass: string;
}) => {
  const { setBadgeComp } = useColumnBadgeContext()

  useEffect(() => {
    setBadgeComp(
      <div className={cn("rounded-lg flex items-center gap-1 px-3 py-1", backgroundClass)}>
        <Icon size={12} className={textClass} />
        <p className={cn("text-xs font-medium", textClass)}>
          {count}
        </p>
      </div>
    )
  }, [Icon, backgroundClass, count, textClass]);

  return null;
}

export const ColumnBody = ({
  children
}: {
  children?: React.ReactNode
}) => {
  const { status, items, hasMore, onLoadMore } = useColumnContext();
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const className = cn("flex flex-col gap-2 flex-1 max-h-[600px] overflow-y-auto", {
    "border border-dashed border-neutral-200 bg-blue-100/30": isOver,
  })

  return (
      <InfiniteScroll
        dataLength={items.length}
        next={onLoadMore ?? (() => {})}
        hasMore={!!hasMore}
        loader={<div className="w-full items-center flex"><Loader2 className="size-3 animate-spin" /></div>}
      >
        <div ref={setNodeRef} className={className}>
          {children}
        </div>
      </InfiniteScroll>
  );
}