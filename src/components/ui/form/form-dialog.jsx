import PropTypes from "prop-types";
import { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { cn } from "../../../utils";
import { useDisclosureWithClickOutside } from "../../../hooks";

export default function FormDialog({
  title,
  descriptions,
  id,
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
  const ref = useRef();
  const triggerRef = useRef();
  const methods = useForm({ ...options, resolver: zodResolver(schema) });
  const { isOpen, open, close } = useDisclosureWithClickOutside(initial, ref, triggerRef);

  const buttonTrigger = renderButtonTrigger({
    triggerRef,
    onClick: () => open(),
  });

  const buttonCancel = renderButtonCancel({
    onClick: () => close(),
  });

  const buttonSubmit = renderButtonSubmit({
    close,
  });

  useEffect(() => {
    if (Object.entries(methods.formState.errors).length === 0 && done) {
      close();
    }
  }, [close, done, methods.formState.errors]);

  return (
    <>
      {!isOpen && buttonTrigger}

      {isOpen && (
        <div role='dialog' aria-modal='true'>
          <div>
            <h2>{title}</h2>

            {descriptions?.map((desc) => (
              <div key={desc}>
                <span>{desc}</span>
              </div>
            ))}
          </div>

          <FormProvider {...methods}>
            <form
              onSubmit={
                isCurried ? methods.handleSubmit(onSubmit(methods)) : methods.handleSubmit(onSubmit)
              }
              className={cn(className)}
              id={id}
              aria-label='form'
              ref={ref}
            >
              <div>{children}</div>
              <div>
                {buttonCancel}
                {buttonSubmit}
              </div>
            </form>
          </FormProvider>
        </div>
      )}
    </>
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
