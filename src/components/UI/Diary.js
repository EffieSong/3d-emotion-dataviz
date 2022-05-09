/* Manage the events after user input (diary writing), 
including DOM events and threejs scene events by sending callback functions as parameters */

import * as TWEEN from '@tweenjs/tween.js'
import {
    Tween
} from '@tweenjs/tween.js';
import {
    PROMPTS
} from './scriptableObj.js'

export default class Diary {
    constructor(opts = {}) {

        // dom elements
        this.parentWrapper = opts.parentWrapper,
            this.submitBtn = opts.submitBtn,
            this.inputBox = opts.inputBox,

            // events
            this.event_afterWritingEmotions = opts.event_afterWritingEmotions,
            this.event_afterNaming = opts.event_afterNaming,
            this.event_afterWritingThought = opts.event_afterWritingThought,

            //private property
            this.offset = 400;
        this.prompt = PROMPTS;
        this.contentIndex = 0;

        this.init();

        //public property
        this.writingIsDone = false;
        this.diaryData = { // store data from user input
            time: "",
            type: "love",
            relatedEvent: "",
            emotions: [],
            event: "",
            thoughts: "",
            bodyReaction: "",
            nameOfFeelings: ""
        }
    }
    init() {
        this.inputBox.setAttribute("style", "height:"+this.inputBox.scrollHeight  + "px;overflow-y:hidden;");
        this.inputBox.addEventListener("input", OnInput, false);

        function OnInput() {
            this.style.height = "1em";
            this.style.height = (this.scrollHeight) + "px";
             console.log(   this.style.height);
        }

        this.submitBtn.addEventListener("click", () => {
            this.addWritingContent(this.contentIndex);
            this.wrapperGoUp(this.contentIndex);

            //reset inputBox height
            this.inputBox.style.height =  '56px';

            if (this.contentIndex == 0) {
                this.diaryData.event = this.inputBox.value;
            }
            if (this.contentIndex == 1) {
                this.event_afterWritingEmotions(this.inputBox.value);
                this.diaryData.emotions = this.inputBox.value.split(', ');
            }
            if (this.contentIndex == 2) {
                this.diaryData.bodyReaction = this.inputBox.value;
            }
            if (this.contentIndex == 3) {
                this.event_afterWritingThought(this.inputBox.value);
                this.diaryData.thoughts = this.inputBox.value;
            }
            if (this.contentIndex == 4) {
                this.event_afterNaming(this.inputBox.value)
                this.finishWriting();
                this.diaryData.nameOfFeelings = this.inputBox.value;

            };

            this.contentIndex++;
            setTimeout(() => {
                this.nextPromptAppear(this.contentIndex);
            }, 900);
            this.inputBox.value = "";
        });
    }

    finishWriting() {

        /*---------------------------------UI ANIMATION---------------------------*/

        this.inputBox.style.display = "none";
        this.submitBtn.style.display = "none";

        //create store button

        let storeButton = document.querySelector('.storeButton');

        storeButton.addEventListener("click", () => {

            //storeButton disapear animation
            storeButton.style.visibility = 'hidden';
            this.writingIsDone = true;
        })

        let buttonStyle = {
            opacity: 0
        }

        let tween_buttonAppear = new TWEEN.Tween(buttonStyle)
            .to({
                opacity: 1
            }, 4000)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(() => {
                storeButton.style.opacity = `${buttonStyle.opacity}`
            })

        let WritingUI = {
            opacity: 1
        }
        let divider = document.querySelector('.divider');

        let tween_WritingUIHided = new TWEEN.Tween(WritingUI)
            .to({
                opacity: 0
            }, 400)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(() => {
                divider.style.opacity = `${WritingUI.opacity}`;
                this.parentWrapper.style.opacity = `${WritingUI.opacity}`
            })

        //after 5 seconds, button appear, writingUI Disappear

        setTimeout(() => {
            storeButton.style.display = "block";
            tween_buttonAppear.start()
        }, 7000)

        setTimeout(() => {
            tween_WritingUIHided.start()
        }, 7000)
    }

    getStatus() {
        return this.writingIsDone //:boolean
    }

    getDiaryData() {
        return this.diaryData //:object
    }

    addWritingContent(promptIndex) {
        let currContentWrapper = document.querySelector(`#contentWrapper${promptIndex}`);
        let myWriting = document.createElement('p');
        myWriting.className = "myWriting";
        myWriting.innerText = this.inputBox.value; //这一行有bug
        currContentWrapper.appendChild(myWriting);
        // console.log(currContentWrapper);
        promptIndex < 1 || this.parentWrapper.appendChild(currContentWrapper);
    }

    nextPromptAppear(index) {
        let nextContentWrapper = document.createElement('div');
        nextContentWrapper.id = `contentWrapper${index}`
        let nextPrompt = document.createElement('p');
        nextPrompt.className = "prompt";
        nextPrompt.innerHTML = PROMPTS[index];
        nextContentWrapper.appendChild(nextPrompt);
        this.parentWrapper.appendChild(nextContentWrapper);

        // add an animation

        let promptParameters = {
            opacity: 0,
            translateY: 100 // 10%
        }

        let tween_promptAppear = new TWEEN.Tween(promptParameters)
            .to({
                opacity: 1,
                //  translateY:0
            }, 300)
            .easing(TWEEN.Easing.Cubic.Out).onUpdate(() => {
                nextPrompt.style.opacity = `${promptParameters.opacity}`;
                //   nextPrompt.style.transform = `translateY(${promptParameters.translateY}%)`;

            }).start();

        this.wrapperGoUp(this.contentIndex, 0);


    }

    wrapperGoUp(ContentWrapperIndex, promtOrInput = 1) {
        console.log(ContentWrapperIndex);
        let currContentWrapper = document.querySelector(`#contentWrapper${ContentWrapperIndex}`);

         let currInputWrapper  = currContentWrapper.querySelectorAll('p')[promtOrInput];
         let lineHeight = parseFloat(getComputedStyle(currInputWrapper).height);
         let lineMarginTop = parseFloat(getComputedStyle(currInputWrapper).marginTop);

        let height = lineHeight+lineMarginTop; 


        let writingContainerParameters = {
            top: parseFloat(getComputedStyle(this.parentWrapper).top) // get number from string //.replace(/[^0-9]/g,'')
        }

        // animation

        let tween_wrapperGoUp = new TWEEN.Tween(writingContainerParameters)
            .to({
                top: `-${height}`,
                //  translateY:0
            }, promtOrInput == 0 ? 400 : 0)
            .easing(TWEEN.Easing.Cubic.Out).onUpdate(() => {
                this.parentWrapper.style.top = writingContainerParameters.top + 'px';
            }).start();

    }



}