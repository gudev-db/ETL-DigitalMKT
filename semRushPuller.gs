// Lista de clientes
var clientes = [];

// Função para buscar o relatório de backlinks da API SEMrush e salvar no Google Sheets


function fetchBackLinkReportFromSEMrush() {
var apiKey = PropertiesService.getScriptProperties().getProperty('key');
var apiUrl = "https://api.semrush.com/analytics/v1/";
var exportColumns =
"ascore,total,domains_num,urls_num,ips_num,ipclassc_num,follows_num,nofollo
ws_num,sponsored_num,ugc_num,texts_num,images_num,forms_num,frames_num";
var sheetName = 'BacklinkReport';
 
// Acessar a planilha e criar/limpar a aba conforme necessário

var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var sheet = spreadsheet.getSheetByName(sheetName) ||
spreadsheet.insertSheet(sheetName);

// Adiciona cabeçalhos se não existirem

if (sheet.getLastRow() === 0) {
var headers = ["ascore", "total", "domains_num", "urls_num", "ips_num",
"ipclassc_num", "follows_num", "nofollows_num", "sponsored_num", "ugc_num",
"texts_num", "images_num", "forms_num", "frames_num", "Domain", "Fetch
Date"];
sheet.appendRow(headers);
}

var fetchDate = Utilities.formatDate(new Date(),
Session.getScriptTimeZone(), "yyyy-MM-dd");// Iterar sobre cada cliente e buscar dados da API SEMrush
clientes.forEach(function(targetDomain) {
var params = {
key: apiKey,
type: "backlinks_overview",
target: targetDomain,
target_type: "root_domain",
export_columns: exportColumns,
};

var queryString = Object.keys(params).map(key => key + '=' +
encodeURIComponent(params[key])).join('&');
var response = UrlFetchApp.fetch(apiUrl + "?" + queryString, {
muteHttpExceptions: true });
var responseCode = response.getResponseCode();
if (responseCode === 200) {
var data = response.getContentText();
var csvData = Utilities.parseCsv(data, ';');
var existingData = sheet.getDataRange().getValues().map(row =>
row.join());

// Filtrar linhas novas e adicionar domínio e data

var newRows = csvData.slice(1).filter(row =>
!existingData.includes(row.join())).map(row => {
row.push(targetDomain, fetchDate);
return row;
});

// Adicionar novas linhas à planilha

if (newRows.length > 0) {
sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length,
newRows[0].length).setValues(newRows);
}
Logger.log('Dados de backlinks salvos para ' + targetDomain);
} else {
Logger.log('Erro ' + responseCode + ' para o domínio ' + targetDomain
+ ': ' + response.getContentText());}
});
}

// Função para buscar palavras-chave orgânicas da API SEMrush e salvar no Google Sheets

function fetchPalavrasChave() {
var apiKey = PropertiesService.getScriptProperties().getProperty('key');
var apiUrl = "https://api.semrush.com/";
var exportColumns = "Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td";
var database = "br";
var displayLimit = 1000;
var displaySort = "tr_desc";
var sheetName = "PalavrasChave";

// Acessar a planilha e criar/limpar a aba conforme necessário

var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var sheet = spreadsheet.getSheetByName(sheetName) ||
spreadsheet.insertSheet(sheetName);

// Iterar sobre cada cliente e buscar dados da API SEMrush

clientes.forEach(function(targetDomain) {
var params = {
key: apiKey,
type: "domain_organic",
export_columns: exportColumns,
domain: targetDomain,
database: database,
display_limit: displayLimit,
display_sort: displaySort
};

var queryString = Object.keys(params).map(key => key + '=' +
encodeURIComponent(params[key])).join('&');
var response = UrlFetchApp.fetch(apiUrl + "?" + queryString, {
muteHttpExceptions: true });
var responseCode = response.getResponseCode();if (responseCode === 200) {
var data = response.getContentText();
var csvData = Utilities.parseCsv(data, ';');

// Adiciona cabeçalhos se a planilha estiver vazia

if (sheet.getLastRow() === 0) {
sheet.appendRow(csvData[0].concat("Domain", "Client Type", "Fetch
Date"));
}
var existingData = sheet.getDataRange().getValues();
var fetchDate = Utilities.formatDate(new Date(),
Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

// Filtrar posições no top 10 e evitar duplicatas

var newRows = csvData.slice(1).filter(row => {
var position = parseInt(row[1], 10);
return position <= 10 && !existingData.some(existingRow =>
existingRow.slice(0, -3).join() === row.join());
}).map(row => {
return row.concat(targetDomain, "PalavrasChave", fetchDate);
});

// Adicionar novas linhas à planilha

if (newRows.length > 0) {
newRows.forEach(row => {
sheet.appendRow(row);
});
}
Logger.log('Palavras-chave salvas para ' + targetDomain);
} else {
Logger.log('Erro ' + responseCode + ' para o domínio ' + targetDomain
+ ': ' + response.getContentText());
}
});
}
