const fs = require("fs");

const dataURI = function convertToDataURI() {
  try {
    // Dosya okuma işlemi
    const imageBuffer = fs.readFileSync("./src/uploads/images/purple.jpg");

    // Base64'e dönüştürme
    const base64Image = imageBuffer.toString("base64");

    // Data URI oluşturma
    const dataURI = `data:image/jpeg;base64,${base64Image}`;

    return dataURI;
  } catch (error) {
    console.error("Dosya okuma hatası:", error);
    return null;
  }
}


module.exports = dataURI;