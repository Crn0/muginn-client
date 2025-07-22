import PropTypes from "prop-types";
import { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { useDisclosureWithClickOutside } from "../../../hooks";
import { Dialog } from "../dialog";

export default function FormDialog({
  title,
  descriptions,
  id,
  parentId,
  className,
  schema,
  onSubmit,
  renderButtonTrigger,
  renderButtonCancel,
  renderButtonSubmit,
  children,
  initial = false,
  done = false,
  isCurried = false,
  ...options
}) {
  const dialogRef = useRef();
  const triggerRef = useRef();
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
                <div key={description} className='text-center text-xs'>
                  {description}
                </div>
              ))}
            </div>
          )}
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={
              isCurried ? methods.handleSubmit(onSubmit(methods)) : methods.handleSubmit(onSubmit)
            }
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

FormDialog.propTypes = {
  title: PropTypes.string.isRequired,
  descriptions: PropTypes.arrayOf(PropTypes.string),
  renderButtonTrigger: PropTypes.func.isRequired,
  renderButtonCancel: PropTypes.func.isRequired,
  renderButtonSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  parentId: PropTypes.string.isRequired,
  schema: PropTypes.instanceOf(ZodSchema).isRequired,
  initial: PropTypes.bool,
  done: PropTypes.bool,
  isCurried: PropTypes.bool,
  options: PropTypes.exact({
    mode: PropTypes.oneOf(["onChange", "onBlur", "onSubmit", "onTouched", "all"]),
    reValidateMode: PropTypes.oneOf(["onChange", "onBlur", "onSubmit"]),
    defaultValues: PropTypes.objectOf(PropTypes.string),
    values: PropTypes.exact({ defaultValues: PropTypes.objectOf(PropTypes.string) }),
    resetOptions: PropTypes.exact({
      keepDirtyValues: PropTypes.bool,
      keepErrors: PropTypes.bool,
    }),
    criteriaMode: PropTypes.oneOf(["firstError", "all"]),
    shouldFocusError: PropTypes.bool,
    delayError: PropTypes.number,
    shouldUseNativeValidation: PropTypes.bool,
    shouldUnregister: PropTypes.bool,
    disabled: PropTypes.bool,
  }),
};
