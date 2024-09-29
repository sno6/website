import { useEffect } from "react";
import styles from "../styles/utils.module.css";

export const useBanner = () => {
  // Write the banner to body so we don't get the fadein effect.
  useEffect(() => {
    const bannerDiv = document.createElement("div");
    bannerDiv.className = styles.banner;
    bannerDiv.onclick = () => (window.location.href = "https://klaroapp.com");

    const iconSpan = document.createElement("span");
    iconSpan.className = styles.bannerIcon;

    bannerDiv.appendChild(iconSpan);
    document.body.appendChild(bannerDiv);
  }, []);
};
