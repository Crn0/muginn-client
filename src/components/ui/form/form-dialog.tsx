import z, { type Schema as ZSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, type PropsWithChildren, type ReactNode, type RefObject } from "react";
import {
  useForm,
  FormProvider,
  type SubmitHandler,
  type FieldValues,
  type UseFormProps,
} from "react-hook-form";

import { useDisclosureWithClickOutside, type TDisclosure } from "@/hooks";
import { Dialog } from "@/components/ui/dialog";

export interface FormDialogProps<Schema, TFormDialogValues extends FieldValues>
  extends PropsWithChildren {
  id: string;
  parentId: string;
  title: string;
  schema: Schema;
  onSubmit: SubmitHandler<TFormDialogValues>;

  descriptions: ReactNode[];
  className?: string;
  done: boolean;
  initial?: boolean;
  options?: UseFormProps;

  renderButtonTrigger: (opts: {
    triggerRef: RefObject<HTMLButtonElement>;
    onClick: () => void;
  }) => ReactNode;
  renderButtonCancel: (opts: { onClick: () => void } & TDisclosure) => ReactNode;
  renderButtonSubmit: (opts: {} & TDisclosure) => ReactNode;
}

export function FormDialog<
  Schema extends ZSchema,
  TFormDialogValues extends FieldValues = z.infer<Schema>,
>({
  id,
  parentId,
  title,
  descriptions,
  schema,
  options,
  onSubmit,
  renderButtonTrigger,
  renderButtonCancel,
  renderButtonSubmit,
  children,
  className = "",
  initial = false,
  done = false,
}: FormDialogProps<Schema, TFormDialogValues>) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const methods = useForm({ ...options, resolver: zodResolver(schema) });
  const disclosure = useDisclosureWithClickOutside(initial, dialogRef, triggerRef);

  const buttonTrigger = renderButtonTrigger({
    triggerRef,
    ...disclosure,
    onClick: () => disclosure.open(),
  });

  const buttonCancel = renderButtonCancel({
    ...disclosure,
    onClick: () => disclosure.close(),
  });

  const buttonSubmit = renderButtonSubmit({
    ...disclosure,
  });

  useEffect(() => {
    if (Object.entries(methods.formState.errors).length === 0 && done) {
      disclosure.close();
    }
  }, [done, disclosure, methods.formState.errors]);

  return (
    <Dialog
      parentId={parentId}
      buttonTrigger={buttonTrigger}
      ref={dialogRef}
      open={disclosure.isOpen}
      className={className}
    >
      <>
        <div className='grid'>
          <div className='flex items-center justify-center'>
            <h2>{title}</h2>
          </div>

          {descriptions?.length > 0 && (
            <div>
              {descriptions.map((description) => (
                <div key={description?.toString()} className='text-center text-xs'>
                  {description}
                </div>
              ))}
            </div>
          )}
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            id={id}
            aria-label='form'
            className='grid place-content-center-safe place-items-center-safe gap-10'
          >
            <div className='grid place-content-center-safe place-items-center-safe gap-5'>
              {children}
            </div>
            <div className='flex items-center-safe justify-center-safe gap-5'>
              {buttonCancel}
              {buttonSubmit}
            </div>
          </form>
        </FormProvider>
      </>
    </Dialog>
  );
}
