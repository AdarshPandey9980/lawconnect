import { useState } from "react";

const lawFirms = [
  "Baker Law",
  "Latham LLP",
  "DLA Legal",
  "Skadden",
  "Ellis & Co"
];

const CompanyName = ({ name, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className="flex items-center justify-center flex-1 h-32 px-12"
      key={index}
    >
      <div
        className="transform transition-all duration-500 ease-in-out hover:cursor-pointer text-3xl font-bold"
        style={{
          transform: isHovered ? "rotate(360deg)" : "rotate(0deg)",
          WebkitTextStroke: '1px rgb(0, 0, 0)',
          WebkitTextFillColor: 'transparent'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {name}
      </div>
    </li>
  );
};

const LawFirmNames = ({ className }) => {
  return (
    <div className={className}>
      <h2 className="text-center text-2xl mb-8 mt-16 text-gray-500">
        Trusted by Leading Law Firms
      </h2>

      <div className="overflow-hidden py-4">
        <ul
          className="flex animate-infinite-scroll items-center justify-around"
          style={{ minWidth: "200%" }}
        >
          {lawFirms.map((name, index) => (
            <CompanyName key={index} name={name} index={index} />
          ))}
          {lawFirms.map((name, index) => (
            <CompanyName
              key={`duplicate-${index}`}
              name={name}
              index={index}
            />
          ))}
        </ul>
      </div>

      <style jsx>{`
        @keyframes scrollRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-infinite-scroll {
          animation: scrollRight 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LawFirmNames;