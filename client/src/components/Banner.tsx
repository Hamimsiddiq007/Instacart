import { useState } from "react";

const Banner = () => {

    const [bannerVisible, setBannerVisible] = useState(() => {
      return sessionStorage.getItem("banner_dismissed") !== "true";
    });

    const dismissBanner = () => {
      setBannerVisible(false);
      sessionStorage.setItem("banner_dismissed", "true");
    };

  return (
    <div>
      {bannerVisible && (
        <div className="">
          
        </div>
      )}
    </div>
  )
}

export default Banner
