import { tweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like);
    } else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet);
    } else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply);
    } else if (e.target.classList.contains("tweet-btn-answer")) {
        handleAnswerButtonClick(e.target.dataset.tweet);
    } else if (e.target.id === "tweet-btn") {
        handleTweetBtnClick();
    }
});


function showReplyForm(tweetId) {
    const replyFormHtml = `
        <div class="tweet-input-area" id="reply-form-${tweetId}">
            <img src="images/scrimbalogo.png" class="profile-pic-answer">
            <textarea 
                name="tweet-input-answer-${tweetId}" 
                id="tweet-input-answer-${tweetId}"
                placeholder="Answer here!"></textarea>
            <button class="tweet-btn-answer" data-tweet="${tweetId}">Answer</button>
        </div>`;
    document.getElementById(tweetId).insertAdjacentHTML('beforeend', replyFormHtml);
}

function handleAnswerButtonClick(tweetId) {
    const tweetInputAnswer = document.getElementById(`tweet-input-answer-${tweetId}`);
    if (tweetInputAnswer.value) {
      const tweet = tweetsData.find((tweet) => tweet.uuid === tweetId);
      tweet.replies.push({
        tweetText: tweetInputAnswer.value,
        profilePic: `images/scrimbalogo.png`,
        handle: `@scrimba`,
      });
      tweetInputAnswer.value = "";
      renderFeedToHtml();
      document.getElementById(`reply-form-${tweetId}`).remove();
    }
  }

document.addEventListener('keypress', function(e){
    if (e.key === "Enter"){
        e.preventDefault()
        handleTweetBtnClick()
    }
})

// function answerToTweet() {
//     tweetsData.forEach(function(tweet){
//     const tweetInputAnswer = document.getElementById(`tweet-input-answer-${tweet.uuid}`)
//     console.log(tweetInputAnswer.value)
//     // if (tweetInputAnswer.value){
//     //     tweetsData[1].replies.push({
//     //         tweetText: tweetInputAnswer.value,
//     //         profilePic: `images/scrimbalogo.png`,
//     //         handle: `@scrimba`,
//     //     })
//     //     tweetInputAnswer.value = ""
//     //     renderFeedToHtml()
//     //     document.getElementById("3c23454ee-c0f5-9g9g-9c4b-77835tgs2").classList.remove("hidden")
//     // }
//     })
// }

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if (tweetInput.value){
        tweetsData.unshift({
            tweetText: tweetInput.value,
            uuid: uuidv4(),
            profilePic: `images/scrimbalogo.png`,
            handle: `@scrimba`,
            likes: 0,
            retweets: 0,
            replies: [],
            isLiked: false,
            isRetweeted: false
        })
        tweetInput.value = ""
        renderFeedToHtml()
    }
   
}

function handleReplyClick(tweetId) {
    const replyForm = document.getElementById(`reply-form-${tweetId}`);
    if (!replyForm) {
      showReplyForm(tweetId);
      // Fügen Sie hier den Event-Listener für den "Answer" -Button hinzu
      const answerButton = document.querySelector(`#reply-form-${tweetId} .tweet-btn-answer`);
      answerButton.addEventListener('click', () => handleAnswerButtonClick(tweetId));
    } else {
      replyForm.remove();
    }
}



function handleRetweetClick(tweetId){
    const tweetRetweetObj = tweetsData.filter(tweet => tweet.uuid === tweetId)[0]
    if (tweetRetweetObj.isRetweeted) {
        tweetRetweetObj.retweets--
    } else {
        tweetRetweetObj.retweets++
    }
    tweetRetweetObj.isRetweeted = !tweetRetweetObj.isRetweeted
    renderFeedToHtml()
}

function handleLikeClick(tweetId){
    const targetTweetObj = tweetsData.filter(tweet => tweet.uuid === tweetId)[0]
    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    } else {
        targetTweetObj.likes++  
    } 
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    renderFeedToHtml()
}

function renderFeedToHtml() {
    const feed = document.getElementById("feed")
    feed.innerHTML = getFeedHtml()
}

function getFeedHtml() {
    let feedHtml = ""
    tweetsData.forEach(function(tweet){
        let likeIconClass = ""
        if (tweet.isLiked){
            likeIconClass = "liked"
        }
        let retweetIconClass = ""
        if (tweet.isRetweeted) {
            retweetIconClass = "retweeted"
        }
           
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach( function(tweety){ 
             repliesHtml += `<div class="tweet-reply">
                                <div class="tweet-inner">
                                    <img src="${tweety.profilePic}" class="profile-pic">
                                        <div>
                                            <p class="handle">${tweety.handle}</p>
                                            <p class="tweet-text">${tweety.tweetText}</p>
                                        </div>
                                </div>
                                
                             </div>`
            })
        
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="${tweet.uuid}">
        ${repliesHtml}
        
</div>
`
    })
    return feedHtml
}

renderFeedToHtml()