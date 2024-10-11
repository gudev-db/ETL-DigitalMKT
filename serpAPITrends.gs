function getGoogleTrendsDataForClients() {
const apiKey =
"<API KEY HERE>"; // Substitua pela sua chave da API

// Array de clientes com suas palavras-chave

const clients = [
{ name: "client", queries: "queries"
}];
const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

// Loop para cada cliente

clients.forEach(client => {
const queries = client.queries;
const dataType = "TIMESERIES"; // Tipo de dados a serem buscados
const url =
`https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponen
t(queries)}&data_type=${dataType}&api_key=${apiKey}`;
try {
const response = UrlFetchApp.fetch(url);
const json = JSON.parse(response.getContentText());
if (json.search_metadata.status === "Success") {
const interestOverTime = json.interest_over_time.timeline_data;

// Verifica se a aba do cliente já existe, se não, cria uma nova aba

let sheet = spreadsheet.getSheetByName(client.name);if (!sheet) {
sheet = spreadsheet.insertSheet(client.name);
} else {
sheet.clear(); // Limpa a aba existente
}

// Adiciona cabeçalho

sheet.appendRow(["Data", "Palavra", "Interesse"]);
interestOverTime.forEach(dataPoint => {
const dateRange = dataPoint.date; // Exemplo: "Oct 1 – 7, 2023"
// Expressão regular para extrair o mês e o ano e converter para o primeiro dia do mês

const dateParts = dateRange.match(/([A-Za-z]{3})
\d{1,2}[– \s]+\d{1,2}, (\d{4})/);
if (dateParts) {
const month = dateParts[1]; // Exemplo: "Oct"
const year = dateParts[2];


// Mapeamento de meses para números

const monthMap = {
"Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May":
"05", "Jun": "06",
"Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov":
"11", "Dec": "12"
};
const monthNumber = monthMap[month];

// Formata a data como "YYYY-MM-01" (sempre o primeiro dia do mês)

const formattedDate = `${year}-${monthNumber}-07`;

// Adiciona os dados na aba específica do cliente

dataPoint.values.forEach(value => {
sheet.appendRow([formattedDate, value.query, value.value]);
});
} else {Logger.log(`Formato de data inesperado: ${dateRange}`);
}
});
Logger.log(`Dados de tendência para ${client.name} salvos com
sucesso!`);
} else {
Logger.log(`Erro ao buscar dados para ${client.name}: ` +
json.search_metadata.error);
}
} catch (error) {
Logger.log(`Erro inesperado para ${client.name}: ${error.message}`);
}
});
}
