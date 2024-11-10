import * as yup from "yup";

export const projectFormSchema = yup.object().shape({
  avatar: yup.mixed<File>().required("Please upload a project avatar."),
  name: yup.string().required("Please enter a project name."),
  description: yup.string().required("Please enter a project description."),
});

export const updateProjectFormSchema = yup.object().shape({
  avatar: yup.mixed<File>().optional(),
  name: yup.string().required("Please enter a project name."),
  description: yup.string().required("Please enter a project description."),
});


export type ProjectFormValues = yup.InferType<typeof projectFormSchema>;
export type UpdateProjectFormValues = yup.InferType<typeof updateProjectFormSchema>;
