//Propriedades de script
var scriptProperties = PropertiesService.getScriptProperties();
var token = scriptProperties.getProperty('token');
var secret = scriptProperties.getProperty('secret');
//Ids de contas
var accountIdFB = '<AccountId>';
var accountIdInst = '<AccountId>';
var accountIdLink = '<AccountId>';
var accountIdTik = '<AccountId>';
var accountIdYT = '<AccountId>';
//Função de data
function getYesterdayDate() {
// Obtém a data atual
var now = new Date();
// Subtrai um dia da data atual para obter o dia de ontem
var yesterday = new Date();
yesterday.setDate(now.getDate() - 1);
// Formata a data no formato yyyy-MM-dd
var year = yesterday.getFullYear();
var month = ('0' + (yesterday.getMonth() + 1)).slice(-2); // Adiciona zero
à esquerda se necessário
var day = ('0' + yesterday.getDate()).slice(-2); // Adiciona zero à
esquerda se necessário
var formattedDate = year + '-' + month + '-' + day;
return formattedDate;
}
currentdate = getYesterdayDate()
//Facebook
function fetchFBPosts() {
var accountId = accountIdFB;
var url = 'https://api.emplifi.io/3/facebook/page/posts';
var credentials = Utilities.base64Encode(token + ':' + secret);
var headers = {
'Authorization': 'Basic ' + credentials,'Content-Type': 'application/json; charset=utf-8'
};
var payload = {
"profiles": [accountId],
"date_start": "2024-01-01",
"date_end": currentdate,
"fields": [
"id",
"created_time",
"attachments",
"author",
"authorId",
"comments",
"comments_sentiment",
"content",
"content_type",
"deleted",
"grade",
"hidden",
"interactions",
"interactions_per_1k_fans",
"media_type",
"origin",
"page",
"post_attribution",
"post_labels",
"profileId",
"published",
"reactions",
"reactions_by_type",
"sentiment",
"shares",
"spam",
"universal_video_id",
"url",
"video",
"insights_engaged_users",
"insights_engagements",
"insights_impressions",
"insights_impressions_by_post_attribution",
"insights_impressions_engagement_rate",
"insights_interactions",
"insights_interactions_by_interaction_type",
"insights_negative_feedback_unique","insights_post_clicks",
"insights_post_clicks_by_clicks_type",
"insights_post_clicks_unique",
"insights_reach",
"insights_reach_by_post_attribution",
"insights_reach_engagement_rate",
"insights_reactions",
"insights_reactions_by_type",
"insights_video_view_time",
"insights_video_view_time_average",
"insights_video_view_time_by_country",
"insights_video_view_time_by_distribution",
"insights_video_view_time_by_gender_age",
"insights_video_view_time_by_post_attribution",
"insights_video_views",
"insights_video_views_10s",
"insights_video_views_10s_by_play_type",
"insights_video_views_10s_by_post_attribution",
"insights_video_views_10s_by_sound",
"insights_video_views_10s_unique",
"insights_video_views_30s",
"insights_video_views_30s_by_play_type",
"insights_video_views_30s_by_post_attribution",
"insights_video_views_30s_unique",
"insights_video_views_average_completion",
"insights_video_views_by_play_type",
"insights_video_views_by_post_attribution",
"insights_video_views_by_sound",
"insights_video_views_complete",
"insights_video_views_complete_by_post_attribution",
"insights_video_views_complete_unique",
"insights_video_views_complete_unique_by_post_attribution",
"insights_video_views_distribution",
"insights_video_views_unique",
"insights_video_views_unique_by_post_attribution"
],
"sort": [
{
"field": "created_time",
"order": "desc"
}
],
"filter": [
{
"field": "post_attribution","value": "organic"
}
]
};
var options = {
'method': 'post',
'headers': headers,
'payload': JSON.stringify(payload),
'muteHttpExceptions': true
};
var response = UrlFetchApp.fetch(url, options);
var responseCode = response.getResponseCode();
if (responseCode === 200) {
var data = JSON.parse(response.getContentText());
if (data && data.data && data.data.posts) {
var posts = data.data.posts;
savePostsToSheetFB(posts);
} else {
Logger.log('Nenhum post encontrado na resposta da API.');
}
} else {
Logger.log('Erro: ' + responseCode);
Logger.log(response.getContentText());
}
}
function savePostsToSheetFB(posts) {
var sheet =
SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FacebookPostsMetrics');
if (!sheet) {
sheet =
SpreadsheetApp.getActiveSpreadsheet().insertSheet('FacebookPostsMetrics');
} else {
sheet.clear();
}
// Adiciona os cabeçalhos
var headers = [
'ID', 'Created Time', 'Author', 'Author ID', 'Content', 'Content Type',
'Hidden','Media Type', 'Post Attribution', 'Interactions', 'Interactions per 1k
Fans',
'Reactions', 'Reactions by Type', 'Sentiment', 'Shares', 'Spam', 'URL',
'Universal Video ID', 'Video', 'Insights Engaged Users', 'Insights
Engagements',
'Insights Impressions', 'Insights Impressions by Post Attribution',
'Insights Impressions Engagement Rate', 'Insights Interactions',
'Insights Interactions by Interaction Type', 'Insights Negative Feedback
Unique',
'Insights Post Clicks', 'Insights Post Clicks by Clicks Type',
'Insights Post Clicks Unique', 'Insights Reach', 'Insights Reach by Post
Attribution',
'Insights Reach Engagement Rate', 'Insights Reactions', 'Insights
Reactions by Type',
'Insights Video View Time', 'Insights Video View Time Average',
'Insights Video View Time by Country', 'Insights Video View Time by
Distribution',
'Insights Video View Time by Gender Age', 'Insights Video View Time by
Post Attribution',
'Insights Video Views', 'Insights Video Views 10s',
'Insights Video Views 10s by Play Type', 'Insights Video Views 10s by
Post Attribution',
'Insights Video Views 10s by Sound', 'Insights Video Views 10s Unique',
'Insights Video Views 30s', 'Insights Video Views 30s by Play Type',
'Insights Video Views 30s by Post Attribution', 'Insights Video Views 30s
Unique',
'Insights Video Views Average Completion', 'Insights Video Views by Play
Type',
'Insights Video Views by Post Attribution', 'Insights Video Views by
Sound',
'Insights Video Views Complete', 'Insights Video Views Complete by Post
Attribution',
'Insights Video Views Complete Unique', 'Insights Video Views Complete
Unique by Post Attribution',
'Insights Video Views Distribution', 'Insights Video Views Unique',
'Insights Video Views Unique by Post Attribution', 'Comments Sentiment
Positive',
'Comments Sentiment Neutral', 'Comments Sentiment Negative', 'Post
Labels'
];
sheet.appendRow(headers);
posts.forEach(function(post) {
var commentsSentiment = post.comments_sentiment || {};var baseRow = [
post.id || 'N/A',
post.created_time || 'N/A',
post.author ? post.author.name : '',
post.authorId || 'N/A',
post.content || '',
post.content_type || 'N/A',
post.hidden || 'N/A',
post.media_type || 'N/A',
post.post_attribution || 'N/A',
post.interactions || 0,
post.interactions_per_1k_fans || 0,
post.reactions || 0,
JSON.stringify(post.reactions_by_type || {}),
post.sentiment || 'N/A',
post.shares || 0,
post.spam || 0,
post.url || '',
post.universal_video_id || '',
post.video || 'N/A',
post.insights_engaged_users || 0,
post.insights_engagements || 0,
post.insights_impressions || 0,
post.insights_impressions_by_post_attribution || 0,
post.insights_impressions_engagement_rate || 0,
post.insights_interactions || 0,
JSON.stringify(post.insights_interactions_by_interaction_type || {}),
post.insights_negative_feedback_unique || 0,
post.insights_post_clicks || 0,
JSON.stringify(post.insights_post_clicks_by_clicks_type || {}),
post.insights_post_clicks_unique || 0,
post.insights_reach || 0,
post.insights_reach_by_post_attribution || 0,
post.insights_reach_engagement_rate || 0,
post.insights_reactions || 0,
JSON.stringify(post.insights_reactions_by_type || {}),
post.insights_video_view_time || 0,
post.insights_video_view_time_average || 0,
JSON.stringify(post.insights_video_view_time_by_country || {}),
JSON.stringify(post.insights_video_view_time_by_distribution || {}),
JSON.stringify(post.insights_video_view_time_by_gender_age || {}),
post.insights_video_view_time_by_post_attribution || 0,
post.insights_video_views || 0,
post.insights_video_views_10s || 0,
JSON.stringify(post.insights_video_views_10s_by_play_type || {}),post.insights_video_views_10s_by_post_attribution || 0,
post.insights_video_views_10s_by_sound || 0,
post.insights_video_views_10s_unique || 0,
post.insights_video_views_30s || 0,
JSON.stringify(post.insights_video_views_30s_by_play_type || {}),
post.insights_video_views_30s_by_post_attribution || 0,
post.insights_video_views_30s_unique || 0,
post.insights_video_views_average_completion || 0,
JSON.stringify(post.insights_video_views_by_play_type || {}),
post.insights_video_views_by_post_attribution || 0,
JSON.stringify(post.insights_video_views_by_sound || {}),
post.insights_video_views_complete || 0,
post.insights_video_views_complete_by_post_attribution || 0,
post.insights_video_views_complete_unique || 0,
post.insights_video_views_complete_unique_by_post_attribution || 0,
JSON.stringify(post.insights_video_views_distribution || {}),
post.insights_video_views_unique || 0,
post.insights_video_views_unique_by_post_attribution || 0,
commentsSentiment.positive || 0,
commentsSentiment.neutral || 0,
commentsSentiment.negative || 0,
JSON.stringify(post.post_labels || [])
];
sheet.appendRow(baseRow);
});
}
//Instagram
function fetchInstaPosts() {
var credentials = Utilities.base64Encode(token + ':' + secret);
var url = 'https://api.emplifi.io/3/instagram/profile/posts';
var payload = {
"profiles": [accountIdInst], // ID de exemplo
"date_start": "2024-01-01",
"date_end": currentdate,
"fields": [
"id", "created_time", "attachments", "content_type", "interactions","insights_engagement", "insights_engagement_by_engagement_type",
"comments",
"insights_reach", "insights_impressions", "insights_video_views",
"insights_initial_video_views", "insights_story_completion_rate",
"insights_story_exits",
"insights_story_replies", "insights_story_taps_back",
"insights_story_taps_forward",
"post_labels", "author", "authorId", "grade", "likes", "media_type",
"origin",
"page", "post_attribution", "sentiment", "url"
]
};
var options = {
'method': 'POST',
'headers': {
'Authorization': 'Basic ' + credentials,
'Content-Type': 'application/json; charset=utf-8'
},
'payload': JSON.stringify(payload)
};
var response = UrlFetchApp.fetch(url, options);
var responseCode = response.getResponseCode();
Logger.log('Response Code: ' + responseCode);
if (responseCode === 200) {
var responseData = JSON.parse(response.getContentText());
Logger.log('Request successful.');
Logger.log(JSON.stringify(responseData, null, 4));
if (responseData && responseData.data && responseData.data.posts) {
saveDataToSheetINST(responseData.data.posts);
} else {
Logger.log('Nenhum post encontrado na resposta da API.');
}
} else {
Logger.log('Failed to retrieve posts: ' + responseCode);
Logger.log(response.getContentText());
}
}
function saveDataToSheetINST(posts) {var sheet =
SpreadsheetApp.getActiveSpreadsheet().getSheetByName('InstagramPostsMetrics')
;
if (!sheet) {
sheet =
SpreadsheetApp.getActiveSpreadsheet().insertSheet('InstagramPostsMetrics');
} else {
sheet.clear(); // Limpa a planilha antes de adicionar novos dados
}
// Adiciona os cabeçalhos
var headers = [
'ID', 'Created Time', 'Content Type', 'Interactions',
'Engagement', 'Comments', 'Reach', 'Impressions', 'Video Views',
'Initial Video Views', 'Story Completion Rate', 'Story Exits',
'Story Replies', 'Story Taps Back', 'Story Taps Forward',
'Likes', 'Grade', 'Media Type', 'Origin', 'Sentiment',
'Post Attribution Status', 'Post Attribution Type', 'Profile ID',
'Profile Name',
'Author ID', 'Author Name', 'Post Labels', 'Attachment Title',
'Attachment Description',
'Attachment Image URL', 'URL'
];
sheet.appendRow(headers);
posts.forEach(function(post) {
var baseRow = [
post.id || 'N/A',
post.created_time || 'N/A',
post.content_type || 'N/A',
post.interactions || 0,
post.insights_engagement || 0,
post.comments || 0,
post.insights_reach || 0,
post.insights_impressions || 0,
post.insights_video_views || 0,
post.insights_initial_video_views || 0,
post.insights_story_completion_rate || 0,
post.insights_story_exits || 0,
post.insights_story_replies || 0,
post.insights_story_taps_back || 0,
post.insights_story_taps_forward || 0,
post.likes || 0,post.grade || 'N/A',
post.media_type || 'N/A',
post.origin || 'N/A',
post.sentiment || 'N/A',
post.post_attribution?.status || 'N/A',
post.post_attribution?.type || 'N/A',
post.page?.id || 'N/A',
post.page?.name || 'N/A',
post.authorId || 'N/A',
post.author?.name || 'N/A',
JSON.stringify(post.post_labels || []), // Salva post_labels como JSON
];
var attachments = post.attachments || [];
if (attachments.length > 0) {
attachments.forEach(function(attachment) {
var row = baseRow.concat([
attachment.title || '',
attachment.description || '',
attachment.image_url || '',
post.url || 'N/A'
]);
sheet.appendRow(row);
});
} else {
var row = baseRow.concat(['', '', '', post.url || 'N/A']);
sheet.appendRow(row);
}
});
}
//Linkedin
function fetchLinkedInPosts() {
var credentials = Utilities.base64Encode(token + ':' + secret);
var url = 'https://api.emplifi.io/3/linkedin/profile/posts';
var payload = {
"profiles": [accountIdLink],
"date_start": "2024-01-01",
"date_end": currentdate,
"fields": ["id", "created_time", "attachments", "content_type", "interactions",
"reactions", "insights_comments", "insights_content_impressions",
"insights_clicks", "insights_video_views", "insights_engagements",
"insights_impressions_engagement_rate", "insights_reactions",
"insights_video_views_unique", "insights_view_time", "post_labels"
]
};
var options = {
'method': 'POST',
'headers': {
'Authorization': 'Basic ' + credentials,
'Content-Type': 'application/json; charset=utf-8'
},
'payload': JSON.stringify(payload)
};
var response = UrlFetchApp.fetch(url, options);
var responseCode = response.getResponseCode();
Logger.log('Response Code: ' + responseCode);
if (responseCode === 200) {
var responseData = JSON.parse(response.getContentText());
Logger.log('Request successful.');
Logger.log(JSON.stringify(responseData, null, 4));
saveDataToSheetLin(responseData);
} else {
Logger.log('Failed to retrieve posts: ' + responseCode);
Logger.log(response.getContentText());
}
}
function saveDataToSheetLin(data) {
var sheet =
SpreadsheetApp.getActiveSpreadsheet().getSheetByName('LinkedinPostsMetrics');
if (!sheet) {
sheet =
SpreadsheetApp.getActiveSpreadsheet().insertSheet('LinkedinPostsMetrics');
} else {
sheet.clear(); // Limpa a planilha antes de adicionar novos dados
}
// Adiciona os cabeçalhos
var headers = ['ID', 'Created Time', 'Content Type', 'Interactions', 'Reactions',
'Comments', 'Content Impressions', 'Clicks', 'Video Views',
'Engagements', 'Impressions Engagement Rate', 'Reactions (Insights)',
'Unique Video Views', 'View Time',
'Attachment Title', 'Attachment Description', 'Attachment URL',
'Attachment Image URL', 'Attachment Type',
'Title Word Count', 'Description Word Count', 'Post Labels'
];
sheet.appendRow(headers);
var posts = data.data.posts || [];
posts.forEach(function(post) {
var baseRow = [
post.id || 'N/A',
post.created_time || 'N/A',
post.content_type || 'N/A',
post.interactions || 0,
post.reactions || 0,
post.insights_comments || 0,
post.insights_content_impressions || 0,
post.insights_clicks || 0,
post.insights_video_views || 0,
post.insights_engagements || 0,
post.insights_impressions_engagement_rate || 0,
post.insights_reactions || 0,
post.insights_video_views_unique || 0,
post.insights_view_time || 0
];
var attachments = post.attachments || [];
var postLabels = JSON.stringify(post.post_labels || []); // Salva
post_labels como JSON
if (attachments.length > 0) {
attachments.forEach(function(attachment) {
var row = baseRow.concat([
attachment.title || '',
attachment.description || '',
attachment.url || '',
attachment.image_url || '',
attachment.type || '',
wordCount(attachment.title || ''),
wordCount(attachment.description || ''),postLabels // Adiciona post_labels diretamente
]);
sheet.appendRow(row);
});
} else {
var row = baseRow.concat(['', '', '', '', '', '', '', '', '', '', '',
postLabels]); // Adiciona colunas vazias e post_labels
sheet.appendRow(row);
}
});
}
function wordCount(text) {
return text.trim().split(/\s+/).length;
}
//TikTok
function fetchTikTokPosts() {
var credentials = Utilities.base64Encode(token + ':' + secret);
var url = 'https://api.emplifi.io/3/tiktok/profile/posts';
var payload = {
"profiles": [accountIdTik], // Substitua pelo ID do perfil do TikTok
"date_start": "2024-01-01",
"date_end": currentdate,
"fields": [
"id", "created_time", "attachments", "author", "authorId",
"content_type",
"duration", "link", "media", "message", "post_labels",
"insights_avg_time_watched",
"insights_comments", "insights_completion_rate",
"insights_engagements", "insights_impressions",
"insights_likes", "insights_reach", "insights_reach_engagement_rate",
"insights_shares",
"insights_video_views", "insights_view_time",
"insights_viewers_by_country"
],
"sort": [
{
"field": "created_time","order": "desc"
}
]
};
var options = {
'method': 'POST',
'headers': {
'Authorization': 'Basic ' + credentials,
'Content-Type': 'application/json; charset=utf-8'
},
'payload': JSON.stringify(payload)
};
var response = UrlFetchApp.fetch(url, options);
var responseCode = response.getResponseCode();
Logger.log('Response Code: ' + responseCode);
if (responseCode === 200) {
var responseData = JSON.parse(response.getContentText());
Logger.log('Request successful.');
Logger.log(JSON.stringify(responseData, null, 4));
saveDataToSheetTikTok(responseData);
} else {
Logger.log('Failed to retrieve posts: ' + responseCode);
Logger.log(response.getContentText());
}
}
function saveDataToSheetTikTok(data) {
var sheet =
SpreadsheetApp.getActiveSpreadsheet().getSheetByName('tiktokpostsMetrics');
if (!sheet) {
sheet =
SpreadsheetApp.getActiveSpreadsheet().insertSheet('tiktokpostsMetrics');
} else {
sheet.clear(); // Limpa a planilha antes de adicionar novos dados
}
// Adiciona os cabeçalhos
var headers = [
'ID', 'Created Time', 'Attachments', 'Author', 'Author ID', 'Content
Type','Duration', 'Link', 'Media', 'Message', 'Post Labels', 'Average Time
Watched',
'Comments', 'Completion Rate', 'Engagements', 'Impressions', 'Likes',
'Reach', 'Reach Engagement Rate', 'Shares', 'Video Views', 'View Time',
'Viewers by Country'
];
sheet.appendRow(headers);
var posts = data.data.posts || [];
posts.forEach(function(post) {
var baseRow = [
post.id || 'N/A',
post.created_time || 'N/A',
JSON.stringify(post.attachments || []), // Salva attachments como JSON
post.author || 'N/A',
post.authorId || 'N/A',
post.content_type || 'N/A',
post.duration || 'N/A',
post.link || 'N/A',
post.media || 'N/A',
post.message || 'N/A',
JSON.stringify(post.post_labels || []), // Salva post_labels como JSON
post.insights_avg_time_watched || 0,
post.insights_comments || 0,
post.insights_completion_rate || 0,
post.insights_engagements || 0,
post.insights_impressions || 0,
post.insights_likes || 0,
post.insights_reach || 0,
post.insights_reach_engagement_rate || 0,
post.insights_shares || 0,
post.insights_video_views || 0,
post.insights_view_time || 0,
JSON.stringify(post.insights_viewers_by_country || []) // Salva
viewers_by_country como JSON
];
sheet.appendRow(baseRow);
});
}
//Youtube - Nível de post (videos)function fetchYouTubeVideos() {
var credentials = Utilities.base64Encode(token + ':' + secret);
var url = 'https://api.emplifi.io/3/youtube/profile/videos';
var payload = {
"profiles": [accountIdYT], // Substitua pelo ID do canal desejado
"date_start": "2024-01-01",
"date_end": currentdate,
"fields": [
"author", "created_time", "description", "duration", "id",
"insights_engagement", "interactions", "likes", "media_type",
"post_labels", "url", "video_view_time", "video_views",
"comments", "interactions_per_1k_fans", "dislikes", "profileId"
],
"sort": [
{
"field": "created_time",
"order": "desc"
}
]
};
var options = {
'method': 'POST',
'headers': {
'Authorization': 'Basic ' + credentials,
'Content-Type': 'application/json; charset=utf-8'
},
'payload': JSON.stringify(payload)
};
try {
var response = UrlFetchApp.fetch(url, options);
var responseCode = response.getResponseCode();
Logger.log('Response Code: ' + responseCode);
if (responseCode === 200) {
var responseData = JSON.parse(response.getContentText());
Logger.log('Request successful.');
Logger.log(JSON.stringify(responseData, null, 4));
saveVideosToSheetYT(responseData);
} else {
Logger.log('Failed to retrieve videos: ' + responseCode);
Logger.log(response.getContentText());}
} catch (e) {
Logger.log('Error: ' + e.message);
}
}
function saveVideosToSheetYT(data) {
var sheet =
SpreadsheetApp.getActiveSpreadsheet().getSheetByName('youtubeVideosMetrics');
if (!sheet) {
sheet =
SpreadsheetApp.getActiveSpreadsheet().insertSheet('youtubeVideosMetrics');
} else {
sheet.clear(); // Limpa a planilha antes de adicionar novos dados
}
// Adiciona os cabeçalhos
var headers = [
'Video ID', 'Author Name', 'Author URL', 'Created Time', 'Description',
'Duration (s)',
'Interactions', 'Likes', 'Media Type', 'URL', 'Video View Time', 'Video
Views',
'Comments', 'Interactions per 1K Fans', 'Dislikes', 'Profile ID', 'Post
Labels'
];
sheet.appendRow(headers);
data.data.posts.forEach(function(post) {
var postId = post.id || 'N/A';
var authorName = post.author ? post.author.name : 'N/A';
var authorUrl = post.author ? post.author.url : 'N/A';
var createdTime = post.created_time || 'N/A';
var description = post.description || 'N/A';
var duration = post.duration || 0;
var interactions = post.interactions || 0;
var likes = post.likes || 0;
var mediaType = post.media_type || 'N/A';
var url = post.url || 'N/A';
var videoViewTime = post.video_view_time || 0;
var videoViews = post.video_views || 0;
var comments = post.comments || 0;
var interactionsPer1KFans = post.interactions_per_1k_fans || 0;
var dislikes = post.dislikes || 0;var profileId = post.profileId || 'N/A';
var postLabels = JSON.stringify(post.post_labels || []); // Salva
post_labels como JSON
// Constrói a linha de dados
var row = [
postId, authorName, authorUrl, createdTime, description, duration,
interactions, likes, mediaType, url, videoViewTime, videoViews,
comments, interactionsPer1KFans, dislikes, profileId, postLabels
];
sheet.appendRow(row);
});
}
//Youtube - Nível de conta
function fetchYouTubeMetrics() {
var credentials = Utilities.base64Encode(token + ':' + secret);
var url = 'https://api.emplifi.io/3/youtube/metrics';
var payload = {
"date_start": "2024-01-01",
"date_end": currentdate,
"profiles": [accountIdYT],
"metrics": [
"interaction_change",
"interactions_per_1k_fans",
"subscribers_change",
"subscribers_lifetime",
"video_lifetime",
"viewed_time_change",
"views_change"
],
"dimensions": [
{
"type": "date.day"
}
]
};
var options = {
'method': 'POST',
'headers': {
'Authorization': 'Basic ' + credentials,'Content-Type': 'application/json; charset=utf-8'
},
'payload': JSON.stringify(payload)
};
var response = UrlFetchApp.fetch(url, options);
var responseCode = response.getResponseCode();
Logger.log('Response Code: ' + responseCode);
if (responseCode === 200) {
var responseData = JSON.parse(response.getContentText());
Logger.log('Request successful.');
Logger.log(JSON.stringify(responseData, null, 4));
saveMetricsToSheet(responseData);
} else {
Logger.log('Failed to retrieve metrics: ' + responseCode);
Logger.log(response.getContentText());
}
}
function saveMetricsToSheet(data) {
var sheet =
SpreadsheetApp.getActiveSpreadsheet().getSheetByName('YoutubeProfileMetrics')
;
if (!sheet) {
sheet =
SpreadsheetApp.getActiveSpreadsheet().insertSheet('YoutubeProfileMetrics');
} else {
sheet.clear(); // Limpa a planilha antes de adicionar novos dados
}
// Adiciona o cabeçalho
var headers = ["Date", "Interaction Change", "Interactions per 1K Fans",
"Subscribers Change",
"Subscribers Lifetime", "Video Lifetime", "Viewed Time
Change", "Views Change"];
sheet.appendRow(headers);
var dates = data.header[0].rows;
var metricsData = data.data;
for (var i = 0; i < dates.length; i++) {
var row = [dates[i]].concat(metricsData[i]);
sheet.appendRow(row);}
}
