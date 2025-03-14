import { useEffect } from "react";

// Custom hook to load the Facebook SDK
export function useFacebookSDK() {
  useEffect(() => {
    // Check if Facebook SDK is already loaded
    if (window.FB) return;

    // Dynamically load the Facebook SDK script
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);

      js.onload = () => {
        window.fbAsyncInit = function () {
          FB.init({
            appId: '1229134612097733', // Replace with your Facebook App ID
            cookie: true,
            xfbml: true,
            version: 'v11.0',
          });
        };
      };
    })(document, 'script', 'facebook-jssdk');
  }, []);
}
