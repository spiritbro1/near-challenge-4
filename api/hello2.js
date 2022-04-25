import axios from "axios";
import sharp from 'sharp'


export default async function handler(request, response) {
    const input = (await axios({ url: request.query.url, responseType: "arraybuffer" })).data;


const output = await sharp(input).resize(64,64);
    output.pipe(response)
  }