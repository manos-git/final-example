import React from "react";

const ProfileImage = ({ name }: { name: string }) => {
  const nameParts = name.split(" ");
  const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
  const lastNameInitial = nameParts[1] ? nameParts[1][0] : "";

  return (
    //<span className="user-profile-image">
    // for tailwind --> https://codepen.io/junchow/pen/QWybYrB?editors=1000 
    <div className="m-1 mr-2 w-12 h-12 relative flex justify-center items-center rounded-full bg-red-500 text-xl text-white uppercase"> 
      {firstNameInitial}
      {lastNameInitial}
    </div>
    //</span>
  );
};
export default ProfileImage;