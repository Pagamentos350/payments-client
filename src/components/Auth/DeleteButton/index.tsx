import { useAuth } from "@/context/AuthContext";

interface Props {
  userPermission?: string;
  fn: () => Promise<void>;
}

const DeleteButton = ({ userPermission = "0", fn }: Props) => {
  const { user } = useAuth();

  if (userPermission !== "3" && (user?.permission || 0) > 1)
    return (
      <button
        onClick={fn}
        className="btn !max-w-[200px] text-white !bg-red-600 hover:!bg-red-800"
      >
        Delete
      </button>
    );
};

export default DeleteButton;
