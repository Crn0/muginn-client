import PropTypes from "prop-types";
import { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { cn } from "../../../utils";

export default function Form({ schema, onSubmit, className, id, children, isCurried, ...options }) {
  const methods = useForm({ ...options, resolver: zodResolver(schema) });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(isCurried ? onSubmit(methods) : onSubmit)}
        className={cn(className)}
        data-testid={id}
        aria-label='form'
      >
        {typeof children === "function" ? children(methods) : children}
      </form>
    </FormProvider>
  );
}

const formPropTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  options: PropTypes.exact({
    mode: PropTypes.oneOf(["onChange", "onBlue", "onSubmit", "onTouched", "all"]),
    reValidateMode: PropTypes.oneOf(["onChange", "onBlue", "onSubmit"]),
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
  schema: PropTypes.instanceOf(ZodSchema).isRequired,
  isCurried: PropTypes.bool,
};

Form.propTypes = formPropTypes;
