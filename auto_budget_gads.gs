function main() {
  // URL da sua planilha
  var sheetUrl = <SHEET URL>;
  var sheet = SpreadsheetApp.openByUrl(sheetUrl).getActiveSheet(); // Abre a planilha
  var data = sheet.getDataRange().getValues(); // Obtém todos os dados da planilha

  // Ignora a primeira linha (cabeçalhos)
  for (var i = 1; i < data.length; i++) {
    var campaignName = data[i][0]; // Nome da campanha
    var platform = data[i][1]; // Plataforma
    var newBudgetString = data[i][2].toString(); // Novo orçamento como string
    var date = data[i][3]; // Data (não usada no momento)
    var accountNameToFind = data[i][4]; // Nome da conta da planilha
    var accountFound = false;

    // Busca a conta pelo nome
    var accountIterator = AdsManagerApp.accounts().get();
    while (accountIterator.hasNext()) {
      var account = accountIterator.next();
      if (account.getName() === accountNameToFind) {
        AdsManagerApp.select(account);
        accountFound = true;
        Logger.log("Conta selecionada: " + account.getName());
        break;
      }
    }

    if (!accountFound) {
      Logger.log("Conta '" + accountNameToFind + "' não encontrada.");
      continue; // Ignora para a próxima iteração se a conta não for encontrada
    }

    // Verifica se a plataforma é 'Google' ou 'Facebook' antes de continuar
    if (platform === 'Google' || platform === 'Facebook') {
      try {
        // Converte o orçamento de string (com vírgula) para número
        var newBudget = parseFloat(newBudgetString.replace(',', '.'));
        setCampaignBudget(campaignName, newBudget);
        logBudgetDetails(campaignName);
      } catch (e) {
        Logger.log("Erro ao atualizar o orçamento da campanha '" + campaignName + "': " + e.message);
      }
    } else {
      Logger.log("Plataforma não suportada para a campanha '" + campaignName + "': " + platform);
    }
  }
}

function setCampaignBudget(name, amount) {
  const campaignIterator = AdsApp.campaigns()
      .withCondition(campaign.name = '${name}')
      .get();
  if (!campaignIterator.hasNext()) {
    throw new Error(Nenhuma campanha com o nome '${name}' encontrada.);
  }
  const campaign = campaignIterator.next();
  
  Logger.log(Atualizando orçamento para a campanha '${name}' com o valor: ${amount});
  campaign.getBudget().setAmount(amount);
}

function logBudgetDetails(campaignName) {
  const campaignIterator = AdsApp.campaigns()
      .withCondition(campaign.name = '${campaignName}')
      .get();
  if (!campaignIterator.hasNext()) {
    throw new Error(Nenhuma campanha com o nome '${campaignName}' encontrada.);
  }
  const campaign = campaignIterator.next();
  const budget = campaign.getBudget();

  Logger.log(Valor do orçamento: ${budget.getAmount()});
  Logger.log(Método de entrega: ${budget.getDeliveryMethod()});
  Logger.log(Compartilhado explicitamente: ${budget.isExplicitlyShared()});

  // Se este for um orçamento compartilhado, registra todas as campanhas associadas.
  if (budget.isExplicitlyShared()) {
    const budgetCampaignIterator = budget.campaigns().get();
    Logger.log(=======);
    Logger.log(Campanhas associadas (${budgetCampaignIterator.totalNumEntities()}):);

    for (const associatedCampaign of budgetCampaignIterator) {
      Logger.log(associatedCampaign.getName());
    }
  }
}
