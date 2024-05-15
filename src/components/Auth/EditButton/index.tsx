import { useAuth } from "@/context/AuthContext";
import { AiFillEdit } from "react-icons/ai";

interface Props {
  fn: () => void | Promise<void>;
}

const EditButton = ({ fn }: Props) => {
  const { user } = useAuth();
  if ((user?.permission || 0) > 1) {
    return <AiFillEdit className="w-8 h-8 cursor-pointer" onClick={fn} />;
  }

  return null;
};

export default EditButton;
