const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = __dirname;
const DRAWINGS_DIR = path.join(ROOT_DIR, "./Dwg_drawing");
const JSON_CONFIG_PATH = path.join(ROOT_DIR, "config.json");
const TXT_CONFIG_PATH = path.join(ROOT_DIR, "config.txt");

function loadConfig() {
  if (fs.existsSync(JSON_CONFIG_PATH)) {
    console.log("Loading config from config.json");
    const raw = fs.readFileSync(JSON_CONFIG_PATH, "utf-8");
    return JSON.parse(raw);
  }

  if (fs.existsSync(TXT_CONFIG_PATH)) {
    console.log("Loading config from config.txt");
    const raw = fs.readFileSync(TXT_CONFIG_PATH, "utf-8");
    return parseTxtConfig(raw);
  }

  throw new Error("No config file found. Please create config.json or config.txt");
}

function parseTxtConfig(content) {
  const config = {};

  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalIndex = trimmed.indexOf("=");
    if (equalIndex === -1) continue;

    const key = trimmed.slice(0, equalIndex).trim();
    const value = trimmed.slice(equalIndex + 1).trim();

    if (key) {
      config[key] = value;
    }
  }

  return config;
}

function buildConfig(rawConfig) {
  return {
    baseUrl: rawConfig.baseUrl || "https://dev.app.bbsteel.in",
    email: rawConfig.email,
    password: rawConfig.password,
    projectName: rawConfig.projectName,
    importName: rawConfig.importName || "test import",
    drgNo: rawConfig.drgNo || "DRG-001",
    structureName: rawConfig.structureName || "Main Structure",
    timeout: Number(rawConfig.timeout || 10000),
    uploadTimeout: Number(rawConfig.uploadTimeout || 20000),
    shortDelay: Number(rawConfig.shortDelay || 100),
    mediumDelay: Number(rawConfig.mediumDelay || 200),
    longDelay: Number(rawConfig.longDelay || 500),
  };
}

function getDrawingFile() {
  if (!fs.existsSync(DRAWINGS_DIR)) {
    throw new Error(`Drawings folder not found: ${DRAWINGS_DIR}`);
  }

  const files = fs
    .readdirSync(DRAWINGS_DIR)
    .filter((file) => file.toLowerCase().endsWith(".dwg"))
    .sort();

  if (files.length === 0) {
    throw new Error(`No .dwg files found in folder: ${DRAWINGS_DIR}`);
  }

  const selectedFile = path.join(DRAWINGS_DIR, files[0]);
  console.log("Selected drawing file:", selectedFile);
  return selectedFile;
}

function getTodayFormatted() {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitAndFind(driver, locator, timeout) {
  const el = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(el), timeout);
  return el;
}

async function waitAndClick(driver, locator, timeout) {
  const el = await waitAndFind(driver, locator, timeout);
  await driver.wait(until.elementIsEnabled(el), timeout);
  await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", el);
  await el.click();
  return el;
}

async function waitAndType(driver, locator, value, timeout) {
  const el = await waitAndFind(driver, locator, timeout);
  await el.click();
  await el.clear();
  await el.sendKeys(value);
  return el;
}

async function login(driver, config) {
  await driver.get(`${config.baseUrl}/`);

  await waitAndType(driver, By.css('input[name="email"]'), config.email, config.timeout);

  const passwordInput = await waitAndFind(
    driver,
    By.css('input[name="password"]'),
    config.timeout
  );
  await passwordInput.sendKeys(config.password, Key.RETURN);

  await sleep(config.longDelay);

  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    return !url.includes("/login");
  }, config.timeout).catch(() => {});
}

async function openProject(driver, config) {
  await driver.get(`${config.baseUrl}/projects`);
  await sleep(config.mediumDelay);

  const card = await waitAndFind(
    driver,
    By.xpath(`//h4[normalize-space()='${config.projectName}']`),
    config.timeout
  );

  await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", card);
  await sleep(100);
  await card.click();

  await driver.wait(until.urlContains("/projects/"), config.timeout);
  await sleep(config.mediumDelay);

  const currentUrl = await driver.getCurrentUrl();
  console.log("Current URL:", currentUrl);

  const importsUrl = currentUrl.replace("/blocks", "/imports");
  await driver.get(importsUrl);

  await sleep(config.mediumDelay);
}

async function clickNewImport(driver, config) {
  await waitAndClick(
    driver,
    By.xpath("//button[contains(.,'New Import')]"),
    config.timeout
  );

  await sleep(config.mediumDelay);
}

async function fillImportForm(driver, config) {
  await waitAndType(driver, By.css('input[name="name"]'), config.importName, config.timeout);
  await sleep(config.shortDelay);

  await waitAndType(driver, By.css('input[name="drgNo"]'), config.drgNo, config.timeout);
  await sleep(config.shortDelay);

  await waitAndType(
    driver,
    By.css('input[name="structureName"]'),
    config.structureName,
    config.timeout
  );
  await sleep(config.shortDelay);

  await waitAndClick(driver, By.id("block"), config.timeout);
  await sleep(100);

  await waitAndClick(
    driver,
    By.xpath('//ul[@role="listbox"]/li[not(contains(.,"Select"))][1]'),
    config.timeout
  );
  await sleep(config.shortDelay);

  await waitAndClick(
    driver,
    By.xpath("//label[normalize-space()='Select Floor']/following::button[@title='Open'][1]"),
    config.timeout
  );
  await sleep(100);

  await waitAndClick(
    driver,
    By.xpath("//ul[@role='listbox']//li[1]"),
    config.timeout
  );
  await sleep(config.shortDelay);

  const dateInput = await waitAndFind(
    driver,
    By.css('input[placeholder="MM/DD/YYYY"]'),
    config.timeout
  );

  await dateInput.click();
  await sleep(100);
  await dateInput.sendKeys(Key.chord(Key.CONTROL, "a"));
  await dateInput.sendKeys(Key.BACK_SPACE);
  await dateInput.sendKeys(getTodayFormatted());
  await dateInput.sendKeys(Key.TAB);

  await sleep(config.shortDelay);
}

async function uploadDrawing(driver, config, drawingPath) {
  const fileInput = await waitAndFind(
    driver,
    By.css('input[type="file"][accept*=".dwg"]'),
    config.timeout
  );

  await fileInput.sendKeys(drawingPath);

  const uploadSuccess = await waitAndFind(
    driver,
    By.xpath("//p[normalize-space()='File uploaded successfully!']"),
    config.uploadTimeout
  );

  await driver.wait(until.elementIsVisible(uploadSuccess), 5000);
  await sleep(config.mediumDelay);
}

async function submitImport(driver, config) {
  const importBtn = await waitAndFind(
    driver,
    By.xpath("//button[normalize-space()='Import']"),
    config.timeout
  );

  // scroll using wheel/action API
  await driver
    .actions({ async: true })
    .move({ origin: importBtn })
    .perform();

  await sleep(300);

  // extra fallback scroll inside viewport
  await driver.executeScript(
    "arguments[0].scrollIntoView({ block: 'end', inline: 'nearest' });",
    importBtn
  );

  await sleep(300);
  await driver.wait(until.elementIsEnabled(importBtn), config.timeout);

  try {
    await importBtn.click();
  } catch (err) {
    await driver.executeScript("arguments[0].click();", importBtn);
  }

  await sleep(config.longDelay);
}

async function run() {
  const rawConfig = loadConfig();
  const config = buildConfig(rawConfig);
  const drawingPath = getDrawingFile();

  if (!config.email || !config.password || !config.projectName) {
    throw new Error("Missing required config values: email, password, or projectName");
  }

  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await login(driver, config);
    await openProject(driver, config);
    await clickNewImport(driver, config);
    await fillImportForm(driver, config);
    await uploadDrawing(driver, config, drawingPath);
    await submitImport(driver, config);

    console.log("Import workflow completed successfully.");
  } catch (error) {
    console.error("Error during automation:", error);
  } finally {
    // await driver.quit();
  }
}

run();