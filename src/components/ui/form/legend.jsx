import Proptypes from "prop-types";

import { cn } from "../../../utils";

export default function Legend({ className, children }) {
  return <legend className={cn("text-center font-bold", className)}>{children}</legend>;
}

Legend.propTypes = {
  className: Proptypes.string,
  children: Proptypes.oneOfType([Proptypes.arrayOf(Proptypes.node), Proptypes.node]).isRequired,
};
