import { Checkbox } from "@/components/ui/checkbox";
import { useQueryProjectMembers } from "@/hooks/api/project/useQueryProjectMembers";
import { useClickOutside } from "@/hooks/use-click-outside";
import { ProjectMember } from "@/models/project-member";
import { LucideProps, Pencil, Tag, Text, User } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, useEffect, useRef, useState } from "react";
import { buildQuery } from "./utils";

interface FilterType {
  Icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  value: string | string[];
  onSelected?: (selected: FilterType) => void;
  onRemove?: () => void;
  label: string;
  shortcut?: string;
  loadOperand?: () => Promise<FilterType[]>;
  multiple?: boolean;
}

interface TaskFilterProps {
  id: string;
  onFilterChange?: (filter: Record<string, Record<string, string | string[]>>) => void;
}

export const TaskFilter = ({ id, onFilterChange }: TaskFilterProps) => {
  const [criteria, setCriteria] = useState<FilterType[]>([]);
  const lastCriteria = criteria[criteria.length - 1];
  const multipleSelectedFiltersRef = useRef<FilterType[]>([]);
  const { data: memberships = [] } = useQueryProjectMembers(id);
  const membershipsRef = useRef<ProjectMember[]>([]);
  useEffect(() => {
    membershipsRef.current = memberships;
  }, [memberships]);
  
  const leftOperand: FilterType[] = [
    {
      Icon: User,
      value: "assignee",
      onSelected: (selected: FilterType) => {
        setCriteria(prev => [...prev, selected]);
        setCurrentFilter(multipleOperators);
        inputRef.current?.focus();
      },
      onRemove: () => {
        setCriteria(prev => prev.slice(0, -1));
        setCurrentFilter(leftOperand);
      },
      label: "Assignee",
      loadOperand: async () => {
        const filters = membershipsRef.current.map((member) => ({
          value: member.userId,
          label: member.userName,
          onSelected: (selected: FilterType) => {
            setCriteria(prev => [...prev, selected]);
            setCurrentFilter(leftOperand);
            inputRef.current?.focus();
          },
          onRemove: () => {
            setCriteria(prev => prev.slice(0, -1));
            setCurrentFilter(filters);
          }
        }));

        return filters;
      },
    },
    {
      Icon: Tag,
      value: "status",
      onSelected: (selected: FilterType) => {
        setCriteria(prev => [...prev, selected]);
        setCurrentFilter(multipleOperators);
        inputRef.current?.focus();
      },
      onRemove: () => {
        setCriteria(prev => prev.slice(0, -1));
        setCurrentFilter(leftOperand);
      },
      label: "Status",
      loadOperand: async () => {
        const filters = [
          {
            value: "todo",
            label: "To do",
            onSelected: (selected: FilterType) => {
              setCriteria(prev => [...prev, selected]);
              setCurrentFilter(leftOperand);
              inputRef.current?.focus();
            },
            onRemove: () => {
              setCriteria(prev => prev.slice(0, -1));
              setCurrentFilter(filters);
            },
          },
          {
            value: "in-progress",
            label: "In progress",
            onSelected: (selected: FilterType) => {
              setCriteria(prev => [...prev, selected]);
              setCurrentFilter(leftOperand);
              inputRef.current?.focus();
            },
            onRemove: () => {
              setCriteria(prev => prev.slice(0, -1));
              setCurrentFilter(filters);
            },
          },
          {
            value: "to-review",
            label: "To review",
            onSelected: (selected: FilterType) => {
              setCriteria(prev => [...prev, selected]);
              setCurrentFilter(leftOperand);
              inputRef.current?.focus();
            },
            onRemove: () => {
              setCriteria(prev => prev.slice(0, -1));
              setCurrentFilter(filters);
            },
          },
          {
            value: "to-qa",
            label: "To QA",
            onSelected: (selected: FilterType) => {
              setCriteria(prev => [...prev, selected]);
              setCurrentFilter(leftOperand);
              inputRef.current?.focus();
            },
            onRemove: () => {
              setCriteria(prev => prev.slice(0, -1));
              setCurrentFilter(filters);
            },
          },
          {
            value: "done",
            label: "Done",
            onSelected: (selected: FilterType) => {
              setCriteria(prev => [...prev, selected]);
              setCurrentFilter(leftOperand);
              inputRef.current?.focus();
            },
            onRemove: () => {
              setCriteria(prev => prev.slice(0, -1));
              setCurrentFilter(filters);
            },
          },
        ];

        return filters;
      },
    },
    {
      Icon: Pencil,
      value: "author",
      onSelected: (selected: FilterType) => {
        setCriteria(prev => [...prev, selected]);
        setCurrentFilter(multipleOperators);
        inputRef.current?.focus();
      },
      onRemove: () => {
        setCriteria(prev => prev.slice(0, -1));
        setCurrentFilter(leftOperand);
      },
      label: "Author",
      loadOperand: async () => {
        const filters = memberships.map((member) => ({
          value: member.userId,
          label: member.userName,
          onSelected: (selected: FilterType) => {
            setCriteria(prev => [...prev, selected]);
            setCurrentFilter(leftOperand);
            inputRef.current?.focus();
          },
          onRemove: () => {
            setCriteria(prev => prev.slice(0, -1));
            setCurrentFilter(filters);
          },
        }));
        
        return filters;
      }
    },
    {
      Icon: Text,
      value: "title",
      onSelected: (selected: FilterType) => {
        setCriteria(prev => [...prev, selected]);
        setCurrentFilter(containOperators);
        inputRef.current?.focus();
      },
      onRemove: () => {
        setCriteria(prev => prev.slice(0, -1));
        setCurrentFilter(leftOperand);
      },
      label: "Title",
      loadOperand: async () => {
        return [];
      }
    }
  ]

  const multipleOperators: FilterType[] = [
    {
      value: "is",
      label: "is",
      onSelected: (selected: FilterType) => {
        setCriteria(prev => {
          const lastCriteria = prev[prev.length - 1];
          lastCriteria?.loadOperand?.().then((operands) => setCurrentFilter(operands));
          return [...prev, selected]
        });

        inputRef.current?.focus();
      },
      onRemove: () => {
        setCriteria(prev => prev.slice(0, -1));
        setCurrentFilter(multipleOperators);
      },
      shortcut: "=",
    },
    {
      value: "is_one_of",
      label: "is one of",
      onSelected: (selected: FilterType) => {
        setCriteria(prev => {
          const lastCriteria = prev[prev.length - 1];
          lastCriteria?.loadOperand?.().then((operands) => setCurrentFilter(operands));
          return [...prev, selected]
        });
        inputRef.current?.focus();
      },
      onRemove: () => {
        setCriteria(prev => prev.slice(0, -1));
        setCurrentFilter(multipleOperators);
      },
      shortcut: "||",
      multiple: true,
    },
    {
      value: "is_not_one_of",
      label: "is not one of",
      onSelected: (selected: FilterType) => {
        setCriteria(prev => {
          const lastCriteria = prev[prev.length - 1];
          lastCriteria?.loadOperand?.().then((operands) => setCurrentFilter(operands));
          return [...prev, selected]
        });
        inputRef.current?.focus();
      },
      onRemove: () => {
        setCriteria(prev => prev.slice(0, -1));
        setCurrentFilter(multipleOperators);
      },
      shortcut: "!=",
      multiple: true,
    },
  ];

  const containOperators: FilterType[] = [
    {
      value: "contains",
      label: "contains",
      onSelected: (selected: FilterType) => {
        setCriteria(prev => {
          let lastCriteria = prev[prev.length - 1];
          lastCriteria = Array.isArray(lastCriteria) ? lastCriteria[0] : lastCriteria;
          lastCriteria?.loadOperand?.().then((operands) => setCurrentFilter(operands));
          return [...prev, selected]
        });
        inputRef.current?.focus();
      },
      onRemove: () => {
        setCriteria(prev => prev.slice(0, -1));
        setCurrentFilter(containOperators);
      }
    },
    // {
    //   value: "does_not_contain",
    //   label: "does not contain",
    //   onSelected: (selected: FilterType) => {
    //     setCriteria(prev => {
    //       let lastCriteria = prev[prev.length - 1];
    //       lastCriteria = Array.isArray(lastCriteria) ? lastCriteria[0] : lastCriteria;
    //       lastCriteria?.loadOperand?.().then((operands) => setCurrentFilter(operands));
    //       return [...prev, selected]
    //     });
    //     inputRef.current?.focus();
    //   },
    //   onRemove: () => {
    //     setCriteria(prev => prev.slice(0, -1));
    //     setCurrentFilter(leftOperand);
    //   }
    // },
  ];

  const [currentFilter, setCurrentFilter] = useState<FilterType[]>(leftOperand);

  const inputContainerRef = useRef<HTMLDivElement>(null)
  const [focus, setFocus] = useState(false)
  useClickOutside(inputContainerRef, () => {
    setFocus(false);
    if (multipleSelectedFiltersRef.current.length > 0) {
      const filters = multipleSelectedFiltersRef.current;
      const filter = filters.reduce((first, second) => {
        return {
          ...first,
          value: Array.isArray(first.value) ? [...first.value, second.value] : [first.value, second.value],
          label: `${first.label}, ${second.label}`,
        } as FilterType;
      });

      setCriteria(prev => [...prev, filter]);
      setCurrentFilter(leftOperand);
      inputRef.current?.focus();
      multipleSelectedFiltersRef.current = [];
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && e.currentTarget.value === "") {
      const lastCriteria = criteria[criteria.length - 1];
      if (lastCriteria) {
        lastCriteria.onRemove?.();
      }
    }

    if (e.key === "Enter" && lastCriteria?.value !== "contains") {
      const arr = criteria.map((c) => c.value);
      onFilterChange?.(buildQuery(arr as string[]));
    }

    if (e.key === "Tab" || e.key === "Enter") {
      if (lastCriteria?.value === "contains") {
        const value = inputRef.current?.value ?? "";
        setCurrentFilter(leftOperand);
        setCriteria(prev => [
          ...prev,
          {
            value: value,
            label: value,
            onRemove: () => {
              setCriteria(prev => prev.slice(0, -1));
              setCurrentFilter([]);
            },
          }
        ])
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        e.preventDefault();
      }
    }
  }

  return (
    <div className="rounded px-1 bg-neutral-98 w-full border relative flex flex-row gap-2 items-center flex-wrap">
      {criteria.map((c, i) => (
        <div key={(Array.isArray(c.value) ? c.value.join(',') : c.value) + i} className="p-1 h-fit rounded bg-neutral-100 flex items-center gap-1">
          {c.Icon && <c.Icon className="size-4 text-neutral-600"/>}
          {c.label}
        </div>
      ))}
      <div className="relative flex-1" ref={inputContainerRef}>
        <input
          type="text"
          className="w-full p-2 rounded outline-none"
          placeholder="Search tasks"
          onFocus={() => setFocus(true)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
        {focus && (
          <div className="absolute top-full left-0 w-fit flex flex-col bg-white border rounded shadow-md z-[100]">
            {currentFilter.map((filter) => (
              <div
                key={Array.isArray(filter.value) ? filter.value.join("") : filter.value}
                className="p-2 flex items-center gap-1 text-sm font-medium hover:bg-neutral-100 cursor-pointer"
                onClick={() => {
                  if (!lastCriteria?.multiple) {
                    filter.onSelected?.(filter);
                    return;
                  }
                }}
              >
                {lastCriteria?.multiple && <Checkbox onCheckedChange={checked => {
                  if (checked) {
                    multipleSelectedFiltersRef.current.push(filter);
                  } else {
                    multipleSelectedFiltersRef.current.filter(f => f.value !== filter.value);
                  }
                }} />}
                {filter.Icon && <filter.Icon className="size-4 flex-shrink-0 text-neutral-600"/>}
                {filter.label}
                <div></div>
                {filter.shortcut && <span className="text-neutral-500 text-xs ml-auto">{filter.shortcut}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}