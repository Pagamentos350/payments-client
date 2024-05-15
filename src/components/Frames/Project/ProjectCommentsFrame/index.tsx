import { IComments, IProjectDataType } from "@/@types";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectsContext";
import { useUsers } from "@/context/UsersContext";
import { formatItem } from "@/services/format";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

interface Props {
  project: IProjectDataType;
}

const ProjectCommentsFrame = ({ project }: Props) => {
  const { updateProjects } = useProjects();
  const { findUser } = useUsers();
  const { user } = useAuth();
  const [text, setText] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const sendComment = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setSubmitting(true);
      const commentsCopy = JSON.parse(JSON.stringify(project.comments));
      const newComments: IComments[] = [
        ...commentsCopy,
        { user_id: user.uid, date: Timestamp.now(), text },
      ];
      await updateProjects({ id: project.id, comments: newComments });
    } catch (err: any) {
      console.error(err);
    } finally {
      setText("");
      setTimeout(() => setSubmitting(false), 1000);
    }
  };

  return (
    <div className="frame-container">
      {project.comments.map((e: IComments, index: number) => (
        <div className="flex w-full gap-4" key={index}>
          <div>
            <FaUserAlt className="w-12 h-12" />
          </div>
          <div>
            <div className="tiny">{formatItem(e.date as any, "comments")}</div>
            <div>{findUser(e.user_id)?.name}</div>
            <div>{e.text}</div>
          </div>
        </div>
      ))}
      <div className="w-full relative mt-12">
        <form onSubmit={sendComment}>
          <input
            type="text"
            value={text}
            onChange={evt => setText(evt.target.value)}
            className="w-full h-[32px] text-[20px] bg-transparent border-b border-b-blue-900 dark:border-b-white focus:outline-none"
            placeholder="Deixe seu comentário"
          />

          <button
            type="submit"
            className="absolute top-[0%] right-3 w-8 h-8"
            disabled={submitting}
          >
            {submitting ? (
              <div className="loading-circle !w-8 !h-8 after:hidden"></div>
            ) : (
              <IoMdSend
                onClick={sendComment}
                className="  cursor-pointer w-8 h-8 text-blue-900"
              />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectCommentsFrame;
