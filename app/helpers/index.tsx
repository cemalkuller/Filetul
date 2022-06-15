import { REMOTE_URL } from "@env"

export const imageUrl = (url) => {
    return url.replace("http://195.175.208.222:91/", REMOTE_URL);
  }