import { LuMenu } from "react-icons/lu";
import { FLOATING_BUTTON_BASE } from "../utils/constants";
import Float from "./Float";
import Navbar from "./Navbar";

const Menu = () => (
  <Float
    Icon={LuMenu}
    buttonClassName={`absolute top-4 start-4 z-50 ${FLOATING_BUTTON_BASE}`}
    containerClassName="absolute top-20 start-4 z-40 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-stone-200 bg-white p-4 shadow-xl"
  >
    <Navbar compact />
  </Float>
);

export default Menu;
