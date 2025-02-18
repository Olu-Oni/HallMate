const DoorIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0H23.0707V23.1069H0V0Z" fill="white" fillOpacity="0.01" />
      <path
        d="M2.88379 3.85234V19.257L11.6314 21.1825V1.92676L2.88379 3.85234Z"
        className="doorImg"
        strokeWidth="2.15176"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6315 3.85156H20.1868V19.2562H11.6315"
        className="doorImg"
        fill="none"
        strokeWidth="2.15176"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.65137 10.5918V12.5174"
        className="doorKnob"
        strokeWidth="2.15176"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DoorIcon;
