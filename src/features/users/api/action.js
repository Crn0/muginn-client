import { updateMainProfileAction } from "./update-main-profile";
import { updateAccountProfileAction } from "./update-account-profile";

const clientAction =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.clone().formData();

    const intent = formData.get("intent");

    if (intent.includes("mainProfile")) {
      return updateMainProfileAction(queryClient)(formData);
    }

    if (intent.includes("accountProfile")) {
      return updateAccountProfileAction(queryClient)(formData);
    }

    throw new Error("Invalid intent");
  };

export default clientAction;
