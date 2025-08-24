// convertFont.js
import fs from "fs";

const font = fs.readFileSync("./src/fonts/Roboto-Regular.ttf"); // đường dẫn mới
const base64 = font.toString("base64");

const jsContent = `
export const RobotoRegular = "${base64}";
`;

fs.writeFileSync("./src/fonts/roboto.js", jsContent);

console.log("✅ Font Roboto đã convert sang base64 và lưu ở src/fonts/roboto.js");
