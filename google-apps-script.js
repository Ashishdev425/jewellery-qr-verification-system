// Google Apps Script for Jewellery Identification System
// Deploy this as a Web App with "Access: Anyone"

const SHEET_NAME = 'Jewellery_Identification_DB';
const FOLDER_NAME = 'Jewellery_Images';

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getProducts') {
    return getProducts();
  } else if (action === 'getProduct') {
    return getProduct(e.parameter.id);
  }
  
  return createResponse({ error: 'Invalid action' });
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  if (action === 'addProduct') {
    return addProduct(data.payload);
  } else if (action === 'updateProduct') {
    return updateProduct(data.payload);
  } else if (action === 'deleteProduct') {
    return deleteProduct(data.payload);
  } else if (action === 'uploadImage') {
    return uploadImage(data.payload);
  }
  
  return createResponse({ error: 'Invalid action' });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      'Certificate_ID', 'Product_Name', 'Jewellery_Type', 'Metal_Type', 'Metal_Purity',
      'Gross_Weight', 'Net_Weight', 'Diamond_Type', 'Diamond_Cut', 'Diamond_Carat',
      'Color', 'Clarity', 'Setting_Type', 'Product_Image_URL', 'QR_Code_URL',
      'Card_Front_URL', 'Card_Back_URL', 'Created_Date', 'Last_Updated', 'Status'
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function getProducts() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const products = [];
  
  for (let i = 1; i < data.length; i++) {
    const product = {};
    headers.forEach((header, index) => {
      product[header] = data[i][index];
    });
    if (product.Status !== 'Deleted') {
      products.push(product);
    }
  }
  
  return createResponse(products);
}

function getProduct(id) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      const product = {};
      headers.forEach((header, index) => {
        product[header] = data[i][index];
      });
      return createResponse(product);
    }
  }
  
  return createResponse({ error: 'Product not found' }, 404);
}

function addProduct(payload) {
  const sheet = getSheet();
  const headers = sheet.getDataRange().getValues()[0];
  const row = headers.map(header => {
    if (header === 'Created_Date' || header === 'Last_Updated') return new Date();
    if (header === 'Status') return 'Active';
    return payload[header] || '';
  });
  
  sheet.appendRow(row);
  return createResponse({ success: true });
}

function updateProduct(payload) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = 0;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === payload.Certificate_ID) {
      const rowNum = i + 1;
      headers.forEach((header, index) => {
        if (header === 'Certificate_ID') return;
        if (header === 'Created_Date') return;
        if (header === 'Last_Updated') {
          sheet.getRange(rowNum, index + 1).setValue(new Date());
          return;
        }
        if (payload[header] !== undefined) {
          sheet.getRange(rowNum, index + 1).setValue(payload[header]);
        }
      });
      return createResponse({ success: true });
    }
  }
  
  return createResponse({ error: 'Product not found' }, 404);
}

function deleteProduct(payload) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const idIndex = 0;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === payload.Certificate_ID) {
      sheet.deleteRow(i + 1);
      return createResponse({ success: true });
    }
  }
  
  return createResponse({ error: 'Product not found' }, 404);
}

function uploadImage(payload) {
  // payload: { fileName, base64Data, contentType }
  const folder = getOrCreateFolder();
  const blob = Utilities.newBlob(Utilities.base64Decode(payload.base64Data), payload.contentType, payload.fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  const url = `https://drive.google.com/uc?id=${file.getId()}`;
  return createResponse({ url: url });
}

function getOrCreateFolder() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(FOLDER_NAME);
}

function createResponse(data, status = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
