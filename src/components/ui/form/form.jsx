import PropTypes from "prop-types";
import { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function Form({ schema, onSubmit, className, id, options, children }) {
  const methods = useForm({ ...options, resolver: zodResolver(schema) });

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className={className} id={id} aria-label='form'>
      {children(methods)}
    </form>
  );
}

const formPropTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
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
};

Form.propTypes = formPropTypes;
