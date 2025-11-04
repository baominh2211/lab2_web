// CSS and Style Files
declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "*.less";

// Image Files
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.svg";
declare module "*.webp";
declare module "*.ico";

// Font Files
declare module "*.woff";
declare module "*.woff2";
declare module "*.eot";
declare module "*.ttf";
declare module "*.otf";

// Data Files
declare module "*.json" {
  const value: any;
  export default value;
}
declare module "*.xml";
declare module "*.csv";

// Video/Audio Files
declare module "*.mp4";
declare module "*.webm";
declare module "*.ogg";
declare module "*.mp3";
declare module "*.wav";

// Document Files
declare module "*.pdf";
declare module "*.txt";
declare module "*.md";

// Other Assets
declare module "*.wasm";
declare module "*.glb";
declare module "*.gltf";