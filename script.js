function start() {
    let currentBook, currentChapter, currentVerse;

    function searchVerse() {
        const book = $("#book").val();
        const chapter = $("#chapter").val();
        const verse = $("#verse").val();

        if (!book || !chapter || !verse) {
            alert("Por favor, preencha todos os campos Livro, Capítulo e Versículo");
            return;
        } else {
            getVerses(book, chapter, verse)
                .then(function (data) {
                    if (data.text) {
                        console.log("Request 200 Ok");
                    }
                })
                .catch(function (error) {
                    $("#back").prop("disabled", true);
                    alert("Não foram encontrados versículos para os parâmetros informados " + error);
                });
        }
    }

    function getVerses(book, chapter, verse) {
        return new Promise(function (resolve, reject) {
            const url = `https://bible-api.com/${book}+${chapter}:${verse}?translation=almeida`;
            $.getJSON(url)
                .done(function (data) {
                    if (data.text) {
                        currentBook = data.verses[0].book_name;
                        currentChapter = data.verses[0].chapter;
                        currentVerse = data.verses[0].verse;
                        $("#result").val(`${currentBook} ${currentChapter}:${currentVerse} ${data.text}`);
                        $("#next").prop("disabled", false);
                        $("#back").prop("disabled", false);
                        resolve(data);
                    }
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 404) {
                        console.log("Não foram encontrados versículos para os parâmetros informados")
                        reject(errorThrown);
                    }
                });
        });
    }


    function nextVerse() {
        if (!currentBook || !currentChapter || !currentVerse) {
            alert("Por favor, pesquise um versículo primeiro.");
            return;
        }

        let nextVerse = Number(currentVerse) + 1;
        $("#verse").val(nextVerse);

        getVerses(currentBook, currentChapter, nextVerse)
            .then(function (data) {
                if (data.text) {
                    console.log("Request 200 Ok");
                }
            })
            .catch(function (error) {
                $("#next").prop("disabled", true);
                $("#verse").val(currentVerse);
                console.log("Ocorreu um erro ao buscar o próximo versículo: " + error);
            });
    }


    function backVerse() {
        if (!currentBook || !currentChapter || !currentVerse) {
            alert("Por favor, pesquise um versículo primeiro.");
            return;
        }

        let backVerse = Number(currentVerse) - 1;
        $("#verse").val(backVerse);

        getVerses(currentBook, currentChapter, backVerse)
            .then(function (data) {
                if (data.text) {
                    console.log("Request 200 Ok");
                }
            })
            .catch(function (error) {
                $("#back").prop("disabled", true);
                $("#verse").val(currentVerse);
                console.log("Ocorreu um erro ao buscar o versículo aterior: " + error);
            });
    }
}

start();