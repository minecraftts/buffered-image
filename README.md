# buffered-image

Not to be confused with Java BufferedImages, I just couldn't think of a better name (lawl). This is just a thin wrapper on top of `node-canvas`

### Usage

```ts
import { BufferedImage } from "@minecraftts/buffered-image"

const bufferedImage = new BufferedImage(200, 200);
const graphics = bufferedImage.getGraphics();

graphics.fillStyle = "red";
graphics.fillRect(50, 50, 100, 100);

// before querying pixels you have to do this
bufferedImage.refresh();

let pixel = bufferedImage.getPixel(0, 0);
console.log(pixel); // => { r: 0, g: 0, b: 0, a: 0 }
pixel = bufferedImage.getPixel(100, 100);
console.log(pixel); // => { r: 255, g: 0, b: 0, a: 255 }
```

### Installation

Run
```
npm install @minecraftts/buffered-image
```

### License

Everything here is licensed under the MIT license