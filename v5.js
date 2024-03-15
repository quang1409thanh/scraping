const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// log
const logFileName = "log.txt";

async function fetchDataAndWriteToFile(url, index, csvFilePath) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const elements = $("span.value.col-xs-12.col-sm-9.col-md-10");

    const ui = elements[8];
    const uiv2 = elements[9];
    const ui_check = elements.eq(8);

    const value = ui_check.text();
    var containsNumber = /\d/.test(value);

    const getDataFromNodes = (nodes) => {
      const data = [];
      for (const node of nodes) {
        if (node.nodeType === 3) {
          data.push(node.data);
        }
      }
      return data.join(",");
    };

    const data = getDataFromNodes(
      !containsNumber ? ui.childNodes : uiv2.childNodes
    );
    const messagePrefix = !containsNumber ? " v1" : " v2";

    await fs.promises.appendFile(csvFilePath, `${url},${data}\n`);
    const message = `Dữ liệu${messagePrefix} từ URL ${url} đã được ghi vào file CSV ${csvFilePath} dòng ${index}.\n`;
    await appendToLogFile(message);
  } catch (error) {
    let mess =
      `Đã xảy ra lỗi khi lấy dữ liệu cho mục ${index} cua nam ${csvFilePath}:` +
      error.message +
      "\n";
    await appendToLogFile(mess);
    console.error();
  }
}

async function appendToLogFile(message) {
  try {
    await fs.promises.appendFile(logFileName, message);
    console.log("Thông điệp đã được ghi vào file:", logFileName);
  } catch (err) {
    console.error("Đã xảy ra lỗi khi ghi vào file:", err);
  }
}

async function readDataFromFile(filename, csvFilePath) {
  try {
    const data = await fs.promises.readFile(filename, "utf8");
    const dataArray = data.split("\n");

    for (let index = 0; index < dataArray.length; index++) {
      const item = dataArray[index];
      const url = `https://digitallibrary.un.org/record/${item}`;
      await fetchDataAndWriteToFile(url, index, csvFilePath);
      await sleep(1); // Chờ 1 giây trước khi gửi yêu cầu tiếp theo
    }
  } catch (err) {
    console.error("Đã xảy ra lỗi khi đọc tệp:", err);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Hàm kiểm tra và tạo thư mục
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Hàm xóa tất cả các tệp trong thư mục
function clearDirectory(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);
    fs.unlinkSync(filePath);
  });
}

const outputDirectory = "rs";

clearDirectory(outputDirectory);
for (let year = 1992; year <= 2023; year++) {
  const filename = `urls/${year}data.txt`;
  const csvFilePath = `${outputDirectory}/data${year}.csv`;
  ensureDirectoryExistence(csvFilePath);
  readDataFromFile(filename, csvFilePath);
}
