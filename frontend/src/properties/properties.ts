/* eslint-disable no-undef */
const testing = {
    apiUrl: "http://localhost:8080/",
    maxFileSize: 31_457_280,
    searchContextOffset: 5,
    minSearchContextOffset: 100,
    yandexOauthUri: "https://oauth.yandex.ru/authorize?response_type=code&client_id=03654187bbae4904a7cf529736c3b898"
}

const production = {
    apiUrl: "https://notes.iliya132apps.ru/",
    maxFileSize: 31_457_280,
    searchContextOffset: 5,
    minSearchContextOffset: 100,
    yandexOauthUri: "https://oauth.yandex.ru/authorize?response_type=code&client_id=2527c5df57c04b36960c4b4e9b288ae5"
}

export default PRODUCTION ? production : testing;
