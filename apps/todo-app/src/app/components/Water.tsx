import React from 'react';

function Water({
  cups,
  water,
  setWater,
}: {
  cups: number;
  water: number;
  setWater: any;
}) {
  const count = [...Array(cups).keys()];
  return (
    <div className="flex items-center space-x-2">
      {count.map((cup, index) => (
        <div className="w-8" key={index} onClick={() => setWater(index + 1)}>
          <svg
            className={`w-8 h-8 ${
              index <= water - 1
                ? 'text-cyan-200'
                : 'dark:text-gray-500 opacity-30'
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 22"
          >
            <path d="M12 22q-3.425 0-5.713-2.35T4 13.8q0-1.55.7-3.1t1.75-2.975Q7.5 6.3 8.725 5.05T11 2.875q.2-.2.463-.287T12 2.5q.275 0 .537.088t.463.287q1.05.925 2.275 2.175t2.275 2.675Q18.6 9.15 19.3 10.7t.7 3.1q0 3.5-2.288 5.85T12 22Zm.275-3q.3-.025.513-.238T13 18.25q0-.35-.225-.563T12.2 17.5q-1.025.075-2.175-.563t-1.45-2.312q-.05-.275-.262-.45T7.825 14q-.35 0-.575.263t-.15.612q.425 2.275 2 3.25t3.175.875Z" />
          </svg>
          <span className="mt-[-5px] w-8 text-center text-xs">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

export default Water;
