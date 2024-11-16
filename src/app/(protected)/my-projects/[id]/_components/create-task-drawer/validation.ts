import * as yup from "yup";

export const createTaskFormValidation = yup.object().shape({
  title: yup.string().required("Please enter a task title."),
  description: yup.string().optional(),
  status: yup.string().required("Please select a task status."),
  assigneeIds: yup.array().of(yup.string().required("Please select an assignee.")),
});

export type CreateTaskFormValue = yup.InferType<typeof createTaskFormValidation>;
