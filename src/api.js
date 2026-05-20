import axios from "axios";

const API_KEY = "AIzaSyDiE5gsX6sLvQh2jTm8VU0djp0tzxLEoNA";

export const youtube = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    key: API_KEY,
  },
});