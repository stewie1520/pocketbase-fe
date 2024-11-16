import * as yup from "yup";
import { Status, StatusValues } from "@/models/task";

export const createTaskFormValidation = yup.object().shape({
  title: yup.string().required("Please enter a task title."),
  description: yup.string().optional(),
  status: yup.mixed<Status>().oneOf(StatusValues).required("Please select a status."),
  assigneeIds: yup.array().of(yup.string().required("Please select an assignee.")),
});

export type CreateTaskFormValue = yup.InferType<typeof createTaskFormValidation>;
