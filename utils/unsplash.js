const axios = require("axios");

// Setting authentication parameters & headers
const unsplashApiImg = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    "Accept-Version": "v1",
  },
});

// Accessing Unsplash API for random images
const getUnsplashApiImg = async () => {
  const response = await unsplashApiImg.get("/photos/random", {
    params: { query: "campground" },
  });

  const imgUrl = response.data.urls.small;
  // console.log(imgUrl);
  return imgUrl;
};

//export function to be used in seed app.js
module.exports = { getUnsplashApiImg, unsplashApiImg };
