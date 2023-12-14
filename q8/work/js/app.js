"use strict";

$(function () {
  let pageNum = 0;
  let prevWord = "";

  $(".search-btn").on("click", function () {
    pageNum = pageNum + 1
    var searchWord = $("#search-input").val();
    if (searchWord !== prevWord) { //サーチワードと前回のワードが異なる場合、ページを１にリセットし、リストをemptyで無にする。
      pageNum = 1;
      $(".lists").empty();
      $(".message").remove();
      prevWord = searchWord;
    } else {
      pageNum++;//同じ検索ワードが使用されている場合はページ数を増やす。
    }


    // 変数settingsに設定情報などを格納
    const settings = {
      "url": `https://ci.nii.ac.jp/books/opensearch/search?title=${searchWord}&format=json&p=${pageNum}&count=20`,
      "method": "GET",
    }

    $.ajax(settings).done(function (response) {
      const result = response['@graph'];
      displayResult(result)
      console.log(result);
    }).fail(function (err) {
      displayError(err)
    });

    function displayResult(data) {
      if (data[0].items) {
        var list = "";
        $(".comment").remove();
        for (var i = 0; i < data[0].items.length; i++) {
          list += `<li class=lists-item>` +
            `<div class=list-inner>` +
            `<p>作品名：　${data[0].items[i].title}</p>` +
            `<p>作者　：　${data[0].items[i]["dc:creator"]}</p>` +
            `<p>出版社：　${data[0].items[i]["dc:publisher"]}</p>` +
            `<a href=${data[0].items[i]["@id"]} target=_blank>書籍情報</a>` +
            `</div>` + `</li>`;
        };
        $(".lists").prepend(list);
      } else {
        $(".comment").remove();
        $(".lists").before("<div class='comment'></div>");
        $(".comment").html("<p class='message'>検索結果が見つかりませんでした。<br>別のキーワードで検索して下さい。</p>");
      };
    }
  })
});


$(".reset-btn").on("click", function () {
  pageNum = 0;
  prevWord = "";
  $(".lists").empty();
  $("#search-input").val("");
  $(".message").remove();
});//リセットボタンを押すとページ数を１に、検索結果と条件をリセット


function displayError(err) {
  $(".lists").before('<div class="message">エラーが発生しました。<br>再度更新してください。</div>');
}//APIがうまく送信されなかったときのエラー



//  変数settingsに設定情報などを格納
// const settings = {
//    実行するURL。実行するURLのことをエンドポイントと言います。
//   "url": `https://ci.nii.ac.jp/books/opensearch/search?
//   title=${searchWord}&format=json&p=${pageCount}&count=20`,
//    サーバーに送るメソッド
//   "method": "GET",
//   }
//    Ajaxの実行
//   .doneが通信成功した時の処理、”response”が引数となっていて通信した結果を受け取ってい
//   る
//   $.ajax(settings).done(function (response) {
//   .failが通信に失敗した時の処理、”err”にサーバーから送られてきたエラー内容を受け取って
//   いる。
//   }).fail(function (err) {
//   });



