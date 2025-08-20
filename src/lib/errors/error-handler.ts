import { RedirectError } from "@/errors";

import type { CustomError } from "@/errors";

import { debug } from "@/lib/debug";

export const errorHandler = <T extends CustomError>(error: T): T => {
  if (error.is(RedirectError)) {
    error.redirect();

    return error;
  }

  if (error.isOperational) {
    debug(String(error));

    return error;
  }

  throw error;
};
