import PropTypes from "prop-types";
import { useState } from "react";

import { cn } from "../../../utils";

export default function LazyImage({ mainImage, lazyImage, className, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn("max-w-full bg-cover bg-center", className)}
      style={{ backgroundImage: `url(${lazyImage})` }}
    >
      <img
        className={cn(
          "block aspect-square h-full w-full object-cover object-center opacity-0 transition-opacity delay-150 ease-in-out",
          loaded && "opacity-100"
        )}
        src={mainImage}
        alt={alt ?? ""}
        onLoad={() => setLoaded(true)}
        loading='lazy'
      />
    </div>
  );
}

LazyImage.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  mainImage: PropTypes.string.isRequired,
  lazyImage: PropTypes.string.isRequired,
};
