import { Image, Canvas, createCanvas, CanvasRenderingContext2D, ImageData, JpegConfig } from "canvas";
import fs from "fs";
import Pixel from "./Pixel";

export default class BufferedImage extends Image {
    private canvas: Canvas;
    private context: CanvasRenderingContext2D;
    private data: ImageData;

    constructor(src: string | Buffer);
    constructor(image: Image);
    constructor(width: number, height: number);
    constructor(srcImageOrWidth: number | string | Buffer | Image, height?: number) {
        super();

        if (typeof srcImageOrWidth === "number") {
            this.canvas = createCanvas(srcImageOrWidth, <number>height);
            this.context = this.canvas.getContext("2d");
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else if (srcImageOrWidth instanceof Image) {
            this.canvas = createCanvas(srcImageOrWidth.width, srcImageOrWidth.height);

            this.context = this.canvas.getContext("2d");
            this.context.drawImage(srcImageOrWidth, 0, 0);
        } else if (srcImageOrWidth instanceof Buffer) {
            super.src = srcImageOrWidth;

            this.canvas = createCanvas(super.width, super.height);
            this.context = this.canvas.getContext("2d");

            this.context.drawImage(this, 0, 0);
        } else {
            super.src = fs.readFileSync(srcImageOrWidth);

            this.canvas = createCanvas(super.width, super.height);
            this.context = this.canvas.getContext("2d");

            this.context.drawImage(this, 0, 0);
        }

        this.data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    public getPixel(x: number, y: number): Pixel {
        const index = (y * this.canvas.width + x) * 4;
        const data = this.data.data;

        if (x < 0 || x >= this.getWidth()) {
            throw new Error(`x outside of range, expected x >= 0 and x < ${this.getWidth()}, got ${x}`);
        }

        if (y < 0 || y >= this.getHeight()) {
            throw new Error(`y outside of range, expected y >= 0 and y < ${this.getHeight()}, got ${y}`);
        }

        return {
            r: data[index],
            g: data[index+1],
            b: data[index+2],
            a: data[index+3]
        };
    }

    public getPixels(x: number, y: number, width: number, height: number): Pixel[] {
        const pixels: Pixel[] = [];

        for (let px = x; px < width + x; px++) {
            for (let py = y; py < height + y; py++) {
                pixels.push(this.getPixel(px, py));
            }
        }

        return pixels;
    }

    public getGraphics(): CanvasRenderingContext2D {
        return this.context;
    }

    public getData(): Buffer {
        return Buffer.from(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data);
    }

    public toPng(): Buffer {
        return this.canvas.toBuffer("image/png");
    }

    public toJpeg(options?: JpegConfig): Buffer {
        return this.canvas.toBuffer("image/jpeg", options);
    }

    public getWidth(): number {
        return this.canvas.width;
    }

    public getHeight(): number {
        return this.canvas.height;
    }

    public refresh(): void {
        this.data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    public load(data: Buffer): void {
        super.src = data;

        this.canvas = createCanvas(super.width, super.height);
        this.context = this.canvas.getContext("2d");

        this.refresh();
    }

    // force load method

    // @ts-ignore
    public set src(src: string | Buffer) {
        this.load(typeof src === "string" ? fs.readFileSync(src) : src);
    }

    public get src(): string | Buffer {
        return super.src;
    }
}