import { CgDanger } from "react-icons/cg";
import { IoIosInformationCircleOutline } from "react-icons/io";

const icon = {
  danger: <CgDanger color='red' aria-hidden='true' />,
  info: <IoIosInformationCircleOutline aria-hidden='true' />,
};

export type Iconkey = keyof typeof icon;

export const Icon = (type: Iconkey) => icon[type] ?? null;
