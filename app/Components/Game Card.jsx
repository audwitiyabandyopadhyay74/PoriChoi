import React from "react";
// import Image from "next/image";

const Game = () => {
  return (
    <div className="w-[30vh] h-[30vh] bg-gray-400 rounded-md scale-150 p-1 flex justify-evenly items-center flex-col">
      <img
        src={
          "https://www.ytechb.com/wp-content/uploads/2022/08/free-android-tv-apps-12-768x396.webp"
        }
        className="w-full rounded-md"
      />
      <p className="p-1 capitalize text-center">this game is awesome.</p>
      <button className="bg-white rounded-md p-4 h-[4vh] w-[50%] flex justify-center items-center hover:scale-110 transition-opacity">
        Play{" "}
      </button>
    </div>
  );
};

export default Game;
