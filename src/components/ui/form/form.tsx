import type { PropsWithChildren } from "react";
import z, { type Schema as ZSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  FormProvider,
  type UseFormProps,
  type SubmitHandler,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/utils";

export interface FormProps<Schema, TFormValues extends FieldValues>
  extends PropsWithChildren,
    UseFormProps {
  id: string;
  schema: Schema;
  onSubmit: SubmitHandler<TFormValues>;
  className?: string;
  testId?: string;
}

export function Form<Schema extends ZSchema, TFormValues extends FieldValues = z.infer<Schema>>({
  id,
  schema,
  onSubmit,
  testId,
  children,
  className = "",
  ...options
}: FormProps<Schema, TFormValues>) {
  const methods = useForm({ ...options, resolver: zodResolver(schema) });

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn(className)}
        data-testid={testId}
        aria-label='form'
      >
        {children}
      </form>
    </FormProvider>
  );
}
