//importing dotenv to use environment variables
import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

// Setting authentication parameters & headers
const unsplashApiImg = axios.create({
  baseURL: "https://api.unsplash.com",
});

// Accessing Unsplash API for random images
const getUnsplashApiImg = async () => {
  const response = await unsplashApiImg.get("/photos/random", {
    params: { query: "campground" },
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      "Accept-Version": "v1",
    },
  });

  const imgUrl = response.data.urls.small;
  return imgUrl;
};

//export function to be used in seed app.js
export { getUnsplashApiImg, unsplashApiImg };
