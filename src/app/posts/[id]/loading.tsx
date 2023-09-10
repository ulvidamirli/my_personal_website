const Loading = () => {
  return (
    <div className="max-w-screen-md mx-auto px-4 my-20 animate-pulse">
      <div className="h-10 w-full bg-neutral-400 mb-10 rounded-sm" />
      {Array.from({ length: 3 }).map((_, i) => (
        <>
          <div className="h-4 w-full bg-neutral-400 mb-3 rounded-sm" />
          <div className="h-4 w-10/12 bg-neutral-400 mb-3 rounded-sm" />
          <div className="h-4 w-11/12 bg-neutral-400 mb-3 rounded-sm" />
        </>
      ))}
    </div>
  );
};

export default Loading;
