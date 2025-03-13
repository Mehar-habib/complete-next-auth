import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

export default function Social() {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-[50%] cursor-pointer"
        variant="outline"
        onClick={() => {}}
      >
        <FcGoogle className="h-6 w-6" />
      </Button>

      <Button
        size="lg"
        className="w-[50%] cursor-pointer"
        variant="outline"
        onClick={() => {}}
      >
        <FaGithub className="h-6 w-6" />
      </Button>
    </div>
  );
}
