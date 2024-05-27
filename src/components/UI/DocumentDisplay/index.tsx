interface Props {
  doc: string;
}

const DocumentDisplay = ({ doc }: Props) => {
  return (
    <div className="relative overflow-hidden w-[200px] h-[200px]">
      <embed
        src={doc as unknown as string}
        className="w-full h-full overflow-hidden scale-150"
      />
      <div className="w-full h-full  z-10 bg-[#00000084] absolute inset-0">
        <div
          onClick={() => {
            open(doc as unknown as string);
          }}
          className="w-full text-white dark:text-white h-[20%] bg-[#000000aa] px-4 cursor-pointer bottom-0 absolute z-10"
        >
          Clique aqui para abrir
        </div>
      </div>
    </div>
  );
};

export default DocumentDisplay;
